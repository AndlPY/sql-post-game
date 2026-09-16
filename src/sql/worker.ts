import { createDatabase, executeSelect } from './database';
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
self.onmessage = (event: MessageEvent<{ id: number; sql: string }>) => {
  const { id, sql } = event.data;
  queue = queue.then(async () => {
    try { self.postMessage({ id, result: await executeSelect(await database, sql) }); }
    catch (error) { self.postMessage({ id, error: error instanceof Error ? error.message : String(error) }); }
  });
};
