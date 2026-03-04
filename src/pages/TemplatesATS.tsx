import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { categoryFilters, atsTemplates } from '../data/templates'
import { TemplateCard } from '../components/TemplateCard'
import { LetsGetStartedModal } from '../components/LetsGetStartedModal'
import type { ResumeTemplate } from '../data/templates'

export function TemplatesATS() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate | null>(null)
  const [selectedAccentColor, setSelectedAccentColor] = useState<string | undefined>(undefined)
  const [builderQuery, setBuilderQuery] = useState<string>('')
  const pendingRef = useRef<{ templateId: string; accentColor: string | undefined } | null>(null)

  const handleSelectTemplate = (template: ResumeTemplate, accentColor?: string, query?: string) => {
    pendingRef.current = { templateId: template.id, accentColor }
    setSelectedTemplate(template)
    setSelectedAccentColor(accentColor)
    setBuilderQuery(query ?? `?template=${encodeURIComponent(template.id)}`)
    if (accentColor && /^#[0-9A-Fa-f]{6}$/.test(accentColor)) {
      try {
        sessionStorage.setItem('cvmora_builder_accent', accentColor)
      } catch (_) {}
    }
    setModalOpen(true)
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-[#78716c] mb-8" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-[#f97316] transition-colors">Home</Link>
          <span aria-hidden>/</span>
          <Link to="/templates" className="hover:text-[#f97316] transition-colors">Resume Templates</Link>
          <span aria-hidden>/</span>
          <span className="text-[#1c1917] font-medium">ATS</span>
        </nav>

        {/* Hero */}
        <header className="mb-10 sm:mb-12">
          <h1 className="text-3xl sm:text-[2.25rem] font-bold text-[#1c1917] tracking-tight mb-4">
            ATS resume templates
          </h1>
          <p className="text-lg text-[#78716c] leading-relaxed max-w-2xl mb-8" style={{ lineHeight: 1.6 }}>
            Enhance your job search with our ATS resume templates. Impress human and robot recruiters with an effective design. Beat the algorithm, and showcase attention to detail.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/builder"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#BFED8D] text-[#1c1917] text-[16px] font-medium border border-[#a8e070] hover:bg-[#b0e87d] transition-colors shadow-sm"
            >
              Create my resume
            </Link>
            <Link
              to="/builder"
              state={{ showUpload: true }}
              className="inline-flex items-center justify-center px-6 py-3 rounded-full border-2 border-[#e7e5e4] text-[#1c1917] text-[16px] font-medium hover:border-[#d6d3d1] hover:bg-[#fafafa] transition-colors"
            >
              Upload my resume
            </Link>
          </div>
        </header>

        {/* Category filter bar - same style as Templates page */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categoryFilters.map((f) => (
            <Link
              key={f.label}
              to={f.to}
              className={`px-4 py-2.5 rounded-full text-base font-medium transition-all ${
                f.active
                  ? 'bg-[#fff7ed] text-[#f97316] border border-[#f97316]/30'
                  : 'bg-white text-[#1c1917] border border-[#e7e5e4] hover:border-[#d6d3d1] hover:bg-[#fafafa]'
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>

        {/* Template grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {atsTemplates.map((t) => (
            <TemplateCard
              key={t.id}
              template={t}
              variant="ats"
              onSelectTemplate={handleSelectTemplate}
            />
          ))}
        </div>

        <LetsGetStartedModal
          open={modalOpen}
          onClose={() => { setModalOpen(false); setSelectedTemplate(null); setSelectedAccentColor(undefined); setBuilderQuery(''); pendingRef.current = null }}
          templateId={selectedTemplate?.id ?? null}
          accentColor={selectedAccentColor}
          builderQuery={builderQuery}
          pendingRef={pendingRef}
        />

        {/* What is ATS-friendly? */}
        <section className="border-t border-cvmora-ink/10 pt-12 pb-8">
          <h2 className="text-xl font-bold text-cvmora-ink tracking-tight mb-4">
            What is an ATS-friendly resume?
          </h2>
          <p className="text-base text-cvmora-ink/80 leading-relaxed max-w-3xl mb-4" style={{ lineHeight: 1.6 }}>
            An applicant tracking system (ATS) is software recruiters use to screen resumes. It scans your resume for keywords and structure. Only the best-matching applications get through. Using a clean, standard layout and the right headings helps the system read your resume correctly—so your experience gets seen by recruiters.
          </p>
          <p className="text-base text-cvmora-ink/80 leading-relaxed max-w-3xl" style={{ lineHeight: 1.6 }}>
            Our ATS resume templates use simple formatting, clear section labels, and no complex graphics, so they work with the algorithms and still look professional to humans.
          </p>
        </section>
      </div>
    </div>
  )
}
