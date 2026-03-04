import type { Contact } from '../types/resume'

/** Display name for preview/export: first + last if either set, else fullName */
export function displayName(contact: Contact): string {
  const firstLast = [contact.firstName, contact.lastName]
    .filter(Boolean)
    .map((s) => (s ?? '').trim())
    .join(' ')
    .trim()
  return firstLast || contact.fullName || ''
}
