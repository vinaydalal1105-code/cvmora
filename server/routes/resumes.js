import { Router } from 'express'
import { authMiddleware } from '../middleware.js'
import { db } from '../db.js'

export const resumesRouter = Router()

resumesRouter.use(authMiddleware)

resumesRouter.get('/', (req, res) => {
  const rows = db.prepare(
    'SELECT id, title, template_id, created_at, updated_at FROM resumes WHERE user_id = ? ORDER BY updated_at DESC'
  ).all(req.userId)
  res.json(rows)
})

resumesRouter.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM resumes WHERE id = ? AND user_id = ?').get(req.params.id, req.userId)
  if (!row) return res.status(404).json({ error: 'Resume not found' })
  res.json({
    ...row,
    data: JSON.parse(row.data),
  })
})

resumesRouter.post('/', (req, res) => {
  const { title = 'My Resume', data, template_id = 'professional' } = req.body
  if (!data) return res.status(400).json({ error: 'data is required' })
  const result = db.prepare(
    'INSERT INTO resumes (user_id, title, data, template_id) VALUES (?, ?, ?, ?)'
  ).run(req.userId, title, JSON.stringify(data), template_id || 'professional')
  const row = db.prepare('SELECT * FROM resumes WHERE id = ?').get(result.lastInsertRowid)
  res.status(201).json({
    ...row,
    data: JSON.parse(row.data),
  })
})

resumesRouter.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT id FROM resumes WHERE id = ? AND user_id = ?').get(req.params.id, req.userId)
  if (!existing) return res.status(404).json({ error: 'Resume not found' })
  const { title, data, template_id } = req.body
  const updates = []
  const values = []
  if (title !== undefined) { updates.push('title = ?'); values.push(title) }
  if (data !== undefined) { updates.push('data = ?'); values.push(JSON.stringify(data)) }
  if (template_id !== undefined) { updates.push('template_id = ?'); values.push(template_id) }
  updates.push("updated_at = datetime('now')")
  values.push(req.params.id)
  db.prepare(`UPDATE resumes SET ${updates.join(', ')} WHERE id = ?`).run(...values)
  const row = db.prepare('SELECT * FROM resumes WHERE id = ?').get(req.params.id)
  res.json({
    ...row,
    data: JSON.parse(row.data),
  })
})

resumesRouter.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM resumes WHERE id = ? AND user_id = ?').run(req.params.id, req.userId)
  if (result.changes === 0) return res.status(404).json({ error: 'Resume not found' })
  res.status(204).send()
})
