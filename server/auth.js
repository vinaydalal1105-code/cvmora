import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import * as db from './db.js'

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

export function createVerificationToken(userId, email) {
  return jwt.sign(
    { userId, email, purpose: 'verify-email' },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function verifyEmailToken(token) {
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    if (payload.purpose === 'verify-email' && payload.userId) return payload.userId
    return null
  } catch {
    return null
  }
}

export async function setUserVerified(userId) {
  await db.updateUserVerified(userId)
}

export function createPasswordResetToken(userId) {
  return jwt.sign(
    { userId, purpose: 'reset-password' },
    JWT_SECRET,
    { expiresIn: '1h' }
  )
}

export function verifyPasswordResetToken(token) {
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    if (payload.purpose === 'reset-password' && payload.userId) return payload.userId
    return null
  } catch {
    return null
  }
}

export async function updatePassword(userId, newPassword) {
  const hash = hashPassword(newPassword)
  await db.updateUserPassword(userId, hash)
}

export async function register(email, password, name = '') {
  const existing = await db.getUserByEmailForLogin(email)
  if (existing) return { error: 'Email already registered' }
  const hash = hashPassword(password)
  const id = await db.insertUser({ email, password_hash: hash, name, verified: 0 })
  const user = await db.getUserById(id)
  const verificationToken = createVerificationToken(user.id, user.email)
  return { needVerification: true, email: user.email, verificationToken, name: user.name }
}

export async function login(email, password) {
  const user = await db.getUserByEmailForLogin(email)
  if (!user) return { error: 'Invalid email or password' }
  if (!verifyPassword(password, user.password_hash)) return { error: 'Invalid email or password' }
  if (!user.verified) {
    return { error: 'Please verify your email first. Check your inbox for the verification link.' }
  }
  const full = await db.getUserById(user.id)
  if (!full) return { error: 'Invalid email or password' }
  return { user: full, token: createToken(user.id) }
}

export async function getUserById(id) {
  return db.getUserById(id)
}

export async function updateUserProfile(userId, { name }) {
  if (name !== undefined) {
    const trimmed = String(name).trim()
    if (trimmed) await db.updateUserName(userId, trimmed)
  }
}

const OAUTH_PLACEHOLDER = 'oauth-no-password'

export async function findOrCreateOAuthUser(provider, providerId, email, name) {
  if (!provider || !providerId || !email) return { error: 'Missing OAuth profile data' }
  if (!db.hasOAuthColumns()) return { error: 'OAuth not configured' }
  const safeName = (name && name.trim()) ? name.trim() : (email.split('@')[0] || 'User')

  let user = await db.getUserByProvider(provider, providerId)
  if (user) {
    await db.updateUserName(user.id, safeName)
    user = await db.getUserById(user.id)
    return { user, token: createToken(user.id) }
  }

  user = await db.getUserByEmailForLogin(email)
  if (user) {
    await db.updateUserOAuth(user.id, provider, providerId)
    await db.updateUserName(user.id, safeName)
    user = await db.getUserById(user.id)
    return { user, token: createToken(user.id) }
  }

  const hash = hashPassword(OAUTH_PLACEHOLDER + providerId + (process.env.JWT_SECRET || ''))
  const id = await db.insertUser({
    email,
    password_hash: hash,
    name: safeName,
    verified: 1,
    provider,
    provider_id: providerId,
  })
  user = await db.getUserById(id)
  return { user, token: createToken(user.id), isNewUser: true }
}
