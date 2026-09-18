import { PGlite } from '@electric-sql/pglite';
import { parcels } from '../data/parcels.ts';

export async function createDatabase(options: ConstructorParameters<typeof PGlite>[0] = {}) {
  const db = new PGlite(options);
  await db.waitReady;
  await db.exec(`CREATE TABLE parcels (
    id integer PRIMARY KEY, first_name text NOT NULL, last_name text NOT NULL,
    color text NOT NULL, shelf text NOT NULL, weight_kg numeric NOT NULL
  );`);
  for (const p of parcels) {
    await db.query('INSERT INTO parcels (id, first_name, last_name, color, shelf, weight_kg) VALUES ($1,$2,$3,$4,$5,$6)', [p.id, p.first_name, p.last_name, p.color, p.shelf, p.weight_kg]);
  }
  // A restricted role is a second boundary beyond the single-statement query API.
  await db.exec(`CREATE ROLE learner; GRANT USAGE ON SCHEMA public TO learner;
    GRANT SELECT ON parcels TO learner; SET ROLE learner;`);
  return db;
}

export async function executeSelect(db: PGlite, sql: string) {
  if (sql.length > 8000) throw new Error('Запит задовгий. Спробуйте коротший SELECT.');
  if (!/^\s*SELECT\b/i.test(sql)) throw new Error('У цій зміні використовуйте SELECT.');
  return db.transaction(async tx => {
    await tx.exec('SET TRANSACTION READ ONLY');
    // Extended protocol accepts one statement. Read-only transaction protects the seed.
    const result = await tx.query<Record<string, unknown>>(sql);
    if (result.rows.length > 100) throw new Error('Забагато рядків для preview (максимум 100).');
    return { columns: result.fields.map(f => f.name), rows: result.rows };
  });
}
