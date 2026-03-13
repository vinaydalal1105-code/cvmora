/**
 * Postgres (Neon) backend when a database URL env var is set.
 * Uses @neondatabase/serverless for Vercel.
 */
import { neon } from '@neondatabase/serverless'

function getDatabaseUrl() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.STORAGE_DATABASE_URL ||
    process.env.POSTGRES_URL_UNPOOLED
  ) || null
}

const conn = getDatabaseUrl() ? neon(getDatabaseUrl()) : null
let schemaDone = false

async function ensureSchema() {
  if (!conn || schemaDone) return
  await conn`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      provider TEXT DEFAULT 'local',
      provider_id TEXT,
      verified INTEGER DEFAULT 0
    )
  `
  await conn`
    CREATE TABLE IF NOT EXISTS resumes (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      title TEXT DEFAULT 'My Resume',
      data TEXT NOT NULL,
      template_id TEXT DEFAULT 'professional',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
  await conn`
    CREATE TABLE IF NOT EXISTS cover_letters (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      title TEXT DEFAULT 'Cover Letter',
      job_title TEXT,
      company TEXT,
      body TEXT NOT NULL,
      template_id TEXT DEFAULT 'professional',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
  await conn`CREATE INDEX IF NOT EXISTS idx_resumes_user ON resumes(user_id)`
  await conn`CREATE INDEX IF NOT EXISTS idx_cover_letters_user ON cover_letters(user_id)`
  await conn`ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT`
  await conn`ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free'`
  await conn`ALTER TABLE users ADD COLUMN IF NOT EXISTS one_time_credits INTEGER DEFAULT 0`
  schemaDone = true
}

export async function pgGetUserById(id) {
  if (!conn) return null
  await ensureSchema()
  const rows = await conn`SELECT id, email, name, created_at, verified, subscription_status, one_time_credits FROM users WHERE id = ${id}`
  return rows[0] ? { ...rows[0], subscription_status: rows[0].subscription_status ?? 'free', one_time_credits: rows[0].one_time_credits ?? 0 } : null
}

export async function pgGetUserByEmail(email) {
  if (!conn) return null
  await ensureSchema()
  const rows = await conn`SELECT id, email, name, password_hash, verified, one_time_credits FROM users WHERE email = ${email}`
  return rows[0] || null
}

export async function pgGetUserByProvider(provider, providerId) {
  if (!conn) return null
  await ensureSchema()
  const rows = await conn`SELECT id, email, name, created_at, one_time_credits FROM users WHERE provider = ${provider} AND provider_id = ${providerId}`
  return rows[0] || null
}

export async function pgInsertUser({ email, password_hash, name, verified, provider, provider_id }) {
  if (!conn) return null
  await ensureSchema()
  const rows = await conn`INSERT INTO users (email, password_hash, name, verified, provider, provider_id) VALUES (${email}, ${password_hash}, ${name || email.split('@')[0]}, ${verified ?? 0}, ${provider ?? 'local'}, ${provider_id ?? null}) RETURNING id`
  return rows[0]?.id ?? null
}

export async function pgUpdateUserVerified(id) {
  if (!conn) return
  await conn`UPDATE users SET verified = 1 WHERE id = ${id}`
}

export async function pgUpdateUserPassword(id, password_hash) {
  if (!conn) return
  await conn`UPDATE users SET password_hash = ${password_hash} WHERE id = ${id}`
}

export async function pgUpdateUserOAuth(id, provider, providerId) {
  if (!conn) return
  await conn`UPDATE users SET provider = ${provider}, provider_id = ${providerId}, verified = 1 WHERE id = ${id}`
}

export async function pgUpdateUserName(id, name) {
  if (!conn) return
  await conn`UPDATE users SET name = ${name} WHERE id = ${id}`
}

export async function pgGetStripeCustomerId(userId) {
  if (!conn) return null
  await ensureSchema()
  const rows = await conn`SELECT stripe_customer_id FROM users WHERE id = ${userId}`
  return rows[0]?.stripe_customer_id ?? null
}

export async function pgSetStripeCustomerId(userId, stripeCustomerId) {
  if (!conn) return
  await conn`UPDATE users SET stripe_customer_id = ${stripeCustomerId} WHERE id = ${userId}`
}

export async function pgSetSubscriptionStatus(userId, status) {
  if (!conn) return
  await conn`UPDATE users SET subscription_status = ${status} WHERE id = ${userId}`
}

export async function pgGetSubscriptionStatus(userId) {
  if (!conn) return 'free'
  const rows = await conn`SELECT subscription_status FROM users WHERE id = ${userId}`
  return rows[0]?.subscription_status ?? 'free'
}

export async function pgGetOneTimeCredits(userId) {
  if (!conn) return 0
  await ensureSchema()
  const rows = await conn`SELECT one_time_credits FROM users WHERE id = ${userId}`
  return rows[0]?.one_time_credits ?? 0
}

export async function pgIncrementOneTimeCredits(userId, amount) {
  if (!conn) return 0
  await ensureSchema()
  const rows = await conn`UPDATE users SET one_time_credits = COALESCE(one_time_credits, 0) + ${amount} WHERE id = ${userId} RETURNING one_time_credits`
  return rows[0]?.one_time_credits ?? 0
}

export async function pgDecrementOneTimeCredits(userId) {
  if (!conn) return false
  await ensureSchema()
  const rows = await conn`UPDATE users SET one_time_credits = GREATEST(COALESCE(one_time_credits, 0) - 1, 0) WHERE id = ${userId} AND COALESCE(one_time_credits, 0) > 0 RETURNING one_time_credits`
  return rows.length > 0
}

export async function pgGetResumesByUserId(userId) {
  if (!conn) return []
  await ensureSchema()
  return conn`SELECT id, title, template_id, created_at, updated_at FROM resumes WHERE user_id = ${userId} ORDER BY updated_at DESC`
}

export async function pgGetResumesWithDataByUserId(userId) {
  if (!conn) return []
  await ensureSchema()
  return conn`SELECT id, title, data FROM resumes WHERE user_id = ${userId}`
}

export async function pgGetResumeByIdAndUser(id, userId) {
  if (!conn) return null
  const rows = await conn`SELECT * FROM resumes WHERE id = ${id} AND user_id = ${userId}`
  return rows[0] || null
}

export async function pgInsertResume({ user_id, title, data, template_id }) {
  if (!conn) return null
  const rows = await conn`INSERT INTO resumes (user_id, title, data, template_id) VALUES (${user_id}, ${title}, ${data}, ${template_id}) RETURNING id`
  return rows[0]?.id ?? null
}

export async function pgUpdateResume(id, userId, fields) {
  if (!conn) return null
  if (fields.title !== undefined) await conn`UPDATE resumes SET title = ${fields.title}, updated_at = NOW() WHERE id = ${id} AND user_id = ${userId}`
  if (fields.data !== undefined) await conn`UPDATE resumes SET data = ${fields.data}, updated_at = NOW() WHERE id = ${id} AND user_id = ${userId}`
  if (fields.template_id !== undefined) await conn`UPDATE resumes SET template_id = ${fields.template_id}, updated_at = NOW() WHERE id = ${id} AND user_id = ${userId}`
  const rows = await conn`SELECT * FROM resumes WHERE id = ${id}`
  return rows[0] || null
}

export async function pgDeleteResume(id, userId) {
  if (!conn) return 0
  const rows = await conn`DELETE FROM resumes WHERE id = ${id} AND user_id = ${userId} RETURNING id`
  return rows.length
}

export async function pgDeleteAllResumesByUserId(userId) {
  if (!conn) return 0
  const rows = await conn`DELETE FROM resumes WHERE user_id = ${userId} RETURNING id`
  return rows.length
}

export async function pgGetCoverLettersByUserId(userId) {
  if (!conn) return []
  await ensureSchema()
  return conn`SELECT id, title, job_title, company, template_id, created_at, updated_at FROM cover_letters WHERE user_id = ${userId} ORDER BY updated_at DESC`
}

export async function pgGetCoverLetterByIdAndUser(id, userId) {
  if (!conn) return null
  const rows = await conn`SELECT * FROM cover_letters WHERE id = ${id} AND user_id = ${userId}`
  return rows[0] || null
}

export async function pgInsertCoverLetter({ user_id, title, job_title, company, body, template_id }) {
  if (!conn) return null
  const rows = await conn`INSERT INTO cover_letters (user_id, title, job_title, company, body, template_id) VALUES (${user_id}, ${title}, ${job_title || ''}, ${company || ''}, ${body}, ${template_id}) RETURNING id`
  return rows[0]?.id ?? null
}

export async function pgUpdateCoverLetter(id, userId, fields) {
  if (!conn) return null
  if (fields.title !== undefined) await conn`UPDATE cover_letters SET title = ${fields.title}, updated_at = NOW() WHERE id = ${id} AND user_id = ${userId}`
  if (fields.job_title !== undefined) await conn`UPDATE cover_letters SET job_title = ${fields.job_title}, updated_at = NOW() WHERE id = ${id} AND user_id = ${userId}`
  if (fields.company !== undefined) await conn`UPDATE cover_letters SET company = ${fields.company}, updated_at = NOW() WHERE id = ${id} AND user_id = ${userId}`
  if (fields.body !== undefined) await conn`UPDATE cover_letters SET body = ${fields.body}, updated_at = NOW() WHERE id = ${id} AND user_id = ${userId}`
  if (fields.template_id !== undefined) await conn`UPDATE cover_letters SET template_id = ${fields.template_id}, updated_at = NOW() WHERE id = ${id} AND user_id = ${userId}`
  const rows = await conn`SELECT * FROM cover_letters WHERE id = ${id}`
  return rows[0] || null
}

export async function pgDeleteCoverLetter(id, userId) {
  if (!conn) return 0
  const rows = await conn`DELETE FROM cover_letters WHERE id = ${id} AND user_id = ${userId} RETURNING id`
  return rows.length
}

export function usePostgres() {
  return Boolean(conn)
}
