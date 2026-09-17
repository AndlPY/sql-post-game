import { createDatabase, executeSelect, replaceCatalog } from './database';
import { getLevel } from '../levels';
import wasmUrl from '../../node_modules/@electric-sql/pglite/dist/pglite.wasm?url';
import dataUrl from '../../node_modules/@electric-sql/pglite/dist/pglite.data?url';
import initUrl from '../../node_modules/@electric-sql/pglite/dist/initdb.wasm?url';

const database = Promise.all([
  fetch(wasmUrl).then(async r => { if (!r.ok) throw new Error('Не завантажено WASM'); return WebAssembly.compile(await r.arrayBuffer()); }),
  fetch(dataUrl).then(async r => { if (!r.ok) throw new Error('Не завантажено PostgreSQL'); return r.blob(); }),
  fetch(initUrl).then(async r => { if (!r.ok) throw new Error('Не завантажено initdb'); return WebAssembly.compile(await r.arrayBuffer()); }),
]).then(([pgliteWasmModule, fsBundle, initdbWasmModule]) => createDatabase({ pgliteWasmModule, fsBundle, initdbWasmModule }));

database.then(() => self.postMessage({ ready: true })).catch(error => self.postMessage({ initError: String(error) }));
let queue = Promise.resolve();
let catalogLevel = 1;
self.onmessage = (event: MessageEvent<{ id: number; sql: string; levelId?: number }>) => {
  const { id, sql, levelId = 1 } = event.data;
  queue = queue.then(async () => {
    try {
      const db = await database;
      if (catalogLevel !== levelId) { await replaceCatalog(db, getLevel(levelId).parcels); catalogLevel = levelId; }
      self.postMessage({ id, result: await executeSelect(db, sql) });
    }
    catch (error) { self.postMessage({ id, error: error instanceof Error ? error.message : String(error) }); }
  });
};
