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
  try {
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

    if (typeof text !== 'string') {
      text = text == null ? '' : String(text)
    }

    console.log('[upload] Raw text length:', text.length)
    console.log('[upload] First 200 chars:', JSON.stringify(text.slice(0, 200)))
    if (text) {
      const nonAscii = new Set()
      for (let i = 0; i < Math.min(text.length, 2000); i++) {
        const code = text.charCodeAt(i)
        if (code > 127) nonAscii.add('U+' + code.toString(16).toUpperCase().padStart(4, '0'))
      }
      if (nonAscii.size) console.log('[upload] Non-ASCII chars found:', [...nonAscii].join(', '))
    }

    let data = null
    try {
      data = parseResumeText(text)
    } catch (e) {
      console.error('[upload] Resume parse failed:', e)
      data = null
    }

    console.log('[upload] Parsed summary length:', data?.summary?.length || 0)
    console.log('[upload] Experience entries:', data?.experience?.length || 0)
    console.log('[upload] Education entries:', data?.education?.length || 0)
    console.log('[upload] Skills count:', data?.skills?.length || 0)
    if (data?.education) {
      data.education.forEach((e, i) => console.log(`[upload] Edu[${i}]: "${e.degree}" @ "${e.school}" desc="${(e.description || '').slice(0,80)}"`))
    }
    return res.json({ text, data })
  } catch (err) {
    console.error('[upload] Unhandled error:', err)
    const message = err instanceof Error ? err.message : 'Upload failed'
    return res.status(500).json({ error: message })
  }
})

uploadRouter.use((err, req, res, next) => {
  if (!err) return next()
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large. Max 10MB.' })
  }
  return res.status(400).json({ error: err.message || 'Upload failed' })
})
