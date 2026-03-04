import { verifyToken } from './auth.js'
import { getUserById } from './auth.js'

export function authMiddleware(req, res, next) {
  const auth = req.headers.authorization
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' })
  }
  const userId = verifyToken(token)
  if (!userId) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
  const user = getUserById(userId)
  if (!user) {
    return res.status(401).json({ error: 'User not found' })
  }
  req.user = user
  req.userId = userId
  next()
}
