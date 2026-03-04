import { Router } from 'express'
import multer from 'multer'
import { authMiddleware } from '../middleware.js'

let pdfParse = null
try {
  const mod = await import('pdf-parse')
  pdfParse = mod.default
} catch {
  // pdf-parse optional (native deps may fail)
}

export const uploadRouter = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }) // 10MB

uploadRouter.use(authMiddleware)

uploadRouter.post('/resume', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  const { mimetype, buffer } = req.file
  if (mimetype === 'application/pdf') {
    if (!pdfParse) {
      return res.status(503).json({ error: 'PDF parsing is not available on this server.' })
    }
    try {
      const data = await pdfParse(buffer)
      return res.json({ text: data.text, pages: data.numpages })
    } catch (e) {
      return res.status(400).json({ error: 'Could not parse PDF: ' + (e.message || 'Unknown error') })
    }
  }
  if (
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimetype === 'application/msword'
  ) {
    return res.status(400).json({
      error: 'DOC/DOCX upload not yet supported for parsing. Please paste your resume text manually.',
    })
  }
  return res.status(400).json({ error: 'Unsupported format. Use PDF.' })
})
