import { DatabaseSync } from "node:sqlite";
import { readFileSync, readdirSync } from "node:fs";

// Exercise real SQLite constraints and upserts using the small D1 interface the site uses.
export class TestDatabase {
  constructor() {
    this.db = new DatabaseSync(":memory:");
    const directory = new URL("../migrations/", import.meta.url);
    for (const file of readdirSync(directory).filter((file) => file.endsWith(".sql")).sort()) this.db.exec(readFileSync(new URL(file, directory), "utf8"));
    this.queue = Promise.resolve();
  }
  prepare(sql) {
    const stmt = this.db.prepare(sql);
    const make = (values = []) => ({
      bind: (...args) => make(args),
      first: async () => stmt.get(...values) || null,
      all: async () => ({ results: stmt.all(...values) }),
      run: async () => ({ meta: { changes: Number(stmt.run(...values).changes) } })
    });
    return make();
  }
  batch(statements) {
    this.queue = this.queue.catch(() => {}).then(() => this.runBatch(statements));
    return this.queue;
  }
  async runBatch(statements) {
    this.db.exec("BEGIN");
    try {
      const result = [];
      for (const stmt of statements) result.push(await stmt.run());
      this.db.exec("COMMIT");
      return result;
    } catch (error) { this.db.exec("ROLLBACK"); throw error; }
  }
}

export class MemoryKv {
  values = new Map();
  metadata = new Map();
  async get(key, type) {
    const value = this.values.get(key);
    return value === undefined ? null : type === "json" ? JSON.parse(value) : value;
  }
  async put(key, value, options) { this.values.set(key, value); this.metadata.set(key, options?.metadata); }
  async getWithMetadata(key) { return { value: this.values.get(key) || null, metadata: this.metadata.get(key) }; }
  async delete(key) { this.values.delete(key); }
}

export function createEnv() {
  return { EBENTEE_CONTENT: new MemoryKv(), EBENTEE_RECORDS: new TestDatabase(), ADMIN_PIN: "123456", SESSION_SECRET: "isolated-test-only-session-secret", ADMIN_RECOVERY_KEY: "TEST-RECOVERY-CODE" };
}
