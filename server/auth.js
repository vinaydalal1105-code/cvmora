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

export function register(email, password, name = '') {
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
  if (existing) return { error: 'Email already registered' }
  const hash = hashPassword(password)
  const result = db.prepare('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)')
    .run(email, hash, name || email.split('@')[0])
  const user = db.prepare('SELECT id, email, name, created_at FROM users WHERE id = ?').get(result.lastInsertRowid)
  return { user, token: createToken(user.id) }
}

export function login(email, password) {
  const user = db.prepare('SELECT id, email, name, password_hash FROM users WHERE email = ?').get(email)
  if (!user) return { error: 'Invalid email or password' }
  if (!verifyPassword(password, user.password_hash)) return { error: 'Invalid email or password' }
  const { password_hash, ...safe } = user
  return { user: safe, token: createToken(user.id) }
}

export function getUserById(id) {
  return db.prepare('SELECT id, email, name, created_at FROM users WHERE id = ?').get(id)
}
