import { Link } from 'react-router-dom'
import { CoverLetterTemplateCard } from '../components/CoverLetterTemplateCard'
import type { CoverLetterTemplateId } from '../types/coverLetter'

const TEMPLATES: { id: CoverLetterTemplateId; name: string; desc: string }[] = [
  { id: 'professional', name: 'Professional', desc: 'Classic centered layout with a clear header and horizontal rule. Ideal for corporate and formal roles.' },
  { id: 'modern', name: 'Modern', desc: 'Left-aligned with a subtle accent bar. Clean and contemporary, great for tech and creative industries.' },
  { id: 'minimal', name: 'Minimal', desc: 'Lots of whitespace and simple typography. Understated and easy to read.' },
]

export function CoverLetterTemplates() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-14 sm:py-20">
      <h1 className="text-3xl sm:text-4xl font-bold text-[#1c1917] tracking-tight mb-2">
        Cover letter templates
      </h1>
      <p className="text-lg text-[#78716c] mb-10 max-w-xl" style={{ lineHeight: 1.6 }}>
        Choose a layout that fits your style. Each template works for any industry.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {TEMPLATES.map((t) => (
          <CoverLetterTemplateCard
            key={t.id}
            id={t.id}
            name={t.name}
            desc={t.desc}
          />
        ))}
      </div>
      <div className="mt-12 text-center">
        <Link
          to="/cover-letter"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#BFED8D] text-[#1c1917] text-base font-semibold border border-[#a8e070] hover:bg-[#b0e87d] transition-colors"
        >
          Start from scratch in builder
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  )
}
