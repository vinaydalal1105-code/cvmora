import { app } from '../server/app.js'

export default function handler(req, res) {
  const url = req.url || ''
  const idx = url.indexOf('?')
  if (idx !== -1) {
    const params = new URLSearchParams(url.slice(idx))
    const path = params.get('path')
    if (path) {
      params.delete('path')
      const q = params.toString()
      req.url = '/api/' + path + (q ? '?' + q : '')
    }
  }
  return app(req, res)
}
