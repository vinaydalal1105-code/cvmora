import { Link } from 'react-router-dom'
import type { CoverLetterData, CoverLetterTemplateId } from '../types/coverLetter'
import { CoverLetterProfessional, CoverLetterModern, CoverLetterMinimal } from './coverLetterTemplates'

const PREVIEW_AREA_HEIGHT = 380
const PREVIEW_AREA_PADDING = 12
const LETTER_HEIGHT = 842
const LETTER_WIDTH = 595
const scale = (PREVIEW_AREA_HEIGHT - PREVIEW_AREA_PADDING * 2) / LETTER_HEIGHT
const scaledWidth = Math.round(LETTER_WIDTH * scale)
const scaledHeight = Math.round(LETTER_HEIGHT * scale)

const SAMPLE_DATA: CoverLetterData = {
  title: 'Cover Letter',
  full_name: 'Jordan Taylor',
  address: 'Denver, CO',
  phone: '(555) 321-6543',
  email: 'jordan.taylor@email.com',
  job_title: 'Project Manager',
  company: 'Tech Solutions Inc.',
  hiring_manager: 'Hiring Manager',
  body: 'Dear Hiring Manager,\n\nI am writing to express my interest in the Project Manager position at Tech Solutions Inc. With over six years of experience leading cross-functional teams and delivering projects on time and within budget, I am confident I would be a strong addition to your team.\n\nIn my current role as Senior Project Manager, I have improved release cycle time by 30% and consistently delivered 95% of projects on schedule. I am skilled in Agile methodologies, stakeholder management, and risk mitigation.\n\nI would welcome the opportunity to discuss how my experience aligns with your needs. Thank you for your consideration.',
  template_id: 'professional',
}

const TEMPLATE_MAP = {
  professional: CoverLetterProfessional,
  modern: CoverLetterModern,
  minimal: CoverLetterMinimal,
} as const

interface CoverLetterTemplateCardProps {
  id: CoverLetterTemplateId
  name: string
  desc: string
}

export function CoverLetterTemplateCard({ id, name, desc }: CoverLetterTemplateCardProps) {
  const Template = TEMPLATE_MAP[id]
  const previewData: CoverLetterData = { ...SAMPLE_DATA, template_id: id }

  return (
    <Link
      to="/cover-letter"
      state={{ templateId: id }}
      className="group block overflow-hidden rounded-2xl border border-[#e5e7eb]/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-lg hover:border-[#f97316]/20 transition-all duration-200 text-left"
    >
      <div
        className="w-full flex items-start justify-center overflow-hidden rounded-t-2xl bg-[#f8f9fa]"
        style={{ height: PREVIEW_AREA_HEIGHT, padding: PREVIEW_AREA_PADDING }}
      >
        <div
          className="relative flex-shrink-0 overflow-hidden shadow-md"
          style={{ width: scaledWidth, height: scaledHeight }}
        >
          <div
            className="absolute bg-white origin-top-left"
            style={{
              width: LETTER_WIDTH,
              height: LETTER_HEIGHT,
              transform: `scale(${scale})`,
            }}
          >
            <Template data={previewData} />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 pt-4 px-4 pb-4 border-t border-[#e5e7eb]/80">
        <h2 className="font-bold text-[#1d1d1f] text-[1rem] leading-tight">{name}</h2>
        <p className="text-[0.8125rem] text-[#6e6e73] leading-snug line-clamp-2">{desc}</p>
        <span className="inline-flex items-center gap-1.5 text-[0.875rem] font-semibold text-[#f97316] group-hover:gap-2.5 transition-all duration-200 mt-1">
          Use this template
          <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  )
}
