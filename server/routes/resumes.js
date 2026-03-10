import { Router } from 'express'
import { authMiddleware } from '../middleware.js'
import * as db from '../db.js'

export const resumesRouter = Router()

resumesRouter.use(authMiddleware)

resumesRouter.get('/', async (req, res) => {
  const rows = await db.getResumesByUserId(req.userId)
  res.json(rows)
})

resumesRouter.post('/cleanup', async (req, res) => {
  try {
    const deleted = await db.cleanupEmptyResumes(req.userId)
    res.json({ deleted })
  } catch (err) {
    console.error('Resume cleanup failed:', err)
    res.status(500).json({ error: 'Cleanup failed' })
  }
})

resumesRouter.post('/delete-all', async (req, res) => {
  try {
    const deleted = await db.deleteAllResumesByUserId(req.userId)
    res.json({ deleted })
  } catch (err) {
    console.error('Delete all resumes failed:', err)
    res.status(500).json({ error: 'Could not delete all resumes' })
  }
})

resumesRouter.get('/:id', async (req, res) => {
  const row = await db.getResumeByIdAndUser(req.params.id, req.userId)
  if (!row) return res.status(404).json({ error: 'Resume not found' })
  res.json({
    ...row,
    data: typeof row.data === 'string' ? JSON.parse(row.data) : row.data,
  })
})

resumesRouter.post('/', async (req, res) => {
  const { title = 'My Resume', data, template_id = 'professional' } = req.body
  if (!data) return res.status(400).json({ error: 'data is required' })
  const dataStr = typeof data === 'string' ? data : JSON.stringify(data)
  const id = await db.insertResume({ user_id: req.userId, title, data: dataStr, template_id: template_id || 'professional' })
  const row = await db.getResumeByIdAndUser(String(id), req.userId)
  res.status(201).json({
    ...row,
    data: typeof row.data === 'string' ? JSON.parse(row.data) : row.data,
  })
})

resumesRouter.put('/:id', async (req, res) => {
  const existing = await db.getResumeByIdAndUser(req.params.id, req.userId)
  if (!existing) return res.status(404).json({ error: 'Resume not found' })
  const { title, data, template_id } = req.body
  const fields = {}
  if (title !== undefined) fields.title = title
  if (data !== undefined) fields.data = typeof data === 'string' ? data : JSON.stringify(data)
  if (template_id !== undefined) fields.template_id = template_id
  const row = await db.updateResume(req.params.id, req.userId, fields)
  res.json({
    ...row,
    data: typeof row.data === 'string' ? JSON.parse(row.data) : row.data,
  })
})

resumesRouter.delete('/:id', async (req, res) => {
  const deleted = await db.deleteResume(req.params.id, req.userId)
  if (deleted === 0) return res.status(404).json({ error: 'Resume not found' })
  res.status(204).send()
})
