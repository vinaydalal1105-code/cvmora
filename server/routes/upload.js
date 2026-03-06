import { Router } from 'express'
import multer from 'multer'
import { parseResumeText } from '../parseResumeText.js'

let pdfParse = null
try {
  const mod = await import('pdf-parse')
  pdfParse = mod.default
} catch {
  // pdf-parse optional (native deps may fail)
}

let mammoth = null
try {
  mammoth = (await import('mammoth')).default
} catch {
  // mammoth optional
}

export const uploadRouter = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }) // 10MB

// No auth required: upload is parse-only, no server-side storage

uploadRouter.post('/resume', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  const { mimetype, buffer } = req.file
  let text = ''
  if (mimetype === 'application/pdf') {
    if (!pdfParse) {
      return res.status(503).json({ error: 'PDF parsing is not available on this server.' })
    }
    try {
      const data = await pdfParse(buffer)
      text = data.text || ''
    } catch (e) {
      return res.status(400).json({ error: 'Could not parse PDF: ' + (e.message || 'Unknown error') })
    }
  } else if (
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimetype === 'application/msword'
  ) {
    if (!mammoth) {
      return res.status(503).json({ error: 'Word document parsing is not available on this server.' })
    }
    try {
      const result = await mammoth.extractRawText({ buffer })
      text = result.value || ''
    } catch (e) {
      return res.status(400).json({ error: 'Could not parse Word document: ' + (e.message || 'Unknown error') })
    }
  } else {
    return res.status(400).json({ error: 'Unsupported format. Use PDF or Word (.doc, .docx).' })
  }

  const data = parseResumeText(text)
  return res.json({ text, data })
})
