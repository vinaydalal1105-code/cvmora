import type { ParsedResumeData } from '../api/client'
import { defaultResume } from '../data/defaultResume'
import type { ResumeData } from '../types/resume'

export const PENDING_UPLOADED_RESUME_KEY = 'cvmora_pending_uploaded_resume'

function hasParsedContent(parsed: ParsedResumeData | null | undefined): boolean {
  if (!parsed) return false
  return Boolean(
    parsed.summary?.trim() ||
      parsed.contact?.fullName?.trim() ||
      parsed.experience?.length ||
      parsed.education?.length ||
      parsed.skills?.length
  )
}

export function buildResumeFromUpload(input: {
  text?: string
  parsed?: ParsedResumeData | null
}): ResumeData | null {
  const { text, parsed } = input
  if (hasParsedContent(parsed)) {
    const contactOverrides = parsed?.contact
      ? (Object.fromEntries(
          Object.entries(parsed.contact).filter(([, v]) => v != null && v !== '')
        ) as Partial<ResumeData['contact']>)
      : {}

    const splitName = (name: string | undefined) => {
      const raw = (name ?? '').trim().replace(/\s+/g, ' ')
      if (!raw) return { firstName: '', lastName: '' }
      const parts = raw.split(' ')
      if (parts.length === 1) return { firstName: parts[0], lastName: '' }
      return {
        firstName: parts.slice(0, -1).join(' '),
        lastName: parts.slice(-1).join(' '),
      }
    }

    const parseLocationParts = (location: string | undefined) => {
      const raw = (location ?? '').trim()
      if (!raw) return { city: '', state: '', country: '' }
      const parts = raw
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean)
      return {
        city: parts[0] ?? '',
        state: parts[1] ?? '',
        country: parts[2] ?? '',
      }
    }

    const normalizedExperience = (parsed?.experience ?? []).map((exp) => ({
      id: exp.id || crypto.randomUUID(),
      jobTitle: exp.jobTitle ?? '',
      company: exp.company ?? '',
      location: exp.location ?? '',
      startDate: exp.startDate ?? '',
      endDate: exp.endDate ?? '',
      current: Boolean(exp.current),
      description: exp.description ?? '',
    }))

    const normalizedEducation = (parsed?.education ?? []).map((edu) => ({
      id: edu.id || crypto.randomUUID(),
      degree: edu.degree ?? '',
      school: edu.school ?? '',
      location: edu.location ?? '',
      startDate: edu.startDate ?? '',
      endDate: edu.endDate ?? '',
      description: edu.description ?? '',
    }))

    const inferredName = splitName(contactOverrides.fullName)
    const inferredLocation = parseLocationParts(contactOverrides.location)
    const mergedContact: ResumeData['contact'] = {
      ...defaultResume.contact,
      ...contactOverrides,
      firstName: contactOverrides.firstName ?? inferredName.firstName ?? defaultResume.contact.firstName,
      lastName: contactOverrides.lastName ?? inferredName.lastName ?? defaultResume.contact.lastName,
      city: contactOverrides.city ?? inferredLocation.city ?? defaultResume.contact.city,
      state: contactOverrides.state ?? inferredLocation.state ?? defaultResume.contact.state,
      country: contactOverrides.country ?? inferredLocation.country ?? defaultResume.contact.country,
    }
    if (!mergedContact.location) {
      mergedContact.location = [mergedContact.city, mergedContact.state, mergedContact.country]
        .map((s) => (s ?? '').trim())
        .filter(Boolean)
        .join(', ')
    }
    if (!mergedContact.fullName) {
      mergedContact.fullName = [mergedContact.firstName, mergedContact.lastName]
        .map((s) => (s ?? '').trim())
        .filter(Boolean)
        .join(' ')
    }

    return {
      ...defaultResume,
      contact: mergedContact,
      summary: parsed?.summary?.trim() ? parsed.summary : defaultResume.summary,
      experience: normalizedExperience.length ? normalizedExperience : [...defaultResume.experience],
      education: normalizedEducation.length ? normalizedEducation : [...defaultResume.education],
      skills: parsed?.skills?.length ? parsed.skills : defaultResume.skills,
    }
  }

  if (text?.trim()) {
    return { ...defaultResume, summary: text.slice(0, 4000) }
  }

  return null
}
