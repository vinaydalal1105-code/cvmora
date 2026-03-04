/**
 * Shared spacing and typography for resume templates.
 * Use these constants so line spacing and section spacing are identical across all templates.
 */
export const resumeSpacing = {
  /** Section wrapper (e.g. Summary, Experience, Education) */
  section: 'mb-4',
  /** Section heading (h2) */
  sectionHeading:
    'text-[11px] font-bold uppercase tracking-widest text-[#1c1c1c] mb-1.5 pb-0.5 border-b border-[#e5e7eb]',
  /** Summary / profile paragraph */
  summary: 'text-[13px] text-[#333] leading-relaxed mt-1',
  /** Summary when parent already sets text size (e.g. CleanTemplate) */
  summaryPlain: 'text-[#333] leading-relaxed mt-1',
  /** Bullet list (experience descriptions) */
  bulletList: 'mt-1.5 list-disc pl-4 space-y-1 text-[#333] text-[13px] leading-relaxed',
  /** Single experience/education entry block */
  expEntry: 'mb-4',
  /** Company / institution line under job title */
  companyLine: 'text-[12px] text-[#4b5563] mt-0.5',
  /** Education entry block */
  eduEntry: 'mb-3',
  /** Education description paragraph */
  eduDescription: 'text-[13px] text-[#333] mt-1 leading-relaxed',
  /** Education description smaller (e.g. in CleanTemplate) */
  eduDescriptionSm: 'text-[12px] text-[#333] mt-1 leading-relaxed',
  /** Skills paragraph */
  skills: 'text-[13px] text-[#333] leading-relaxed mt-1',
  /** Skills when parent sets text size */
  skillsPlain: 'text-[#333] leading-relaxed mt-1',
  /** References container - break-words so long emails stay inside bounds */
  refBlock: 'text-[13px] text-[#333] space-y-1.5 leading-relaxed mt-1 break-words overflow-hidden',
  /** Wrapper for multiple experience entries (space between jobs) */
  expWrapper: 'space-y-4',
} as const
