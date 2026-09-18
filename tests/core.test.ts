import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createDatabase, executeSelect } from '../src/sql/database.ts';
import { orders } from '../src/content.ts';
import { parcels } from '../src/data/parcels.ts';
import { getLevel } from '../src/levels.ts';
import { assess, starsFor, customerPayment, shiftSummary } from '../src/game/rules.ts';
import { parseProfile } from '../src/profile.ts';
import { demoOrder, uiSteps, sqlSteps } from '../src/tutorial-content.ts';

test('PostgreSQL: all thirteen reference solutions select the right parcel', async () => {
  const db = await createDatabase();
  try {
    assert.equal(orders.length, 13);
    assert.equal(orders.reduce((sum, o) => sum + o.reward, 0), 190);
    assert.equal(demoOrder.reward, 0);
    assert.ok(!orders.some(order => order.parcelId === demoOrder.parcelId));
    assert.deepEqual(assess(await executeSelect(db, demoOrder.solution), demoOrder), { kind: 'delivery', correct: true });
    assert.deepEqual(assess(await executeSelect(db, orders[0].solution), demoOrder), { kind: 'delivery', correct: false });
    for (const order of orders) {
      const result = await executeSelect(db, order.solution);
      assert.deepEqual(assess(result, order), { kind: 'delivery', correct: true });
    }
    assert.equal((await executeSelect(db, "SELECT id FROM parcels WHERE last_name = 'Коваль'")).rows[0].id, 1042);
    assert.equal((await executeSelect(db, 'select id from parcels where id=1042')).rows[0].id, 1042);
    assert.deepEqual(assess(await executeSelect(db, 'SELECT * FROM parcels WHERE id = 1124'), orders[4]), { kind: 'delivery', correct: true });
    assert.deepEqual(assess(await executeSelect(db, 'SELECT id FROM parcels WHERE id = 1124'), orders[4]), { kind: 'delivery', correct: true });
    assert.deepEqual(assess(await executeSelect(db, 'SELECT * FROM parcels WHERE weight_kg = 2800 / 1000.0'), orders[12]), { kind: 'delivery', correct: true });
    assert.equal(assess(await executeSelect(db, 'SELECT * FROM parcels WHERE weight_kg = 2800'), orders[12]).kind, 'notice');
    for (const query of ['DROP TABLE parcels', 'UPDATE parcels SET id = 7', 'SELECT 1; DROP TABLE parcels;', 'SELECT * INTO copied FROM parcels']) {
      await assert.rejects(() => executeSelect(db, query));
    }
    assert.equal((await executeSelect(db, 'SELECT * FROM parcels')).rows.length, parcels.length);
    assert.equal(assess(await executeSelect(db, 'SELECT * FROM parcels WHERE id = 0'), orders[0]).kind, 'notice');
    assert.equal(assess(await executeSelect(db, 'SELECT * FROM parcels'), orders[0]).kind, 'notice');
    assert.deepEqual(assess(await executeSelect(db, 'SELECT * FROM parcels WHERE id = 1057'), orders[0]), { kind: 'delivery', correct: false });
    await assert.rejects(() => executeSelect(db, 'SELECT invalid_column FROM parcels'));
    assert.equal((await executeSelect(db, 'SELECT id FROM parcels WHERE id = 1042')).rows.length, 1);
  } finally { await db.close(); }
});

test('shared warehouse: level-two clues distinguish repeated recipients', async () => {
  const db = await createDatabase();
  try {
    for (const order of getLevel(2).orders) {
      const target = parcels.find(parcel => parcel.id === order.parcelId)!;
      const found = await executeSelect(db, order.search!);
      assert.ok(found.rows.some(row => row.id === target.id));
      if (order.cohort === 'easy' || order.cohort === 'medium') {
        assert.ok(parcels.filter(parcel => parcel.last_name === target.last_name).length > 1);
        assert.deepEqual(found.rows.filter(row => row.last_name === target.last_name).map(row => row.id), [target.id]);
      } else {
        assert.deepEqual(found.rows.map(row => row.id), [target.id]);
      }
      assert.deepEqual(assess(await executeSelect(db, order.solution), order), { kind: 'delivery', correct: true });
    }
  } finally { await db.close(); }
});

test('mistakes reduce potential customer payment; total and scored clients are distinct', () => {
  assert.deepEqual([0,1,2,3].map(n => customerPayment(20,n)), [20,15,10,5]);
  assert.deepEqual([0,1,2,3].map(n => customerPayment(10,n)), [10,5,0,0]);
  assert.equal(customerPayment(30,2),20);
  // Third failure leaves without payment; only success consumes the potential payment.
  const originalWallet = 50;
  assert.equal(originalWallet + customerPayment(20,1),65);
  assert.deepEqual(shiftSummary(11,true), { total:12,main:11,bonus:true,stars:2 });
  assert.deepEqual(shiftSummary(12,false), { total:12,main:12,bonus:false,stars:3 });
  assert.deepEqual(shiftSummary(12,true), { total:13,main:12,bonus:true,stars:3 });
});

test('star boundaries and profile validation', () => {
  assert.deepEqual([0,5,6,9,10,11,12].map(starsFor), [0,0,1,1,2,2,3]);
  assert.equal(parseProfile(null).coins, 0);
  assert.throws(() => parseProfile('{bad'));
  assert.throws(() => parseProfile(JSON.stringify({ version: 1, nickname: 'test', gender: 'male', coins: -5, stars: 2, completed: false })));
  const valid = { version: 1, nickname: 'Тест', gender: 'female', coins: 40, stars: 2, completed: false };
  assert.deepEqual(parseProfile(JSON.stringify(valid)), valid);
  assert.equal(parseProfile(JSON.stringify({ ...valid, uiTutorialSeen: true })).uiTutorialSeen, true);
  assert.throws(() => parseProfile(JSON.stringify({ ...valid, uiTutorialSeen: 'true' })));
});

test('tutorial sequence teaches the UI before SQL and waits for a real delivery', () => {
  assert.ok(uiSteps.length > 0);
  assert.ok(uiSteps.every(step => !step.writeDemo && !step.awaitDelivery));
  assert.equal(sqlSteps[0].writeDemo, true);
  assert.equal(sqlSteps.at(-1)?.awaitDelivery, true);
  for (const step of sqlSteps) if (step.phrase) assert.ok(demoOrder.solution.includes(step.phrase));
});
