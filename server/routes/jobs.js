import { Router } from 'express'

export const jobsRouter = Router()

// Proxy to a free job API (Remotive) so we don't expose API keys to the client
const REMOTIVE_URL = 'https://remotive.com/api/remote-jobs?limit=20'

jobsRouter.get('/', async (req, res) => {
  try {
    const category = req.query.category || ''
    const search = req.query.search || ''
    let url = REMOTIVE_URL
    if (category) url += `&category=${encodeURIComponent(category)}`
    if (search) url += `&search=${encodeURIComponent(search)}`
    const response = await fetch(url)
    const data = await response.json()
    res.json(data)
  } catch (e) {
    res.status(502).json({ error: 'Could not fetch jobs', jobs: [] })
  }
})

jobsRouter.get('/categories', async (req, res) => {
  try {
    const response = await fetch('https://remotive.com/api/remote-jobs/categories')
    const data = await response.json()
    res.json(data)
  } catch (e) {
    res.status(502).json({ error: 'Could not fetch categories', categories: [] })
  }
})
