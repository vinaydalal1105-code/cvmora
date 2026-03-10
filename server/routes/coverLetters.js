import { Router } from 'express'
import { authMiddleware } from '../middleware.js'
import * as db from '../db.js'

export const coverLettersRouter = Router()

coverLettersRouter.use(authMiddleware)

coverLettersRouter.get('/', async (req, res) => {
  const rows = await db.getCoverLettersByUserId(req.userId)
  res.json(rows)
})

coverLettersRouter.get('/:id', async (req, res) => {
  const row = await db.getCoverLetterByIdAndUser(req.params.id, req.userId)
  if (!row) return res.status(404).json({ error: 'Cover letter not found' })
  res.json(row)
})

coverLettersRouter.post('/', async (req, res) => {
  const { title = 'Cover Letter', job_title, company, body, template_id = 'professional' } = req.body
  if (!body) return res.status(400).json({ error: 'body is required' })
  const id = await db.insertCoverLetter({
    user_id: req.userId,
    title,
    job_title: job_title || '',
    company: company || '',
    body,
    template_id: template_id || 'professional',
  })
  const row = await db.getCoverLetterByIdAndUser(String(id), req.userId)
  res.status(201).json(row)
})

coverLettersRouter.put('/:id', async (req, res) => {
  const existing = await db.getCoverLetterByIdAndUser(req.params.id, req.userId)
  if (!existing) return res.status(404).json({ error: 'Cover letter not found' })
  const { title, job_title, company, body, template_id } = req.body
  const fields = {}
  if (title !== undefined) fields.title = title
  if (job_title !== undefined) fields.job_title = job_title
  if (company !== undefined) fields.company = company
  if (body !== undefined) fields.body = body
  if (template_id !== undefined) fields.template_id = template_id
  const row = await db.updateCoverLetter(req.params.id, req.userId, fields)
  res.json(row)
})

coverLettersRouter.delete('/:id', async (req, res) => {
  const deleted = await db.deleteCoverLetter(req.params.id, req.userId)
  if (deleted === 0) return res.status(404).json({ error: 'Cover letter not found' })
  res.status(204).send()
})
