/**
 * Unified DB layer: Postgres (Neon) when DATABASE_URL is set, else SQLite.
 * All exports are async so auth and routes use await.
 */
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import Database from 'better-sqlite3'
import * as pg from './db-pg.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const defaultPath = process.env.VERCEL === '1' ? '/tmp/cvmora.db' : join(__dirname, 'cvmora.db')
const dbPath = process.env.SQLITE_PATH || defaultPath
let sqliteDb = null

function getDatabaseUrl() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.STORAGE_DATABASE_URL ||
    process.env.POSTGRES_URL_UNPOOLED
  ) || null
}

const usePg = Boolean(getDatabaseUrl())

function getSqlite() {
  if (!sqliteDb) {
    sqliteDb = new Database(dbPath)
    sqliteDb.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        provider TEXT DEFAULT 'local',
        provider_id TEXT,
        verified INTEGER DEFAULT 0
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
    try {
      const info = sqliteDb.prepare('PRAGMA table_info(users)').all()
      if (!info.some((c) => c.name === 'provider')) {
        sqliteDb.exec('ALTER TABLE users ADD COLUMN provider TEXT DEFAULT \'local\'')
        sqliteDb.exec('ALTER TABLE users ADD COLUMN provider_id TEXT')
      }
      if (!info.some((c) => c.name === 'verified')) {
        sqliteDb.exec('ALTER TABLE users ADD COLUMN verified INTEGER DEFAULT 0')
        sqliteDb.exec('UPDATE users SET verified = 1 WHERE verified = 0')
      }
      if (!info.some((c) => c.name === 'stripe_customer_id')) {
        sqliteDb.exec('ALTER TABLE users ADD COLUMN stripe_customer_id TEXT')
      }
      if (!info.some((c) => c.name === 'subscription_status')) {
        sqliteDb.exec('ALTER TABLE users ADD COLUMN subscription_status TEXT DEFAULT \'free\'')
      }
      if (!info.some((c) => c.name === 'one_time_credits')) {
        sqliteDb.exec('ALTER TABLE users ADD COLUMN one_time_credits INTEGER DEFAULT 0')
      }
    } catch (_) {}
  }
  return sqliteDb
}

// --- Users
export async function getUserById(id) {
  if (usePg) return pg.pgGetUserById(id)
  const row = getSqlite().prepare('SELECT id, email, name, created_at, verified, subscription_status, one_time_credits FROM users WHERE id = ?').get(id)
  if (!row) return null
  return { ...row, subscription_status: row.subscription_status || 'free', one_time_credits: row.one_time_credits || 0 }
}

export async function getUserByEmailForLogin(email) {
  if (usePg) return pg.pgGetUserByEmail(email)
  return getSqlite().prepare('SELECT id, email, name, password_hash, verified, one_time_credits FROM users WHERE email = ?').get(email)
}

export async function getUserIdByEmail(email) {
  if (usePg) {
    const u = await pg.pgGetUserByEmail(email)
    return u?.id ?? null
  }
  const row = getSqlite().prepare('SELECT id FROM users WHERE email = ?').get(email)
  return row?.id ?? null
}

export async function getUserByProvider(provider, providerId) {
  if (usePg) return pg.pgGetUserByProvider(provider, providerId)
  return getSqlite().prepare('SELECT id, email, name, created_at, one_time_credits FROM users WHERE provider = ? AND provider_id = ?').get(provider, providerId)
}

export async function insertUser({ email, password_hash, name, verified, provider, provider_id }) {
  if (usePg) return pg.pgInsertUser({ email, password_hash, name, verified, provider, provider_id })
  const r = getSqlite().prepare('INSERT INTO users (email, password_hash, name, verified, provider, provider_id) VALUES (?, ?, ?, ?, ?, ?)').run(email, password_hash, name || email.split('@')[0], verified ?? 0, provider ?? 'local', provider_id ?? null)
  return r.lastInsertRowid
}

export async function updateUserVerified(id) {
  if (usePg) return pg.pgUpdateUserVerified(id)
  getSqlite().prepare('UPDATE users SET verified = 1 WHERE id = ?').run(id)
}

export async function updateUserPassword(id, password_hash) {
  if (usePg) return pg.pgUpdateUserPassword(id, password_hash)
  getSqlite().prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(password_hash, id)
}

export async function updateUserOAuth(id, provider, providerId) {
  if (usePg) return pg.pgUpdateUserOAuth(id, provider, providerId)
  getSqlite().prepare('UPDATE users SET provider = ?, provider_id = ?, verified = 1 WHERE id = ?').run(provider, providerId, id)
}

export async function updateUserName(id, name) {
  if (usePg) return pg.pgUpdateUserName(id, name)
  getSqlite().prepare('UPDATE users SET name = ? WHERE id = ?').run(name, id)
}

export async function getStripeCustomerId(userId) {
  if (usePg) return pg.pgGetStripeCustomerId(userId)
  const row = getSqlite().prepare('SELECT stripe_customer_id FROM users WHERE id = ?').get(userId)
  return row?.stripe_customer_id ?? null
}

export async function setStripeCustomerId(userId, stripeCustomerId) {
  if (usePg) return pg.pgSetStripeCustomerId(userId, stripeCustomerId)
  getSqlite().prepare('UPDATE users SET stripe_customer_id = ? WHERE id = ?').run(stripeCustomerId, userId)
}

export async function setSubscriptionStatus(userId, status) {
  if (usePg) return pg.pgSetSubscriptionStatus(userId, status)
  getSqlite().prepare('UPDATE users SET subscription_status = ? WHERE id = ?').run(status, userId)
}

export async function getSubscriptionStatus(userId) {
  if (usePg) return pg.pgGetSubscriptionStatus(userId)
  const row = getSqlite().prepare('SELECT subscription_status FROM users WHERE id = ?').get(userId)
  return (row?.subscription_status || 'free')
}

export async function getOneTimeCredits(userId) {
  if (usePg) return pg.pgGetOneTimeCredits(userId)
  const row = getSqlite().prepare('SELECT one_time_credits FROM users WHERE id = ?').get(userId)
  return row?.one_time_credits ?? 0
}

export async function incrementOneTimeCredits(userId, amount) {
  if (usePg) return pg.pgIncrementOneTimeCredits(userId, amount)
  const sqlite = getSqlite()
  sqlite.prepare('UPDATE users SET one_time_credits = coalesce(one_time_credits, 0) + ? WHERE id = ?').run(amount, userId)
  const row = sqlite.prepare('SELECT one_time_credits FROM users WHERE id = ?').get(userId)
  return row?.one_time_credits ?? 0
}

export async function decrementOneTimeCredits(userId) {
  if (usePg) return pg.pgDecrementOneTimeCredits(userId)
  const sqlite = getSqlite()
  const r = sqlite.prepare('UPDATE users SET one_time_credits = coalesce(one_time_credits, 0) - 1 WHERE id = ? AND coalesce(one_time_credits, 0) > 0').run(userId)
  return r.changes > 0
}

export function hasOAuthColumns() {
  if (usePg) return true
  const info = getSqlite().prepare('PRAGMA table_info(users)').all()
  return info.some((c) => c.name === 'provider')
}

// --- Resumes (for routes)
export async function getResumesByUserId(userId) {
  if (usePg) return pg.pgGetResumesByUserId(userId)
  return getSqlite().prepare('SELECT id, title, template_id, created_at, updated_at FROM resumes WHERE user_id = ? ORDER BY updated_at DESC').all(userId)
}

/** Returns id, title, data for each resume (for cleanup: detect empty duplicates). */
export async function getResumesWithDataByUserId(userId) {
  if (usePg) return pg.pgGetResumesWithDataByUserId(userId)
  return getSqlite().prepare('SELECT id, title, data FROM resumes WHERE user_id = ?').all(userId)
}

/** True if resume data has no meaningful content (default/empty). */
function isResumeDataEmpty(row) {
  if (row.title !== 'My Resume') return false
  let data
  try {
    data = typeof row.data === 'string' ? JSON.parse(row.data) : row.data
  } catch {
    return false
  }
  if (!data) return true
  const summary = (data.summary || '').trim()
  if (summary) return false
  const exp = data.experience || []
  if (exp.some((e) => (e.jobTitle || e.company || (e.description || '').trim()))) return false
  const edu = data.education || []
  if (edu.some((e) => (e.degree || e.school || (e.description || '').trim()))) return false
  const skills = data.skills || []
  if (skills.some((s) => (s || '').trim())) return false
  return true
}

/** Delete all empty "My Resume" duplicates for user; returns count deleted. */
export async function cleanupEmptyResumes(userId) {
  const rows = await getResumesWithDataByUserId(userId)
  const toDelete = rows.filter(isResumeDataEmpty).map((r) => r.id)
  let deleted = 0
  for (const id of toDelete) {
    const n = await deleteResume(id, userId)
    if (n) deleted += 1
  }
  return deleted
}

export async function getResumeByIdAndUser(id, userId) {
  if (usePg) return pg.pgGetResumeByIdAndUser(id, userId)
  return getSqlite().prepare('SELECT * FROM resumes WHERE id = ? AND user_id = ?').get(id, userId)
}

export async function insertResume({ user_id, title, data, template_id }) {
  if (usePg) return pg.pgInsertResume({ user_id, title, data, template_id })
  const r = getSqlite().prepare('INSERT INTO resumes (user_id, title, data, template_id) VALUES (?, ?, ?, ?)').run(user_id, title, data, template_id)
  return r.lastInsertRowid
}

export async function updateResume(id, userId, fields) {
  if (usePg) return pg.pgUpdateResume(id, userId, fields)
  const sqlite = getSqlite()
  const updates = []
  const values = []
  if (fields.title !== undefined) { updates.push('title = ?'); values.push(fields.title) }
  if (fields.data !== undefined) { updates.push('data = ?'); values.push(fields.data) }
  if (fields.template_id !== undefined) { updates.push('template_id = ?'); values.push(fields.template_id) }
  updates.push("updated_at = datetime('now')")
  values.push(id, userId)
  sqlite.prepare(`UPDATE resumes SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`).run(...values)
  return sqlite.prepare('SELECT * FROM resumes WHERE id = ?').get(id)
}

export async function deleteResume(id, userId) {
  if (usePg) return pg.pgDeleteResume(id, userId)
  const r = getSqlite().prepare('DELETE FROM resumes WHERE id = ? AND user_id = ?').run(id, userId)
  return r.changes
}

/** Delete all resumes for a user; returns count deleted. */
export async function deleteAllResumesByUserId(userId) {
  if (usePg) return pg.pgDeleteAllResumesByUserId(userId)
  const r = getSqlite().prepare('DELETE FROM resumes WHERE user_id = ?').run(userId)
  return r.changes
}

// --- Cover letters
export async function getCoverLettersByUserId(userId) {
  if (usePg) return pg.pgGetCoverLettersByUserId(userId)
  return getSqlite().prepare('SELECT id, title, job_title, company, template_id, created_at, updated_at FROM cover_letters WHERE user_id = ? ORDER BY updated_at DESC').all(userId)
}

export async function getCoverLetterByIdAndUser(id, userId) {
  if (usePg) return pg.pgGetCoverLetterByIdAndUser(id, userId)
  return getSqlite().prepare('SELECT * FROM cover_letters WHERE id = ? AND user_id = ?').get(id, userId)
}

export async function insertCoverLetter({ user_id, title, job_title, company, body, template_id }) {
  if (usePg) return pg.pgInsertCoverLetter({ user_id, title, job_title, company, body, template_id })
  const r = getSqlite().prepare('INSERT INTO cover_letters (user_id, title, job_title, company, body, template_id) VALUES (?, ?, ?, ?, ?, ?)').run(user_id, title, job_title || '', company || '', body, template_id)
  return r.lastInsertRowid
}

export async function updateCoverLetter(id, userId, fields) {
  if (usePg) return pg.pgUpdateCoverLetter(id, userId, fields)
  const sqlite = getSqlite()
  const updates = []
  const values = []
  if (fields.title !== undefined) { updates.push('title = ?'); values.push(fields.title) }
  if (fields.job_title !== undefined) { updates.push('job_title = ?'); values.push(fields.job_title) }
  if (fields.company !== undefined) { updates.push('company = ?'); values.push(fields.company) }
  if (fields.body !== undefined) { updates.push('body = ?'); values.push(fields.body) }
  if (fields.template_id !== undefined) { updates.push('template_id = ?'); values.push(fields.template_id) }
  updates.push("updated_at = datetime('now')")
  values.push(id, userId)
  sqlite.prepare(`UPDATE cover_letters SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`).run(...values)
  return sqlite.prepare('SELECT * FROM cover_letters WHERE id = ?').get(id)
}

export async function deleteCoverLetter(id, userId) {
  if (usePg) return pg.pgDeleteCoverLetter(id, userId)
  const r = getSqlite().prepare('DELETE FROM cover_letters WHERE id = ? AND user_id = ?').run(id, userId)
  return r.changes
}

// Legacy export for any code that still does db.prepare - used by app.js forgot-password
export const db = {
  prepare: (sql) => ({
    get: (...args) => {
      if (usePg) throw new Error('Use async db helpers when DATABASE_URL is set')
      return getSqlite().prepare(sql).get(...args)
    },
    run: (...args) => {
      if (usePg) throw new Error('Use async db helpers when DATABASE_URL is set')
      return getSqlite().prepare(sql).run(...args)
    },
    all: (...args) => {
      if (usePg) throw new Error('Use async db helpers when DATABASE_URL is set')
      return getSqlite().prepare(sql).all(...args)
    },
  }),
}
