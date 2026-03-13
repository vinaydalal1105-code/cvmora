import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { ResumeProvider, useResume } from '../context/ResumeContext'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/client'
import { apiUploadResume } from '../api/client'
import { ResumePreview, type ResumePreviewHandle, DEFAULT_ACCENTS } from '../components/ResumePreview'
import { TemplatePicker } from '../components/TemplatePicker'
import {
  BUILDER_STEPS,
  resumeScore,
  BuilderStepContent,
  BuilderStepFooter,
} from '../components/BuilderSteps'
import { LogoMark } from '../components/Logo'
import type { ResumeData } from '../types/resume'
import { filledExamples } from '../data/filledExamples'
import { displayName } from '../utils/resume'
import { buildResumeFromUpload, PENDING_UPLOADED_RESUME_KEY } from '../utils/uploadedResume'

import type { TemplateId } from '../types/resume'

const TEMPLATE_MAP: Record<string, TemplateId> = {
  classic: 'classic',
  traditional: 'traditional',
  professional: 'professional',
  corporate: 'professional',
  modern: 'modern',
  'simple-ats': 'clean',
  'precision-ats': 'clean',
  balanced: 'balanced',
  'header-ats': 'header-ats',
  minimal: 'minimal',
  vivid: 'vivid',
  'sidebar-right': 'sidebar-right',
  'centered-clean': 'centered-clean',
  'accent-bar': 'accent-bar',
  'vertical-line': 'vertical-line',
  'initials-header': 'initials-header',
  divided: 'divided',
  story: 'story',
  deco: 'deco',
  proficiency: 'proficiency',
  'header-profile': 'header-profile',
  elegant: 'elegant',
  pillar: 'pillar',
  spotlight: 'spotlight',
  card: 'card',
  serif: 'serif',
  'bold-block': 'bold-block',
  timeline: 'timeline',
  luxe: 'luxe',
  gradient: 'gradient',
  neon: 'neon',
  geometric: 'geometric',
  aura: 'aura',
}

const ACCENT_COLORS = ['#eccbc3', '#aabcdf', '#baa989', '#696969', '#b0e0dd', '#e38779', '#1e3a5f'] as const

const TEMPLATES_WITH_COLOR_OPTIONS = new Set<TemplateId>([
  'professional', 'modern', 'balanced', 'header-ats', 'vivid',
  'sidebar-right', 'centered-clean', 'accent-bar', 'vertical-line',
  'initials-header', 'divided', 'story', 'deco', 'proficiency',
  'header-profile', 'elegant', 'pillar', 'spotlight', 'card',
  'serif', 'bold-block', 'timeline', 'luxe', 'corporate',
  'gradient', 'neon', 'geometric', 'aura',
])

function ResumeBuilderInner() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user, refreshUser } = useAuth()
  const { data, template, accentColor, loadData, setTemplate, setAccentColor } = useResume()
  const [loading, setLoading] = useState(!!id && isAuthenticated)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const uploadInputRef = useRef<HTMLInputElement>(null)
  const [builderStep, setBuilderStep] = useState(0)
  const [activeTab, setActiveTab] = useState<'edit' | 'customize'>('edit')
  const [hasFinished, setHasFinished] = useState(false)
  const [autoDownloadPdf, setAutoDownloadPdf] = useState(false)
  const previewRef = useRef<ResumePreviewHandle>(null)
  const scoreInfo = resumeScore(data)
  const [searchParams, setSearchParams] = useSearchParams()
  const [checkoutMessage, setCheckoutMessage] = useState<'success' | 'cancel' | null>(null)
  const showAccentPicker = TEMPLATES_WITH_COLOR_OPTIONS.has(template)
  const activeAccent = accentColor ?? DEFAULT_ACCENTS[template] ?? ACCENT_COLORS[1]

  useEffect(() => {
    const status = searchParams.get('checkout')
    if (status === 'success' || status === 'cancel') {
      setCheckoutMessage(status)
      if (status === 'success' && isAuthenticated) {
        refreshUser().catch(() => {})
      }
      setSearchParams((p) => {
        const next = new URLSearchParams(p)
        next.delete('checkout')
        next.delete('session_id')
        return next
      }, { replace: true })
      const t = setTimeout(() => setCheckoutMessage(null), 5000)
      return () => clearTimeout(t)
    }
  }, [searchParams, setSearchParams, refreshUser, isAuthenticated])

  useEffect(() => {
    if (!showAccentPicker) return
    if (accentColor) return
    setAccentColor(activeAccent)
  }, [showAccentPicker, accentColor, activeAccent, setAccentColor])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const templateParam = params.get('template')
    if (templateParam && TEMPLATE_MAP[templateParam]) {
      setTemplate(TEMPLATE_MAP[templateParam])
    }
    const accentFromUrl = params.get('accent')
    const accentFromState = (location.state as { accentColor?: string } | null)?.accentColor
    let accentFromStorage: string | undefined
    try {
      const s = sessionStorage.getItem('cvmora_builder_accent')
      if (s && /^#[0-9A-Fa-f]{6}$/.test(s)) accentFromStorage = s
      else accentFromStorage = undefined
    } catch {
      accentFromStorage = undefined
    }
    const accent = normalizeAccentHex(accentFromState ?? accentFromUrl ?? accentFromStorage)
    if (accent) {
      setAccentColor(accent)
      try {
        sessionStorage.removeItem('cvmora_builder_accent')
      } catch (_) {}
    }
  }, [location.search, location.state, setTemplate, setAccentColor])

  useEffect(() => {
    const state = location.state as { showUpload?: boolean; exampleId?: string } | null
    if (state?.showUpload && uploadInputRef.current) {
      uploadInputRef.current.click()
      navigate(location.pathname + location.search, { replace: true, state: {} })
    }
  }, [location.state, location.pathname, location.search, navigate])

  useEffect(() => {
    if (id) return
    try {
      const raw = sessionStorage.getItem(PENDING_UPLOADED_RESUME_KEY)
      if (!raw) return
      sessionStorage.removeItem(PENDING_UPLOADED_RESUME_KEY)
      const pending = JSON.parse(raw) as ResumeData
      loadData(pending)
    } catch {
      // ignore malformed session payload
    }
  }, [id, loadData])

  useEffect(() => {
    if (!id && location.state) {
      const state = location.state as { exampleId?: string }
      const exampleId = state?.exampleId
      if (exampleId && filledExamples[exampleId]) {
        loadData(filledExamples[exampleId])
        navigate(location.pathname + location.search, { replace: true, state: {} })
      }
    }
  }, [id, location.state, location.pathname, location.search, loadData, navigate])

  useEffect(() => {
    if (!id || !isAuthenticated) {
      if (id && !isAuthenticated) navigate('/login')
      setLoading(false)
      return
    }
    api<{ data: ResumeData; template_id: string }>(`/resumes/${id}`)
      .then((res) => {
        loadData(res.data)
        if (res.template_id) {
          const mapped = TEMPLATE_MAP[res.template_id]
          if (mapped) setTemplate(mapped)
          else setTemplate('professional')
        }
        if (new URLSearchParams(location.search).get('download') === 'pdf') {
          setAutoDownloadPdf(true)
        }
      })
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false))
  }, [id, isAuthenticated, loadData, setTemplate, navigate, location.search])

  useEffect(() => {
    if (!autoDownloadPdf || loading) return
    const t = setTimeout(() => {
      previewRef.current?.print()
      setAutoDownloadPdf(false)
      setSearchParams((prev) => {
        const p = new URLSearchParams(prev)
        p.delete('download')
        return p
      }, { replace: true })
    }, 600)
    return () => clearTimeout(t)
  }, [autoDownloadPdf, loading, setSearchParams])

  const dataRef = useRef(data)
  const templateRef = useRef(template)
  dataRef.current = data
  templateRef.current = template

  const saveResume = async (navigateAfterSave = false) => {
    if (!isAuthenticated) return
    const d = dataRef.current
    const tpl = templateRef.current
    setSaving(true)
    try {
      const title = displayName(d.contact) || 'My Resume'
      if (id) {
        await api(`/resumes/${id}`, { method: 'PUT', body: { title, data: d, template_id: tpl } })
      } else {
        const created = await api<{ id: number }>('/resumes', {
          method: 'POST',
          body: { title, data: d, template_id: tpl },
        })
        if (created?.id) {
          navigate(`/builder/${created.id}`, { replace: true })
        }
      }
      if (navigateAfterSave) navigate('/dashboard')
    } catch {
      // show error in UI if needed
    } finally {
      setSaving(false)
    }
  }

  const handleSave = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    saveResume(true)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError('')
    setUploading(true)
    try {
      const { text, data: parsed } = await apiUploadResume(file)
      const next = buildResumeFromUpload({ text, parsed })
      if (next) {
        loadData(next)
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-cvmora-muted text-[0.9375rem] font-medium">
        Loading resume...
      </div>
    )
  }

  const scoreColor = scoreInfo.score >= 80 ? 'bg-green-50 text-green-700' : scoreInfo.score >= 50 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'

  return (
    <div className="h-full flex flex-col min-h-0">
      <header className="flex-none flex items-center justify-between gap-3 px-4 py-2 border-b border-[#e7e5e4] bg-white shrink-0 min-h-[52px]">
        <div className="flex items-center gap-3 min-w-0">
          <a href="/" className="flex items-center gap-2 shrink-0 text-[#1c1917] no-underline">
            <span className="inline-flex [&_svg]:w-7 [&_svg]:h-7"><LogoMark /></span>
            <span className="text-sm font-semibold tracking-tight hidden sm:inline">Cvmora</span>
          </a>

          <div className="h-5 w-px bg-[#e7e5e4] hidden sm:block" />

          <div className="flex items-center bg-[#f5f5f4] rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-all ${activeTab === 'edit' ? 'bg-white text-[#1c1917] shadow-sm' : 'text-[#78716c] hover:text-[#1c1917]'}`}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('customize')}
              className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-all ${activeTab === 'customize' ? 'bg-white text-[#1c1917] shadow-sm' : 'text-[#78716c] hover:text-[#1c1917]'}`}
            >
              Customize
            </button>
          </div>

          <div className="hidden md:flex items-center gap-1.5">
            <span className={`px-2 py-0.5 rounded-md text-xs font-semibold tabular-nums ${scoreColor}`}>{scoreInfo.score}%</span>
            <span className="text-xs text-green-600 font-medium truncate max-w-[160px]">{scoreInfo.suggestion}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <label className="cursor-pointer shrink-0">
            <input ref={uploadInputRef} type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="hidden" onChange={handleUpload} disabled={uploading} />
            <span className="text-[13px] font-medium text-[#f97316] hover:text-[#ea580c] px-2 py-1.5 rounded-md hover:bg-orange-50 transition-colors cursor-pointer hidden sm:inline-flex items-center">
              {uploading ? 'Uploading...' : 'Upload PDF or Word'}
            </span>
          </label>
          {uploadError && <span className="text-[11px] text-red-600" title={uploadError}>Failed</span>}
          {isAuthenticated ? (
            <button type="button" onClick={handleSave} disabled={saving} className="min-h-[36px] px-4 py-1.5 rounded-full bg-[#BFED8D] text-[#1c1917] text-[13px] font-semibold border border-[#a8e070] hover:bg-[#b0e87d] disabled:opacity-50 transition-colors">
              {saving ? 'Saving...' : 'Save'}
            </button>
          ) : (
            <a href="/signup" className="min-h-[36px] px-4 py-1.5 rounded-full bg-[#BFED8D] text-[#1c1917] text-[13px] font-semibold border border-[#a8e070] hover:bg-[#b0e87d] inline-flex items-center transition-colors">Sign up to save</a>
          )}
          {checkoutMessage === 'success' && <span className="text-[11px] text-green-700">Payment complete!</span>}
        </div>
      </header>

      <main className="flex-1 flex min-h-0 flex-col relative">
        {hasFinished && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-10 flex flex-col items-center gap-5 animate-in fade-in zoom-in duration-200">
              <div className="w-14 h-14 rounded-full bg-[#BFED8D]/30 flex items-center justify-center mb-1">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
              <h2 className="text-xl font-bold text-[#1c1917] text-center">Your resume is ready</h2>

              {user?.subscription_status === 'active' ? (
                <>
                  <p className="text-[#78716c] text-center text-sm">Choose a format to download.</p>
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <button
                      type="button"
                      onClick={() => previewRef.current?.print()}
                      className="flex-1 px-5 py-3.5 rounded-full bg-[#BFED8D] text-[#1c1917] text-base font-semibold border border-[#a8e070] hover:bg-[#b0e87d] active:scale-[0.98] transition-all shadow-sm"
                    >
                      Download PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => previewRef.current?.downloadWord()}
                      className="flex-1 px-5 py-3.5 rounded-full border-2 border-[#f97316] text-[#f97316] text-base font-semibold hover:bg-[#fff7ed] active:scale-[0.98] transition-all"
                    >
                      Download Word
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-[#78716c] text-center text-sm">Upgrade to Pro to download your resume as PDF or Word.</p>
                  <button
                    type="button"
                    onClick={() => navigate('/pricing')}
                    className="w-full px-5 py-3.5 rounded-full bg-[#f97316] text-white text-base font-semibold hover:bg-[#ea580c] active:scale-[0.98] transition-all shadow-sm"
                  >
                    View pricing plans
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => setHasFinished(false)}
                className="text-sm text-[#78716c] hover:text-[#1c1917] underline mt-1"
              >
                Back to editing
              </button>
            </div>
          </div>
        )}

        <div
          className="flex-1 flex flex-col md:flex-row min-h-0 min-w-0 overflow-y-auto overflow-x-hidden md:overflow-hidden"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {activeTab === 'edit' ? (
            <>
              <aside className="w-full md:w-[380px] lg:w-[400px] flex-none md:flex-shrink-0 min-h-0 md:border-r border-[#e7e5e4] bg-white flex flex-col overflow-y-auto md:overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
                <div className="flex-1 min-h-0 pb-32">
                  <BuilderStepContent stepIndex={builderStep} />
                </div>
              </aside>
              <section className="flex-none min-h-[50vh] md:flex-1 md:min-h-0 min-w-0 flex flex-col bg-[#f0f0f0] border-t md:border-t-0 border-[#e7e5e4]">
                <ResumePreview ref={previewRef} showDownloadButtons={false} />
              </section>
            </>
          ) : (
            <>
              <aside className="w-full md:w-[380px] lg:w-[400px] flex-shrink-0 md:border-r border-[#e7e5e4] bg-white flex flex-col min-h-0 overflow-y-auto">
                <div className="flex-none px-5 py-4 border-b border-[#e7e5e4]">
                  <h2 className="text-sm font-semibold text-[#1c1917]">Customize</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-5 min-h-0">
                  {showAccentPicker && (
                    <div className="mb-5 rounded-xl border border-[#e7e5e4] bg-[#fafaf9] p-4">
                      <p className="text-xs font-semibold text-[#1c1917] mb-3">Accent color</p>
                      <div className="flex flex-wrap items-center gap-2.5">
                        {ACCENT_COLORS.map((c) => (
                          <button
                            key={c}
                            type="button"
                            aria-label={`Set accent ${c}`}
                            onClick={() => {
                              setAccentColor(c)
                              try {
                                sessionStorage.setItem(ACCENT_STORAGE_KEY, c)
                              } catch (_) {}
                              setSearchParams((prev) => {
                                const p = new URLSearchParams(prev)
                                p.set('accent', c)
                                return p
                              }, { replace: true })
                            }}
                            className={`w-7 h-7 rounded-full border-2 transition-all ${
                              activeAccent.toLowerCase() === c.toLowerCase()
                                ? 'border-[#1c1917] ring-2 ring-[#1c1917]/20 scale-110'
                                : 'border-[#d6d3d1] hover:border-[#a8a29e]'
                            }`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  <TemplatePicker />
                </div>
              </aside>
              <section className="flex-1 min-w-0 flex flex-col min-h-[50vh] md:min-h-0 bg-[#f0f0f0] border-t md:border-t-0 border-[#e7e5e4]">
                <ResumePreview ref={previewRef} showDownloadButtons={false} />
              </section>
            </>
          )}
        </div>
        {activeTab === 'edit' && (
          <BuilderStepFooter
            stepIndex={builderStep}
            onNext={() => setBuilderStep((s) => Math.min(BUILDER_STEPS.length - 1, s + 1))}
            onBack={() => setBuilderStep((s) => Math.max(0, s - 1))}
            onStepClick={(index) => setBuilderStep(index)}
            onFinish={() => setHasFinished(true)}
            canProceed={builderStep === 0 ? !!data.contact.email?.trim() : true}
          />
        )}
      </main>
    </div>
  )
}

function normalizeAccentHex(s: string | null | undefined): string | undefined {
  if (s == null || typeof s !== 'string') return undefined
  const trimmed = s.trim()
  const hex = trimmed.startsWith('#') ? trimmed : '#' + trimmed
  return /^#[0-9A-Fa-f]{6}$/.test(hex) ? hex : undefined
}

function parseBuilderSearch(search: string): { template?: TemplateId; accent?: string } {
  const params = new URLSearchParams(search)
  const templateParam = params.get('template')
  const accentParam = params.get('accent')
  const template = templateParam && TEMPLATE_MAP[templateParam] ? TEMPLATE_MAP[templateParam] : undefined
  const accent = normalizeAccentHex(accentParam)
  return { template, accent }
}

const ACCENT_STORAGE_KEY = 'cvmora_builder_accent'

function getStoredAccent(): string | undefined {
  try {
    const s = sessionStorage.getItem(ACCENT_STORAGE_KEY)
    if (s && /^#[0-9A-Fa-f]{6}$/.test(s)) return s
  } catch (_) {}
  return undefined
}

export function ResumeBuilder() {
  const location = useLocation()
  const { template: templateFromUrl, accent: accentFromUrl } = parseBuilderSearch(location.search)
  const accentFromState = (location.state as { accentColor?: string } | null)?.accentColor
  const accentFromStorage = getStoredAccent()
  const initialTemplate = templateFromUrl ?? 'professional'
  const initialAccentColor = normalizeAccentHex(accentFromState ?? accentFromUrl ?? accentFromStorage ?? null)

  return (
    <ResumeProvider initialTemplate={initialTemplate} initialAccentColor={initialAccentColor}>
      <ResumeBuilderInner />
    </ResumeProvider>
  )
}
