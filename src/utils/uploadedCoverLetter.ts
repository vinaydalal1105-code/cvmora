import type { ParsedResumeData } from '../api/client'
import type { CoverLetterData } from '../types/coverLetter'

/**
 * Build CoverLetterData from an uploaded PDF/Word file.
 * Reuses the same upload/parse endpoint as resumes; text becomes the letter body,
 * and parsed contact info (if any) fills personal fields.
 */
export function buildCoverLetterFromUpload(input: {
  text?: string
  parsed?: ParsedResumeData | null
}): CoverLetterData {
  const { text = '', parsed } = input
  const contact = parsed?.contact ?? {}
  return {
    title: 'Cover Letter',
    full_name: (contact.fullName ?? '').trim(),
    address: (contact.address ?? contact.location ?? '').trim(),
    phone: (contact.phone ?? '').trim(),
    email: (contact.email ?? '').trim(),
    job_title: '',
    company: '',
    hiring_manager: '',
    body: typeof text === 'string' ? text.trim() : '',
    template_id: 'professional',
  }
}
