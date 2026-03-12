import { useState, useRef, useEffect, type ChangeEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { allTemplates } from '../data/templates'
import { TemplateCard } from '../components/TemplateCard'
import { LetsGetStartedModal } from '../components/LetsGetStartedModal'
import { apiUploadResume } from '../api/client'
import { buildResumeFromUpload, PENDING_UPLOADED_RESUME_KEY } from '../utils/uploadedResume'
import type { ResumeTemplate, TemplateCategory } from '../data/templates'
import type { ResumeData } from '../types/resume'

const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  simple: 'Simple',
  professional: 'Professional',
  modern: 'Modern',
  ats: 'ATS',
  twoColumn: 'Two-column',
  picture: 'Picture',
}

const CATEGORY_DESCRIPTIONS: Record<TemplateCategory, string> = {
  simple: 'Clean, timeless templates with a classic balanced structure. Perfect for any job.',
  professional: 'Job-winning templates to showcase professionalism, dependability, and expertise.',
  modern: 'Current and stylish designs for forward-thinking candidates in innovative fields.',
  ats: 'Optimize your resume for ATS scanners with clear formatting and clear section labels.',
  twoColumn: 'Maximize space with a clean two-column layout. Easy to scan and highlight your experience.',
  picture: 'Templates designed to combine a polished layout with your professional photo.',
}

export function Templates() {
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate | null>(null)
  const [selectedAccentColor, setSelectedAccentColor] = useState<string | undefined>(undefined)
  const [builderQuery, setBuilderQuery] = useState<string>('')
  const [filter, setFilter] = useState<TemplateCategory | 'all'>('all')
  const pendingRef = useRef<{ templateId: string; accentColor: string | undefined } | null>(null)
  const uploadInputRef = useRef<HTMLInputElement>(null)
  const [uploadingResume, setUploadingResume] = useState(false)
  const [uploadResumeError, setUploadResumeError] = useState('')
  const [previewResume, setPreviewResume] = useState<ResumeData | null>(null)

  const handleSelectTemplate = (template: ResumeTemplate, accentColor?: string, _query?: string) => {
    if (accentColor && /^#[0-9A-Fa-f]{6}$/.test(accentColor)) {
      try {
        sessionStorage.setItem('cvmora_builder_accent', accentColor)
      } catch (_) {}
    }

    if (previewResume) {
      const base = `?template=${encodeURIComponent(template.id)}`
      const accentParam = accentColor && /^#[0-9A-Fa-f]{6}$/.test(accentColor) ? `&accent=${encodeURIComponent(accentColor)}` : ''
      navigate(`/builder${base}${accentParam}`, { state: accentColor ? { accentColor } : {} })
      return
    }

    pendingRef.current = { templateId: template.id, accentColor }
    setSelectedTemplate(template)
    setSelectedAccentColor(accentColor)
    setBuilderQuery(_query ?? `?template=${encodeURIComponent(template.id)}`)
    setModalOpen(true)
  }

  const filteredTemplates = filter === 'all'
    ? allTemplates
    : allTemplates.filter((t) => t.category === filter)

  const categoriesWithTemplates = ['simple', 'professional', 'modern', 'ats', 'twoColumn', 'picture'] as const
  const categories: (TemplateCategory | 'all')[] = ['all', ...categoriesWithTemplates.filter((c) => allTemplates.some((t) => t.category === c))]

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(PENDING_UPLOADED_RESUME_KEY)
      if (raw) {
        const pending = JSON.parse(raw) as ResumeData
        setPreviewResume(pending)
      }
    } catch {
      // ignore malformed session payload
    }
  }, [])

  const handleTemplateUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadResumeError('')
    setUploadingResume(true)
    try {
      const { text, data: parsed } = await apiUploadResume(file)
      const next = buildResumeFromUpload({ text, parsed })
      if (!next) {
        throw new Error('Could not read resume content from that file.')
      }
      sessionStorage.setItem(PENDING_UPLOADED_RESUME_KEY, JSON.stringify(next))
      setPreviewResume(next)
    } catch (err) {
      setUploadResumeError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploadingResume(false)
      e.target.value = ''
    }
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-4xl md:text-[2.75rem] font-bold text-[#1c1917] tracking-tight mb-3 sm:mb-4">
            Resume templates
          </h1>
          <p className="text-base sm:text-lg text-[#78716c] max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed px-0" style={{ lineHeight: 1.6 }}>
            Each resume template is designed to follow the exact rules you need to get hired faster. Use our resume templates and get free access to career tools!
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3">
            <Link
              to="/builder"
              className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 rounded-full bg-[#BFED8D] text-[#1c1917] text-[15px] sm:text-[16px] font-medium border border-[#a8e070] hover:bg-[#b0e87d] transition-colors shadow-sm"
            >
              Create my resume
            </Link>
            <button
              type="button"
              onClick={() => uploadInputRef.current?.click()}
              disabled={uploadingResume}
              className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 rounded-full border-2 border-[#e7e5e4] text-[#1c1917] text-[15px] sm:text-[16px] font-medium hover:border-[#d6d3d1] hover:bg-[#fafafa] transition-colors disabled:opacity-60"
            >
              {uploadingResume ? 'Uploading…' : 'Upload my resume'}
            </button>
            <input
              ref={uploadInputRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={handleTemplateUpload}
              disabled={uploadingResume}
            />
          </div>
          {uploadResumeError && (
            <p className="text-sm text-red-600 mt-3">{uploadResumeError}</p>
          )}
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`min-h-[44px] flex items-center px-4 py-2.5 rounded-full text-sm sm:text-base font-medium transition-all ${
                filter === cat
                  ? 'bg-[#fff7ed] text-[#f97316] border border-[#f97316]/30'
                  : 'bg-white text-[#1c1917] border border-[#e7e5e4] hover:border-[#d6d3d1] hover:bg-[#fafafa] active:bg-[#f5f5f4]'
              }`}
            >
              {cat === 'all' ? 'All templates' : CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Template grid - 3 cols like resume.io */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredTemplates.map((t) => (
          <TemplateCard
            key={t.id}
            template={t}
            variant="default"
            onSelectTemplate={handleSelectTemplate}
            previewData={previewResume ?? undefined}
          />
        ))}
        </div>

        {/* Explore by category - resume.io style */}
        <section className="mt-20 pt-16 border-t border-[#d2d2d7]">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1c1917] mb-3 tracking-tight">
            Can&apos;t Find the Perfect Template? Explore by Category:
          </h2>
          <div className="flex flex-wrap gap-2 mt-6 mb-12">
            {(['simple', 'professional', 'modern', 'ats', 'twoColumn'] as TemplateCategory[]).filter((c) => allTemplates.some((t) => t.category === c)).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={`px-3.5 py-2 rounded-full text-base font-medium transition-all ${
                  filter === cat
                    ? 'bg-[#fff7ed] text-[#f97316] border border-[#f97316]/30'
                    : 'bg-white text-[#1c1917] border border-[#e7e5e4] hover:border-[#d6d3d1]'
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
          <div className="space-y-16">
            {(['simple', 'professional', 'modern', 'ats', 'twoColumn', 'picture'] as TemplateCategory[]).map((cat) => {
              const list = allTemplates.filter((t) => t.category === cat)
              if (list.length === 0) return null
              return (
                <div key={cat}>
                  <h3 className="text-xl font-bold text-[#1c1917] mb-2">{CATEGORY_LABELS[cat]} resume templates</h3>
                  <p className="text-base text-[#78716c] mb-6 max-w-2xl leading-relaxed" style={{ lineHeight: 1.55 }}>{CATEGORY_DESCRIPTIONS[cat]}</p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {list.slice(0, 4).map((t) => (
                      <TemplateCard
                        key={t.id}
                        template={t}
                        variant="default"
                        onSelectTemplate={handleSelectTemplate}
                        previewData={previewResume ?? undefined}
                      />
                    ))}
                  </div>
                  {list.length > 4 && (
                    <button
                      type="button"
                      onClick={() => setFilter(cat)}
                      className="mt-6 text-base font-semibold text-[#f97316] hover:underline"
                    >
                      Show all {CATEGORY_LABELS[cat].toLowerCase()} templates →
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        <div className="mt-12 pb-8">
          <Link
            to="/templates/ats"
            className="inline-flex items-center gap-1.5 text-base font-semibold text-[#f97316] hover:underline"
          >
            ATS resume templates
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      <LetsGetStartedModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedTemplate(null); setSelectedAccentColor(undefined); setBuilderQuery(''); pendingRef.current = null }}
        templateId={selectedTemplate?.id ?? null}
        accentColor={selectedAccentColor}
        builderQuery={builderQuery}
        pendingRef={pendingRef}
      />
    </div>
  )
}
