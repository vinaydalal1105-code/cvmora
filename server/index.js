import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load .env from server/ then project root so credentials work however you start the server
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
    if (loaded > 0) console.log('[env] Loaded', loaded, 'vars from', filePath)
  } catch (e) {
    if (e.code !== 'ENOENT') console.warn('[env]', filePath, e.message)
  }
  return loaded
}
const total = loadEnv(join(__dirname, '.env'))
  + loadEnv(join(__dirname, '..', '.env'))
  + loadEnv(join(process.cwd(), 'server', '.env'))
  + loadEnv(join(process.cwd(), '.env'))
if (total === 0) {
  console.warn('[env] No .env file found. Tried:')
  console.warn('  -', join(__dirname, '.env'))
  console.warn('  -', join(__dirname, '..', '.env'))
  console.warn('  -', join(process.cwd(), 'server', '.env'))
  console.warn('  -', join(process.cwd(), '.env'))
}

import { app } from './app.js'

const PORT = process.env.PORT || 3001

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Cvmora API running at http://localhost:${PORT}`)
    if (!process.env.GOOGLE_CLIENT_ID) {
      console.warn('Warning: GOOGLE_CLIENT_ID not set. Add it to server/.env or .env for Google sign-in.')
    } else {
      const apiUrl = (process.env.API_URL || `http://localhost:${PORT}`).replace(/\/$/, '')
      console.log('Google OAuth redirect_uri must be exactly:', apiUrl + '/api/auth/google/callback')
    }
  })
}
