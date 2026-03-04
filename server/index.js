import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { register, login } from './auth.js'
import { resumesRouter } from './routes/resumes.js'
import { coverLettersRouter } from './routes/coverLetters.js'
import { uploadRouter } from './routes/upload.js'
import { jobsRouter } from './routes/jobs.js'
import './db.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: true, credentials: true }))
app.use(express.json({ limit: '5mb' }))

app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
  const result = register(email, password, name)
  if (result.error) return res.status(400).json({ error: result.error })
  res.json(result)
})

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
  const result = login(email, password)
  if (result.error) return res.status(401).json({ error: result.error })
  res.json(result)
})

app.use('/api/resumes', resumesRouter)
app.use('/api/cover-letters', coverLettersRouter)
app.use('/api/upload', uploadRouter)
app.use('/api/jobs', jobsRouter)

app.listen(PORT, () => {
  console.log(`Cvmora API running at http://localhost:${PORT}`)
})
