import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const defaultPath = process.env.VERCEL === '1' ? '/tmp/cvmora.db' : join(__dirname, 'cvmora.db')
const dbPath = process.env.SQLITE_PATH || defaultPath
export const db = new Database(dbPath)

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS resumes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT DEFAULT 'My Resume',
    data TEXT NOT NULL,
    template_id TEXT DEFAULT 'professional',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS cover_letters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT DEFAULT 'Cover Letter',
    job_title TEXT,
    company TEXT,
    body TEXT NOT NULL,
    template_id TEXT DEFAULT 'professional',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE INDEX IF NOT EXISTS idx_resumes_user ON resumes(user_id);
  CREATE INDEX IF NOT EXISTS idx_cover_letters_user ON cover_letters(user_id);
`)

// Migration: add OAuth provider columns if missing
try {
  const info = db.prepare("PRAGMA table_info(users)").all()
  const hasProvider = info.some((c) => c.name === 'provider')
  if (!hasProvider) {
    db.exec(`ALTER TABLE users ADD COLUMN provider TEXT DEFAULT 'local'`)
    db.exec(`ALTER TABLE users ADD COLUMN provider_id TEXT`)
  }
} catch (_) {}

// Migration: add verified column for email verification
try {
  const info = db.prepare("PRAGMA table_info(users)").all()
  const hasVerified = info.some((c) => c.name === 'verified')
  if (!hasVerified) {
    db.exec(`ALTER TABLE users ADD COLUMN verified INTEGER DEFAULT 0`)
    db.exec(`UPDATE users SET verified = 1 WHERE verified = 0`) // existing users stay able to log in
  }
} catch (_) {}

export function initDb() {
  // already inited above
}
