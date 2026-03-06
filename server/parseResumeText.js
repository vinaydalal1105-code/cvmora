import crypto from 'crypto'

/**
 * Parse raw resume text (from PDF or DOCX) into structured sections
 * for contact, summary, experience, education, skills.
 * Returns an object that can be merged with defaultResume on the client.
 */
export function parseResumeText(text) {
  if (!text || typeof text !== 'string') return null
  const raw = text.trim()
  if (!raw.length) return null

  const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  const fullText = lines.join('\n')

  // --- Contact: email, phone ---
  const emailMatch = fullText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/)
  const email = emailMatch ? emailMatch[0] : ''
  const phoneMatch = fullText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{2,4}[-.\s]?\d{2,4}(?:[-.\s]?\d{2,4})?|\d{10,}/)
  const phone = phoneMatch ? phoneMatch[0].trim() : ''

  // --- Section splitting: common headers (case-insensitive) ---
  const sectionPattern = /^(?:\d+\.\s*)?(SUMMARY|PROFILE|OBJECTIVE|PROFESSIONAL SUMMARY|EXECUTIVE SUMMARY|ABOUT ME|EXPERIENCE|WORK EXPERIENCE|EMPLOYMENT|EDUCATION|SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES|QUALIFICATIONS|CERTIFICATIONS|PROJECTS|REFERENCES)\s*:?\s*$/im
  const sections = {}
  let currentSection = 'preamble'
  let currentLines = []

  for (const line of lines) {
    const match = line.match(sectionPattern)
    if (match) {
      const name = match[1].toUpperCase().replace(/\s+/g, '_')
      const prevKey = currentSection === 'preamble' ? 'preamble' : currentSection
      if (!sections[prevKey]) sections[prevKey] = []
      sections[prevKey].push(currentLines.join('\n').trim())
      currentSection = name
      currentLines = []
    } else {
      currentLines.push(line)
    }
  }
  const lastKey = currentSection === 'preamble' ? 'preamble' : currentSection
  if (!sections[lastKey]) sections[lastKey] = []
  sections[lastKey].push(currentLines.join('\n').trim())

  const getSection = (...names) => {
    for (const n of names) {
      const key = n.replace(/\s+/g, '_')
      const val = sections[key]?.[0]
      if (val) return val.trim()
    }
    return ''
  }

  // --- Name: often first line of preamble (not email/phone/url) ---
  const preamble = getSection('preamble') || ''
  const preambleLines = preamble.split('\n').map((l) => l.trim()).filter(Boolean)
  let fullName = ''
  for (const ln of preambleLines) {
    if (ln.length > 2 && ln.length < 80 && !ln.includes('@') && !/^[\d\s\-+().]+$/.test(ln) && !ln.startsWith('http')) {
      fullName = ln
      break
    }
  }

  // --- Summary ---
  const summary = getSection('SUMMARY', 'PROFILE', 'OBJECTIVE', 'PROFESSIONAL_SUMMARY', 'EXECUTIVE_SUMMARY', 'ABOUT_ME') || ''

  // --- Experience: heuristic parsing ---
  const experienceText = getSection('EXPERIENCE', 'WORK_EXPERIENCE', 'EMPLOYMENT') || ''
  const experience = parseExperienceBlock(experienceText)

  // --- Education ---
  const educationText = getSection('EDUCATION') || ''
  const education = parseEducationBlock(educationText)

  // --- Skills ---
  const skillsText = getSection('SKILLS', 'TECHNICAL_SKILLS', 'CORE_COMPETENCIES', 'QUALIFICATIONS') || ''
  const skills = parseSkillsBlock(skillsText)

  return {
    contact: {
      fullName: fullName || undefined,
      email: email || undefined,
      phone: phone || undefined,
      location: '',
      address: '',
      city: '',
      state: '',
      country: '',
      website: '',
      linkedin: '',
    },
    summary: summary.slice(0, 4000) || undefined,
    experience: experience.length ? experience : undefined,
    education: education.length ? education : undefined,
    skills: skills.length ? skills : undefined,
  }
}

// Date pattern: "Jan 2020", "2020 - 2022", "01/2020", "Present", "Current"
const DATE_PATTERN = /(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{1,2}\/\d{2,4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4}|\d{4})\s*[-–—to]+\s*(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{1,2}\/\d{2,4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4}|\d{4}|Present|Current)/gi
const SINGLE_DATE = /(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{1,2}\/\d{2,4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4}|\d{4})/i

function parseExperienceBlock(text) {
  if (!text.trim()) return []
  const entries = []
  // Split by lines that look like "Job Title" or "Job Title | Company" or "Company - Job Title" and contain dates
  const blocks = text.split(/(?=^(?:.*\d{4}.*[-–—]\s*(?:\d{4}|Present|Current)|.*(?:Present|Current)\s*$))/gm).map((b) => b.trim()).filter(Boolean)
  for (let block of blocks) {
    const lines = block.split(/\n/).map((l) => l.trim()).filter(Boolean)
    if (lines.length === 0) continue
    const first = lines[0]
    const dateMatch = block.match(DATE_PATTERN) || block.match(SINGLE_DATE)
    const dateStr = dateMatch ? dateMatch[0] : ''
    let jobTitle = ''
    let company = ''
    const parts = first.split(/[|•\-–—]/).map((p) => p.trim()).filter(Boolean)
    if (parts.length >= 2) {
      jobTitle = parts[0]
      company = parts[1]
    } else {
      jobTitle = first.replace(/\s*\d{4}\s*[-–—to]+\s*(?:\d{4}|Present|Current).*$/i, '').trim()
      company = ''
    }
    const desc = lines.slice(1).join('\n').trim().slice(0, 3000)
    entries.push({
      id: crypto.randomUUID(),
      jobTitle: jobTitle || 'Role',
      company: company || '',
      location: '',
      startDate: '',
      endDate: dateStr,
      current: /Present|Current/i.test(dateStr),
      description: desc,
    })
  }
  // If we didn't split into blocks, treat whole as one entry
  if (entries.length === 0 && text.trim()) {
    const lines = text.split(/\n/).map((l) => l.trim()).filter(Boolean)
    const first = lines[0] || ''
    const rest = lines.slice(1).join('\n').trim().slice(0, 3000)
    entries.push({
      id: crypto.randomUUID(),
      jobTitle: first || 'Experience',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: rest,
    })
  }
  return entries.slice(0, 20)
}

function parseEducationBlock(text) {
  if (!text.trim()) return []
  const entries = []
  const blocks = text.split(/(?=\d{4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4})/i).map((b) => b.trim()).filter((b) => b.length > 10)
  for (const block of blocks) {
    const lines = block.split(/\n/).map((l) => l.trim()).filter(Boolean)
    const first = lines[0] || ''
    const rest = lines.slice(1).join('\n').trim()
    const dateMatch = block.match(/\d{4}/g)
    const dateStr = dateMatch ? dateMatch.join(' - ') : ''
    entries.push({
      id: crypto.randomUUID(),
      degree: first,
      school: '',
      location: '',
      startDate: '',
      endDate: dateStr,
      description: rest.slice(0, 1500),
    })
  }
  if (entries.length === 0 && text.trim()) {
    const lines = text.split(/\n/).map((l) => l.trim()).filter(Boolean)
    entries.push({
      id: crypto.randomUUID(),
      degree: lines[0] || 'Degree',
      school: lines[1] || '',
      location: '',
      startDate: '',
      endDate: '',
      description: lines.slice(2).join('\n').trim().slice(0, 1500),
    })
  }
  return entries.slice(0, 10)
}

function parseSkillsBlock(text) {
  if (!text.trim()) return []
  let s = text.replace(/\n/g, ',').replace(/\s*[•·]\s*/g, ',').replace(/\s*[-–—]\s*/g, ',')
  const list = s.split(',').map((x) => x.trim()).filter((x) => x.length > 0 && x.length < 80)
  const seen = new Set()
  return [...new Set(list)].slice(0, 50)
}
