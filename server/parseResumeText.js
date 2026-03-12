import crypto from 'crypto'

const BULLET_RE = /[\u25A0-\u25FF\u2700-\u27BF\uF000-\uF8FF\u2022\u2023\u2043\u2666\u25CF\u25CB\u25AA\u25AB\u2605\u2606\u25B6\u25B8\u25BA\u2192\u2794\u27A4\u25E6\u2219\u2660\u2663\u2665\u00BB\u203A]/g

const safeUUID = () => (crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex'))

/**
 * Parse raw resume text (from PDF or DOCX) into structured sections
 * for contact, summary, experience, education, skills.
 * Returns an object that can be merged with defaultResume on the client.
 */
export function parseResumeText(text) {
  if (!text || typeof text !== 'string') return null
  const raw = text.trim()
  if (!raw.length) return null

  const preprocessed = raw
    .replace(BULLET_RE, '\n• ')
    .replace(/\r?\n/g, '\n')

  const lines = preprocessed.split(/\n/).map((l) => l.trim()).filter(Boolean)
  const fullText = lines.join('\n')

  // --- Contact: email, phone, links ---
  const emailMatch = fullText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/)
  const email = emailMatch ? emailMatch[0] : ''
  const phoneMatch = fullText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{2,4}[-.\s]?\d{2,4}(?:[-.\s]?\d{2,4})?|\d{10,}/)
  const phone = phoneMatch ? phoneMatch[0].trim() : ''
  const linkedinMatch = fullText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[^\s)]+/i)
  const linkedin = linkedinMatch ? linkedinMatch[0].trim() : ''
  const websiteMatch = fullText.match(/(?:https?:\/\/)(?:www\.)?[A-Za-z0-9-]+\.[A-Za-z]{2,}(?:\/[^\s)]*)?/i)
    || fullText.match(/(?:www\.)[A-Za-z0-9-]+\.[A-Za-z]{2,}(?:\/[^\s)]*)?/i)
  let website = websiteMatch ? websiteMatch[0].trim() : ''
  if (linkedin && website.toLowerCase().includes('linkedin.com')) website = ''
  if (email && website && email.includes(website.replace(/^(?:https?:\/\/)?(?:www\.)?/, ''))) website = ''

  // --- Section splitting: common headers (case-insensitive) ---
  const sectionPattern = /^(?:\d+\.\s*)?(SUMMARY OF QUALIFICATIONS|PROFESSIONAL SUMMARY|EXECUTIVE SUMMARY|CAREER SUMMARY|SUMMARY|PROFILE|OBJECTIVE|ABOUT ME|RELATED EXPERIENCE|OTHER EXPERIENCE|PROFESSIONAL EXPERIENCE|WORK EXPERIENCE|WORK HISTORY|EMPLOYMENT HISTORY|EMPLOYMENT|EXPERIENCE|EDUCATION|TECHNICAL SKILLS|CORE COMPETENCIES|KEY SKILLS|SKILLS|QUALIFICATIONS|CERTIFICATIONS|PROJECTS|LANGUAGES|LANGUAGE|INTERESTS|HOBBIES|VOLUNTEER|VOLUNTEERING|ACTIVITIES|AWARDS|HONORS|PUBLICATIONS|REFERENCES)\s*:?\s*$/im
  const SECTION_ALIASES = {
    SUMMARY_OF_QUALIFICATIONS: 'SUMMARY',
    PROFESSIONAL_SUMMARY: 'SUMMARY',
    EXECUTIVE_SUMMARY: 'SUMMARY',
    CAREER_SUMMARY: 'SUMMARY',
    PROFILE: 'SUMMARY',
    OBJECTIVE: 'SUMMARY',
    ABOUT_ME: 'SUMMARY',
    RELATED_EXPERIENCE: 'EXPERIENCE',
    OTHER_EXPERIENCE: 'EXPERIENCE',
    PROFESSIONAL_EXPERIENCE: 'EXPERIENCE',
    WORK_EXPERIENCE: 'EXPERIENCE',
    WORK_HISTORY: 'EXPERIENCE',
    EMPLOYMENT_HISTORY: 'EXPERIENCE',
    EMPLOYMENT: 'EXPERIENCE',
    TECHNICAL_SKILLS: 'SKILLS',
    CORE_COMPETENCIES: 'SKILLS',
    KEY_SKILLS: 'SKILLS',
    QUALIFICATIONS: 'SKILLS',
    LANGUAGE: 'LANGUAGES',
    HOBBIES: 'INTERESTS',
    VOLUNTEER: 'VOLUNTEERING',
    HONORS: 'AWARDS',
  }

  const sections = {}
  let currentSection = 'preamble'
  let currentLines = []

  for (const line of lines) {
    const match = line.match(sectionPattern)
    if (match) {
      const rawName = match[1].toUpperCase().replace(/\s+/g, '_')
      const canonName = SECTION_ALIASES[rawName] || rawName
      const prevKey = currentSection === 'preamble' ? 'preamble' : currentSection
      if (!sections[prevKey]) sections[prevKey] = []
      sections[prevKey].push(currentLines.join('\n').trim())
      currentSection = canonName
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
      const vals = sections[key]
      if (vals && vals.length) return vals.filter(Boolean).join('\n').trim()
    }
    return ''
  }

  // --- Name: often first line of preamble (not email/phone/url) ---
  const preamble = getSection('preamble') || ''
  const preambleLines = preamble.split('\n').map((l) => l.trim()).filter(Boolean)
  let fullName = ''
  const isSectionLike = (line) =>
    /^(summary(?:\s+of\s+qualifications)?|profile|objective|(?:professional|executive|career)\s+summary|about me|(?:related|other|professional|work)\s+(?:experience|history)|employment(?:\s+history)?|experience|education|(?:technical|core|key)\s+skills|skills|core competencies|qualifications|certifications|projects|languages?|references|interests|hobbies|volunteer(?:ing)?|activities|awards|honors|publications)\s*:?\s*$/i.test(
      line
    )
  for (const ln of preambleLines) {
    if (
      ln.length > 2 &&
      ln.length < 80 &&
      !ln.includes('@') &&
      !/^[\d\s\-+().]+$/.test(ln) &&
      !ln.startsWith('http') &&
      !isSectionLike(ln)
    ) {
      fullName = ln
      break
    }
  }
  if (!fullName) {
    const fallback = lines.find(
      (ln) =>
        ln.length > 2 &&
        ln.length < 80 &&
        !ln.includes('@') &&
        !/^[\d\s\-+().]+$/.test(ln) &&
        !isSectionLike(ln) &&
        !/\b(?:present|current|\d{4})\b/i.test(ln)
    )
    fullName = fallback || ''
  }

  // --- Location: best-effort from preamble lines (e.g. "Denver, CO") ---
  let location = ''
  for (const ln of preambleLines) {
    if (ln.includes('@') || /\d/.test(ln) || ln.startsWith('http') || isSectionLike(ln)) continue
    if (/,/.test(ln) && ln.length <= 90) {
      location = ln
      break
    }
  }

  // --- Summary ---
  const rawSummary = getSection('SUMMARY') || ''
  const summary = rawSummary
    .split(/\n/)
    .map((l) => l.trim().replace(BULLET_RE, '').replace(/^[•\-]\s*/, '').trim())
    .filter(Boolean)
    .join('\n')

  // --- Experience: all experience sections are merged under canonical 'EXPERIENCE' ---
  const experienceText = getSection('EXPERIENCE') || ''
  const experience = parseExperienceBlock(experienceText)
  const projectsText = getSection('PROJECTS') || ''
  const projects = parseProjectsBlock(projectsText)

  // --- Education ---
  const educationText = getSection('EDUCATION') || ''
  const education = parseEducationBlock(educationText)

  // --- Skills ---
  const skillsText = getSection('SKILLS') || ''
  const skills = parseSkillsBlock(skillsText)
  const languagesText = getSection('LANGUAGES') || ''
  const languages = parseLanguagesBlock(languagesText)
  const mergedSkills = dedupeStrings([...skills, ...languages]).slice(0, 60)
  const mergedExperience = [...experience, ...projects].slice(0, 20)

  const sanitize = (s) => s ? s.replace(BULLET_RE, '').replace(/\s{2,}/g, ' ').trim() : s

  const cleanExp = mergedExperience.map((e) => ({
    ...e,
    jobTitle: sanitize(e.jobTitle),
    company: sanitize(e.company),
    location: sanitize(e.location),
    description: e.description ? e.description.replace(BULLET_RE, '').replace(/  +/g, ' ').trim() : '',
  }))

  const cleanEdu = education.map((e) => ({
    ...e,
    degree: sanitize(e.degree),
    school: sanitize(e.school),
    location: sanitize(e.location),
    description: e.description ? e.description.replace(BULLET_RE, '').replace(/  +/g, ' ').trim() : '',
  }))

  const cleanSkills = mergedSkills.map((s) => sanitize(s)).filter((s) => s.length > 1)

  return {
    contact: {
      fullName: fullName || undefined,
      email: email || undefined,
      phone: phone || undefined,
      location: location || undefined,
      address: '',
      city: '',
      state: '',
      country: '',
      website: website || undefined,
      linkedin: linkedin || undefined,
    },
    summary: sanitize(summary).slice(0, 4000) || undefined,
    experience: cleanExp.length ? cleanExp : undefined,
    education: cleanEdu.length ? cleanEdu : undefined,
    skills: cleanSkills.length ? cleanSkills : undefined,
  }
}

// Date pattern: "Jan 2020", "2020 - 2022", "01/2020", "Present", "Current"
const DATE_TOKEN = '\\d{1,2}\\/\\d{1,2}\\/\\d{2,4}|\\d{1,2}\\/\\d{2,4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\\.?\\s*\\d{4}|\\d{4}'
const DATE_RANGE_RE = new RegExp(`(${DATE_TOKEN})\\s*[-–—]+\\s*(${DATE_TOKEN}|Present|Current)`, 'i')
const DATE_RANGE_RE_G = new RegExp(`(${DATE_TOKEN})\\s*[-–—]+\\s*(${DATE_TOKEN}|Present|Current)`, 'gi')
const SINGLE_DATE = new RegExp(`(${DATE_TOKEN})`, 'i')

function extractDates(text) {
  const rangeMatch = DATE_RANGE_RE.exec(text)
  if (rangeMatch) {
    return { startDate: rangeMatch[1].trim(), endDate: rangeMatch[2].trim(), full: rangeMatch[0] }
  }
  const singleMatch = SINGLE_DATE.exec(text)
  if (singleMatch) {
    return { startDate: '', endDate: singleMatch[1].trim(), full: singleMatch[0] }
  }
  return { startDate: '', endDate: '', full: '' }
}

function stripDates(text) {
  return text
    .replace(DATE_RANGE_RE_G, '')
    .replace(/\(\s*\d{4}\s*\)/g, '')
    .replace(/\b\d{4}\b/g, '')
    .replace(/\b(?:Present|Current)\b/gi, '')
    .replace(/\(\s*\)/g, '')
    .replace(/\(\s*$/, '')
    .replace(/[-–—,:;|]\s*$/g, '')
    .replace(/^\s*[-–—,:;|]\s*/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

function isBulletLine(line) {
  return /^[•\-]\s/.test(line)
}

function isCompanyLine(line) {
  if (!line || line.length > 120 || isBulletLine(line)) return false
  if (/(?:inc\b|llc\b|ltd\b|corp\b|company|college|university|institute|studio|agency|solutions|security|services|technologies|group)\b/i.test(line)) return true
  if (/,\s*[A-Z]{2}\b/.test(line) || /,\s*(?:ON|BC|AB|QC|MB|SK|NS|NB|PE|NL|YT|NT|NU|CA|US|UK)\b/i.test(line)) return true
  if (line.length < 60 && !isBulletLine(line) && !/\d{4}/.test(line)) return true
  return false
}

function parseExperienceBlock(text) {
  if (!text.trim()) return []
  const entries = []
  const blocks = text.split(/(?=^(?:.*\d{4}.*[-–—]\s*(?:(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+)?\d{4}|.*\d{4}.*[-–—]\s*(?:Present|Current)|.*(?:Present|Current)\s*$))/gim).map((b) => b.trim()).filter(Boolean)
  for (let block of blocks) {
    const lines = block.split(/\n/).map((l) => l.trim()).filter(Boolean)
    if (lines.length === 0) continue
    const first = lines[0]
    const { startDate, endDate } = extractDates(first)
    const cleaned = stripDates(first)
    let jobTitle = ''
    let company = ''
    let location = ''
    let descStart = 1

    const nextLine = lines.length > 1 ? lines[1] : ''
    const nextLineCleaned = stripDates(nextLine)
    const nextIsCompany = nextLine && !isBulletLine(nextLine) && isCompanyLine(nextLineCleaned)

    if (nextIsCompany) {
      jobTitle = cleaned
      const compParts = nextLineCleaned.split(',').map((p) => p.trim())
      company = compParts[0]
      if (compParts.length > 1) location = compParts.slice(1).join(', ')
      descStart = 2
    } else {
      const pipeParts = cleaned.split(/[|•]/).map((p) => p.trim()).filter(Boolean)
      if (pipeParts.length >= 2) {
        jobTitle = pipeParts[0]
        company = pipeParts.slice(1).join(', ')
      } else {
        const dashParts = cleaned.split(/\s+[-–—]\s+/).map((p) => p.trim()).filter(Boolean)
        if (dashParts.length === 2 && isCompanyLine(dashParts[1])) {
          jobTitle = dashParts[0]
          company = dashParts[1]
        } else {
          jobTitle = cleaned
        }
      }
    }

    const mergedDesc = []
    for (let di = descStart; di < lines.length; di++) {
      const raw = lines[di]
      const isBulletStart = /^•/.test(raw.trim())
      const cleaned = raw.replace(BULLET_RE, '').replace(/\s{2,}/g, ' ').trim()
      if (!cleaned) continue
      if (isBulletStart || mergedDesc.length === 0) {
        mergedDesc.push(cleaned)
      } else {
        mergedDesc[mergedDesc.length - 1] += ' ' + cleaned
      }
    }
    const desc = mergedDesc.join('\n').trim().slice(0, 3000)
    entries.push({
      id: safeUUID(),
      jobTitle: jobTitle || 'Role',
      company: company || '',
      location,
      startDate,
      endDate,
      current: /Present|Current/i.test(endDate),
      description: desc,
    })
  }
  if (entries.length === 0 && text.trim()) {
    const lines = text.split(/\n/).map((l) => l.trim()).filter(Boolean)
    const first = lines[0] || ''
    const { startDate, endDate } = extractDates(text)
    const rest = lines.slice(1).join('\n').trim().slice(0, 3000)
    entries.push({
      id: safeUUID(),
      jobTitle: stripDates(first) || 'Experience',
      company: '',
      location: '',
      startDate,
      endDate,
      current: /Present|Current/i.test(endDate),
      description: rest,
    })
  }
  return entries.slice(0, 20)
}

function parseEducationBlock(text) {
  if (!text.trim()) return []
  const rawLines = text
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean)

  const entries = []
  let current = null
  let collectingCourses = false

  const dateRangePattern = /(\d{4}|(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+\d{4})\s*[-–—]\s*(\d{4}|Present|Current|(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+\d{4})/i

  const looksLikeDegree = (line) =>
    /(?:bachelor|master(?:'?s)?|ph\.?d|diploma|certificate|associate|degree|\bb\.?\s?s\.?\b|\bb\.?\s?a\.?\b|\bm\.?\s?s\.?\b|\bm\.?\s?a\.?\b|\bm\.?\s?b\.?\s?a\b|technology)/i.test(line)
  const looksLikeSchool = (line) =>
    /(?:university|college|school|institute|academia|polytechnic)/i.test(line)
  const isCourseLine = (line) =>
    /(?:relevant\s+course|course\s*work|key\s+course)/i.test(line)

  for (const rawLine of rawLines) {
    const line = rawLine.replace(/^[•\-]\s*/, '').replace(BULLET_RE, '').trim()
    const isBullet = /^[•\-]\s/.test(rawLine)

    const isNewEntry = looksLikeDegree(line) || (!current && looksLikeSchool(line))

    if (isCourseLine(line)) { collectingCourses = true; continue }

    if (collectingCourses && !isNewEntry) {
      if ((isBullet || line.length < 80) && current && line) {
        const courses = current.description ? current.description.split('\n') : []
        courses.push(line)
        current.description = courses.join('\n')
      }
      continue
    }

    if (isNewEntry) collectingCourses = false

    if (!current || isNewEntry) {
      if (current) entries.push(current)
      collectingCourses = false
      const m = line.match(dateRangePattern)
      const withNoDates = m ? line.replace(m[0], '').trim() : line
      let degree = withNoDates
      let school = ''
      const dashSplit = withNoDates.split(/\s+[-–—]\s+/)
      if (dashSplit.length >= 2) {
        const hasSchoolPart = dashSplit.some((p) => looksLikeSchool(p))
        if (hasSchoolPart) {
          const schoolIdx = dashSplit.findIndex((p) => looksLikeSchool(p))
          school = dashSplit[schoolIdx].trim()
          degree = dashSplit.filter((_, i) => i !== schoolIdx).join(' – ').trim()
        }
      }
      degree = degree
        .replace(/\(\s*\)/g, '')
        .replace(/\(\s*$/, '')
        .replace(/[-–—,:;]\s*$/g, '')
        .replace(/\s{2,}/g, ' ')
        .trim()
      school = school
        .replace(/\(\s*\)/g, '')
        .replace(/[-–—,:;]\s*$/g, '')
        .replace(/\s{2,}/g, ' ')
        .trim()
      current = {
        id: safeUUID(),
        degree: degree || 'Degree',
        school,
        location: '',
        startDate: m ? m[1] : '',
        endDate: m ? m[2] : '',
        description: '',
      }
      continue
    }

    if (!current.school && looksLikeSchool(line)) {
      const parts = line.split(',').map((p) => p.trim())
      current.school = parts[0] || line
      if (parts.length > 1) {
        current.location = parts.slice(1).join(', ')
      }
      continue
    }

    if (isBullet && current && line) {
      const courses = current.description ? current.description.split('\n') : []
      courses.push(line)
      current.description = courses.join('\n')
      continue
    }
  }

  if (current) entries.push(current)
  return entries
    .filter((e) => e.startDate || e.endDate || e.school)
    .slice(0, 10)
}

function splitRespectingParens(str) {
  const result = []
  let depth = 0
  let current = ''
  for (const ch of str) {
    if (ch === '(') depth++
    if (ch === ')') depth = Math.max(0, depth - 1)
    if (ch === ',' && depth === 0) {
      result.push(current.trim())
      current = ''
    } else {
      current += ch
    }
  }
  if (current.trim()) result.push(current.trim())
  return result
}

function parseSkillsBlock(text) {
  if (!text.trim()) return []
  const cleaned = text.replace(BULLET_RE, ' ')
  const lines = cleaned.split(/\n/).map((l) => l.trim()).filter(Boolean)
  const valueLines = lines
    .filter((l) => !/^[•\-]\s*$/.test(l))
    .map((line) => {
      const stripped = line.replace(/^[•\-]\s*/, '')
      const colonIdx = stripped.indexOf(':')
      if (colonIdx > 0 && colonIdx < 40) {
        return stripped.slice(colonIdx + 1).trim()
      }
      return stripped
    })
    .filter(Boolean)

  const joined = valueLines.join(', ')
    .replace(/[|;]+/g, ',')
    .replace(/\s{2,}/g, ' ')

  const rawTokens = splitRespectingParens(joined)
    .map((x) => x.trim().replace(/\s{2,}/g, ' '))
    .filter((x) => x.length > 1 && x.length < 80)

  const expanded = []
  for (const token of rawTokens) {
    if (token.length >= 10 && !/\s/.test(token) && /[a-z][A-Z]/.test(token)) {
      expanded.push(...splitConcatenatedSkills(token))
    } else {
      expanded.push(token)
    }
  }

  return dedupeStrings(expanded).slice(0, 30)
}

function parseProjectsBlock(text) {
  if (!text.trim()) return []
  const lines = text
    .split(/\n/)
    .map((l) => l.trim().replace(/^[•\-]\s*/, ''))
    .filter(Boolean)

  const projects = []
  let current = null

  for (const line of lines) {
    const hasProjectSeparator = /\s+[–—-]\s+/.test(line)

    if (!current || hasProjectSeparator) {
      if (current) projects.push(current)
      const [titlePart, ...rest] = line.split(/\s+[–—-]\s+/)
      const title = (titlePart || 'Project').trim()
      const description = rest.join(' - ').trim()
      current = {
        id: safeUUID(),
        jobTitle: title || 'Project',
        company: 'Projects',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: description || '',
      }
      continue
    }

    current.description = current.description
      ? `${current.description} ${line}`.trim()
      : line
  }

  if (current) projects.push(current)
  return projects.slice(0, 10)
}

function parseLanguagesBlock(text) {
  if (!text.trim()) return []
  return dedupeStrings(
    text
      .replace(/\n+/g, ',')
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean)
  ).slice(0, 12)
}

function dedupeStrings(items) {
  const seen = new Set()
  const result = []
  for (const item of items) {
    const clean = item.trim()
    if (!clean) continue
    const key = clean.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    result.push(clean)
  }
  return result
}

const KNOWN_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'HTML/CSS', 'HTML', 'CSS',
  'Python', 'Git', 'API Development', 'Debugging', 'UI/UX Basics', 'UI/UX',
  'Java', 'C++', 'C#', 'SQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker',
]

function normalizeSkillKey(value) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function splitConcatenatedSkills(token) {
  const plain = token.trim()
  if (!plain) return []

  const key = normalizeSkillKey(plain)
  if (key.length < 10) return [plain]

  const dict = KNOWN_SKILLS
    .map((skill) => ({ skill, key: normalizeSkillKey(skill) }))
    .sort((a, b) => b.key.length - a.key.length)

  const out = []
  let i = 0
  while (i < key.length) {
    let matched = null
    for (const entry of dict) {
      if (key.startsWith(entry.key, i)) {
        matched = entry
        break
      }
    }
    if (!matched) return [plain]
    out.push(matched.skill)
    i += matched.key.length
  }

  return out.length ? out : [plain]
}
