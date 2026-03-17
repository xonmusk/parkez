import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_PATH = path.join(process.cwd(), "velnyx.db");
const SCHEMA_PATH = path.join(process.cwd(), "db", "schema.sql");

let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma("journal_mode = WAL");
    _db.pragma("foreign_keys = ON");

    // Auto-create tables
    const schema = fs.readFileSync(SCHEMA_PATH, "utf-8");
    _db.exec(schema);
  }
  return _db;
}

export const db = {
  query<T = any>(sql: string, params: any[] = []): T[] {
    const stmt = getDb().prepare(sql);
    return stmt.all(...params) as T[];
  },

  get<T = any>(sql: string, params: any[] = []): T | undefined {
    const stmt = getDb().prepare(sql);
    return stmt.get(...params) as T | undefined;
  },

  run(sql: string, params: any[] = []): Database.RunResult {
    const stmt = getDb().prepare(sql);
    return stmt.run(...params);
  },

  exec(sql: string): void {
    getDb().exec(sql);
  },
};

export default db;
