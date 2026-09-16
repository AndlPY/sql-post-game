export interface QueryResult { columns: string[]; rows: Record<string, unknown>[] }

export class SqlClient {
  private worker!: Worker;
  private nextId = 0;
  private pending = new Map<number, { resolve: (r: QueryResult) => void; reject: (e: Error) => void; timer: ReturnType<typeof setTimeout> }>();
  ready!: Promise<void>;
  constructor() { this.start(); }
  private start() {
    this.worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
    this.ready = new Promise<void>((resolve, reject) => {
      const initTimer = setTimeout(() => { this.worker.terminate(); reject(new Error('PostgreSQL не завантажився. Оновіть сторінку.')); }, 45000);
      this.worker.onerror = () => { clearTimeout(initTimer); reject(new Error('Не вдалося запустити SQL Worker.')); };
      this.worker.onmessage = ({ data }) => {
        if (data.ready) { clearTimeout(initTimer); resolve(); return; }
        if (data.initError) { clearTimeout(initTimer); reject(new Error(data.initError)); return; }
        const request = this.pending.get(data.id);
        if (!request) return;
        clearTimeout(request.timer); this.pending.delete(data.id);
        if (data.error) request.reject(new Error(data.error)); else request.resolve(data.result);
      };
    });
    // A later query/UI can observe rejection without an unhandled promise event.
    void this.ready.catch(() => undefined);
  }
  async query(sql: string) {
    await this.ready;
    return new Promise<QueryResult>((resolve, reject) => {
      const id = ++this.nextId;
      const timer = setTimeout(() => {
        this.worker.terminate();
        for (const p of this.pending.values()) { clearTimeout(p.timer); p.reject(new Error('Запит виконувався надто довго. Базу перезапущено; спробуйте простіший SELECT.')); }
        this.pending.clear(); this.start();
      }, 4000);
      this.pending.set(id, { resolve, reject, timer });
      this.worker.postMessage({ id, sql });
    });
  }
}
