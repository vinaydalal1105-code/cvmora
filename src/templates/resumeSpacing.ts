/**
 * Limit text length for preview so accidentally pasted repeated content doesn't flood the page.
 * Full text is still saved and exported; this only affects on-screen display.
 */
export function truncateForPreview(text: string, maxLen = 2500): string {
  if (!text || text.length <= maxLen) return text
  return text.slice(0, maxLen).trim() + ' …'
}

/**
 * Returns a color safe for text on white backgrounds.
 * Dark accents (navy, forest, charcoal) pass through unchanged.
 * Light/pastel accents fall back to #1e293b (dark slate) since darkening
 * pastels just produces muddy, unattractive colors.
 */
export function textSafeAccent(hex: string): string {
  const h = hex.replace(/^#/, '')
  if (h.length !== 6) return hex
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255
  const lum = 0.299 * r + 0.587 * g + 0.114 * b
  if (lum <= 0.4) return hex
  return '#1e293b'
}

/**
 * Shared spacing and typography for resume templates.
 * Use these constants so line spacing and section spacing are identical across all templates.
 */
export const resumeSpacing = {
  section: 'mb-5',
  sectionHeading:
    'text-[11px] font-bold uppercase tracking-[0.18em] text-[#111827] mb-2 pb-1 border-b border-[#d1d5db]',
  summary: 'text-[12.5px] text-[#374151] leading-[1.65] mt-1',
  summaryPlain: 'text-[#374151] leading-[1.65] mt-1',
  bulletList: 'mt-1.5 list-disc pl-4 space-y-[3px] text-[#374151] text-[12.5px] leading-[1.6]',
  expEntry: 'mb-4',
  companyLine: 'text-[11.5px] text-[#6b7280] mt-0.5 font-medium',
  eduEntry: 'mb-3',
  eduDescription: 'text-[12.5px] text-[#374151] mt-1 leading-[1.6]',
  eduDescriptionSm: 'text-[12.5px] text-[#374151] mt-1 leading-[1.6]',
  skills: 'text-[12.5px] text-[#374151] leading-[1.65] mt-1',
  skillsPlain: 'text-[#374151] leading-[1.65] mt-1',
  refBlock: 'text-[12.5px] text-[#374151] space-y-1.5 leading-[1.6] mt-1 break-words overflow-hidden',
  expWrapper: 'space-y-4',
} as const
