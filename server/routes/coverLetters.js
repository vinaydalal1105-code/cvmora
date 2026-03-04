import { Router } from 'express'
import { authMiddleware } from '../middleware.js'
import { db } from '../db.js'

export const coverLettersRouter = Router()

coverLettersRouter.use(authMiddleware)

coverLettersRouter.get('/', (req, res) => {
  const rows = db.prepare(
    'SELECT id, title, job_title, company, template_id, created_at, updated_at FROM cover_letters WHERE user_id = ? ORDER BY updated_at DESC'
  ).all(req.userId)
  res.json(rows)
})

coverLettersRouter.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM cover_letters WHERE id = ? AND user_id = ?').get(req.params.id, req.userId)
  if (!row) return res.status(404).json({ error: 'Cover letter not found' })
  res.json(row)
})

coverLettersRouter.post('/', (req, res) => {
  const { title = 'Cover Letter', job_title, company, body, template_id = 'professional' } = req.body
  if (!body) return res.status(400).json({ error: 'body is required' })
  const result = db.prepare(
    'INSERT INTO cover_letters (user_id, title, job_title, company, body, template_id) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(req.userId, title, job_title || '', company || '', body, template_id || 'professional')
  const row = db.prepare('SELECT * FROM cover_letters WHERE id = ?').get(result.lastInsertRowid)
  res.status(201).json(row)
})

coverLettersRouter.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT id FROM cover_letters WHERE id = ? AND user_id = ?').get(req.params.id, req.userId)
  if (!existing) return res.status(404).json({ error: 'Cover letter not found' })
  const { title, job_title, company, body, template_id } = req.body
  const updates = []
  const values = []
  if (title !== undefined) { updates.push('title = ?'); values.push(title) }
  if (job_title !== undefined) { updates.push('job_title = ?'); values.push(job_title) }
  if (company !== undefined) { updates.push('company = ?'); values.push(company) }
  if (body !== undefined) { updates.push('body = ?'); values.push(body) }
  if (template_id !== undefined) { updates.push('template_id = ?'); values.push(template_id) }
  updates.push("updated_at = datetime('now')")
  values.push(req.params.id)
  db.prepare(`UPDATE cover_letters SET ${updates.join(', ')} WHERE id = ?`).run(...values)
  const row = db.prepare('SELECT * FROM cover_letters WHERE id = ?').get(req.params.id)
  res.json(row)
})

coverLettersRouter.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM cover_letters WHERE id = ? AND user_id = ?').run(req.params.id, req.userId)
  if (result.changes === 0) return res.status(404).json({ error: 'Cover letter not found' })
  res.status(204).send()
})
