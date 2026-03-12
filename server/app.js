import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadEnv(filePath) {
  let loaded = 0
  try {
    const env = readFileSync(filePath, 'utf8')
    for (const line of env.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
      if (m) {
        const key = m[1]
        const val = m[2].replace(/^["']|["']$/g, '').trim().replace(/\s+$/, '')
        if (!process.env[key]) {
          process.env[key] = val
          loaded++
        }
      }
    }
  } catch (e) {
    if (e.code !== 'ENOENT') console.warn('[env]', filePath, e.message)
  }
  return loaded
}

if (process.env.VERCEL !== '1') {
  loadEnv(join(__dirname, '.env'))
  loadEnv(join(__dirname, '..', '.env'))
  loadEnv(join(process.cwd(), 'server', '.env'))
  loadEnv(join(process.cwd(), '.env'))
}

import express from 'express'
import cors from 'cors'
import { register, login, verifyToken, getUserById, verifyEmailToken, setUserVerified, createPasswordResetToken, verifyPasswordResetToken, updatePassword, updateUserProfile } from './auth.js'
import { sendVerificationEmail, sendPasswordResetEmail } from './mail.js'
import { oauthRouter } from './routes/oauth.js'
import { resumesRouter } from './routes/resumes.js'
import { coverLettersRouter } from './routes/coverLetters.js'
import { uploadRouter } from './routes/upload.js'
import { jobsRouter } from './routes/jobs.js'
import { createCheckoutSession, verifySession, customerPortal, stripeWebhook } from './routes/stripe.js'
import { getUserIdByEmail } from './db.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: true, credentials: true }))
// Stripe webhook must receive raw body for signature verification
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhook)
app.use(express.json({ limit: '5mb' }))

app.post('/api/auth/register', async (req, res) => {
  const { email, password, name, confirmPassword } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
  if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords do not match' })
  if (String(password).length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' })
  const result = await register(email, password, name)
  if (result.error) return res.status(400).json({ error: result.error })
  const apiUrl = (process.env.API_URL || `http://localhost:${PORT}`).replace(/\/$/, '')
  const verificationLink = `${apiUrl}/api/auth/verify-email?token=${encodeURIComponent(result.verificationToken)}`
  sendVerificationEmail(result.email, result.name, verificationLink).catch((err) =>
    console.error('[mail] Verification email failed:', err)
  )
  res.json({ needVerification: true, email: result.email })
})

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
  const result = await login(email, password)
  if (result.error) return res.status(401).json({ error: result.error })
  res.json(result)
})

app.get('/api/auth/verify-email', async (req, res) => {
  const token = req.query.token
  const frontend = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '')
  if (!token) return res.redirect(frontend + '/login?error=missing_token')
  const userId = verifyEmailToken(String(token))
  if (!userId) return res.redirect(frontend + '/login?error=invalid_or_expired_link')
  await setUserVerified(userId)
  res.redirect(frontend + '/login?verified=1')
})

app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body || {}
  const frontend = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '')
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' })
  }
  try {
    const userId = await getUserIdByEmail(email.trim())
    if (userId) {
      const token = createPasswordResetToken(userId)
      const resetLink = `${frontend}/reset-password?token=${encodeURIComponent(token)}`
      sendPasswordResetEmail(email.trim(), resetLink).catch((err) =>
        console.error('[mail] Password reset email failed:', err)
      )
    }
    return res.json({ message: 'If an account exists with that email, we\'ve sent a password reset link.' })
  } catch (err) {
    console.error('[forgot-password]', err)
    return res.status(500).json({ error: err.message || 'Server error. Try again later.' })
  }
})

app.post('/api/auth/reset-password', async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body || {}
  if (!token) return res.status(400).json({ error: 'Reset token is required' })
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' })
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' })
  }
  const userId = verifyPasswordResetToken(String(token))
  if (!userId) return res.status(400).json({ error: 'Invalid or expired reset link. Request a new one.' })
  await updatePassword(userId, newPassword)
  res.json({ message: 'Password updated. You can sign in now.' })
})

app.get('/api/auth/me', async (req, res) => {
  const auth = req.headers.authorization
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Not authenticated' })
  const userId = verifyToken(token)
  if (!userId) return res.status(401).json({ error: 'Invalid or expired token' })
  const user = await getUserById(userId)
  if (!user) return res.status(401).json({ error: 'User not found' })
  res.json(user)
})

app.patch('/api/auth/me', async (req, res) => {
  const auth = req.headers.authorization
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Not authenticated' })
  const userId = verifyToken(token)
  if (!userId) return res.status(401).json({ error: 'Invalid or expired token' })
  await updateUserProfile(userId, req.body || {})
  const user = await getUserById(userId)
  if (!user) return res.status(401).json({ error: 'User not found' })
  res.json(user)
})

app.use('/api/auth', oauthRouter)
app.post('/api/stripe/create-checkout-session', createCheckoutSession)
app.get('/api/stripe/verify-session', verifySession)
app.post('/api/stripe/customer-portal', customerPortal)
app.use('/api/resumes', resumesRouter)
app.use('/api/cover-letters', coverLettersRouter)
app.use('/api/upload', uploadRouter)
app.use('/api/jobs', jobsRouter)

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  const frontend = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '')
  if (req.method === 'GET' && req.path.startsWith('/api/auth/')) {
    return res.redirect(frontend + '/login?error=' + encodeURIComponent(err.message || 'Server error'))
  }
  res.status(500).json({ error: err.message || 'Server error' })
})

export { app }
