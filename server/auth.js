import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from './db.js'

const JWT_SECRET = process.env.JWT_SECRET || 'cvmora-dev-secret-change-in-production'
const SALT_ROUNDS = 10

export function hashPassword(password) {
  return bcrypt.hashSync(password, SALT_ROUNDS)
}

export function verifyPassword(password, hash) {
  return bcrypt.compareSync(password, hash)
}

export function createToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token) {
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    return payload.userId
  } catch {
    return null
  }
}

/** Create a short-lived JWT for email verification link */
export function createVerificationToken(userId, email) {
  return jwt.sign(
    { userId, email, purpose: 'verify-email' },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

/** Verify the token from email link; returns userId or null */
export function verifyEmailToken(token) {
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    if (payload.purpose === 'verify-email' && payload.userId) return payload.userId
    return null
  } catch {
    return null
  }
}

export function setUserVerified(userId) {
  db.prepare('UPDATE users SET verified = 1 WHERE id = ?').run(userId)
}

/** Create JWT for password reset link (1 hour) */
export function createPasswordResetToken(userId) {
  return jwt.sign(
    { userId, purpose: 'reset-password' },
    JWT_SECRET,
    { expiresIn: '1h' }
  )
}

/** Verify password reset token; returns userId or null */
export function verifyPasswordResetToken(token) {
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    if (payload.purpose === 'reset-password' && payload.userId) return payload.userId
    return null
  } catch {
    return null
  }
}

export function updatePassword(userId, newPassword) {
  const hash = hashPassword(newPassword)
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hash, userId)
}

export function register(email, password, name = '') {
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
  if (existing) return { error: 'Email already registered' }
  const hash = hashPassword(password)
  const result = db.prepare(
    'INSERT INTO users (email, password_hash, name, verified) VALUES (?, ?, ?, 0)'
  ).run(email, hash, name || email.split('@')[0])
  const user = db.prepare('SELECT id, email, name, created_at, verified FROM users WHERE id = ?').get(result.lastInsertRowid)
  const verificationToken = createVerificationToken(user.id, user.email)
  return { needVerification: true, email: user.email, verificationToken, name: user.name }
}

export function login(email, password) {
  const user = db.prepare('SELECT id, email, name, password_hash, verified FROM users WHERE email = ?').get(email)
  if (!user) return { error: 'Invalid email or password' }
  if (!verifyPassword(password, user.password_hash)) return { error: 'Invalid email or password' }
  if (!user.verified) {
    return { error: 'Please verify your email first. Check your inbox for the verification link.' }
  }
  const { password_hash, ...safe } = user
  return { user: safe, token: createToken(user.id) }
}

export function getUserById(id) {
  return db.prepare('SELECT id, email, name, created_at, verified FROM users WHERE id = ?').get(id)
}

const OAUTH_PLACEHOLDER = 'oauth-no-password'

/** Find or create user for OAuth (Google/LinkedIn). Returns { user, token } or { error }. */
export function findOrCreateOAuthUser(provider, providerId, email, name) {
  if (!provider || !providerId || !email) return { error: 'Missing OAuth profile data' }
  const safeName = (name && name.trim()) ? name.trim() : (email.split('@')[0] || 'User')
  const hasProviderCol = db.prepare("PRAGMA table_info(users)").all().some((c) => c.name === 'provider')
  if (!hasProviderCol) return { error: 'OAuth not configured' }

  let user = db.prepare('SELECT id, email, name, created_at FROM users WHERE provider = ? AND provider_id = ?')
    .get(provider, providerId)
  if (user) {
    return { user, token: createToken(user.id) }
  }
  user = db.prepare('SELECT id, email, name, created_at FROM users WHERE email = ?').get(email)
  if (user) {
    db.prepare('UPDATE users SET provider = ?, provider_id = ?, verified = 1 WHERE id = ?').run(provider, providerId, user.id)
    return { user, token: createToken(user.id) }
  }
  const hash = hashPassword(OAUTH_PLACEHOLDER + providerId + (process.env.JWT_SECRET || ''))
  const result = db.prepare(
    'INSERT INTO users (email, password_hash, name, provider, provider_id, verified) VALUES (?, ?, ?, ?, ?, 1)'
  ).run(email, hash, safeName, provider, providerId)
  user = db.prepare('SELECT id, email, name, created_at FROM users WHERE id = ?').get(result.lastInsertRowid)
  return { user, token: createToken(user.id), isNewUser: true }
}
