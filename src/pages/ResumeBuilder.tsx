import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ResumeProvider, useResume } from '../context/ResumeContext'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/client'
import { apiUploadResume } from '../api/client'
import { ResumePreview, type ResumePreviewHandle } from '../components/ResumePreview'
import { TemplatePicker } from '../components/TemplatePicker'
import {
  BUILDER_STEPS,
  resumeScore,
  BuilderStepContent,
  BuilderStepFooter,
} from '../components/BuilderSteps'
import type { ResumeData } from '../types/resume'
import { defaultResume } from '../data/defaultResume'
import { filledExamples } from '../data/filledExamples'

import type { TemplateId } from '../types/resume'

const TEMPLATE_MAP: Record<string, TemplateId> = {
  classic: 'classic',
  traditional: 'traditional',
  professional: 'professional',
  corporate: 'professional',
  modern: 'modern',
  'simple-ats': 'clean',
  'precision-ats': 'clean', // removed duplicate; old links open Simple ATS
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
}

function ResumeBuilderInner() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const { data, template, loadData, setTemplate, setAccentColor } = useResume()
  const [loading, setLoading] = useState(!!id && isAuthenticated)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const uploadInputRef = useRef<HTMLInputElement>(null)
  const [builderStep, setBuilderStep] = useState(0)
  const [activeTab, setActiveTab] = useState<'edit' | 'customize'>('edit')
  const [hasFinished, setHasFinished] = useState(false)
  const previewRef = useRef<ResumePreviewHandle>(null)
  const scoreInfo = resumeScore(data)

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
      })
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false))
  }, [id, isAuthenticated, loadData, setTemplate, navigate])

  const handleSave = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setSaving(true)
    try {
      if (id) {
        await api(`/resumes/${id}`, { method: 'PUT', body: { data, template_id: template } })
      } else {
        const created = await api<{ id: number }>('/resumes', {
          method: 'POST',
          body: { title: data.contact.fullName || 'My Resume', data, template_id: template },
        })
        navigate(`/builder/${created.id}`, { replace: true })
      }
    } catch {
      // show error in UI if needed
    } finally {
      setSaving(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError('')
    setUploading(true)
    try {
      const { text } = await apiUploadResume(file)
      if (text) loadData({ ...defaultResume, summary: text.slice(0, 2000) })
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
        Loading resume…
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Single minimal bar: logo, template, Edit|Customize, score, actions */}
      <header className="flex-none flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 py-2.5 border-b border-cvmora-ink/8 bg-white shrink-0 min-h-[52px]">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1 overflow-hidden">
          <a href="/" className="flex items-center gap-2 shrink-0 text-cvmora-ink no-underline min-h-[44px] items-center">
            <span className="w-8 h-8 rounded-xl bg-[#f97316] flex items-center justify-center text-white font-semibold text-sm">C</span>
            <span className="text-base font-semibold tracking-tight hidden sm:inline">Cvmora</span>
          </a>
          <div className="flex items-center gap-0.5 border-l border-cvmora-ink/10 pl-2 sm:pl-4 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`min-h-[40px] px-3 py-2 rounded-md text-[0.8125rem] font-medium transition-colors ${activeTab === 'edit' ? 'bg-cvmora-ink/10 text-cvmora-ink' : 'text-cvmora-ink/60 hover:bg-cvmora-ink/5'}`}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('customize')}
              className={`min-h-[40px] px-3 py-2 rounded-md text-[0.8125rem] font-medium transition-colors ${activeTab === 'customize' ? 'bg-cvmora-ink/10 text-cvmora-ink' : 'text-cvmora-ink/60 hover:bg-cvmora-ink/5'}`}
            >
              Customize
            </button>
          </div>
          {/* Score/suggestion: only on md+ to avoid cramped overlap on mobile */}
          <div className="hidden md:flex items-center gap-2 text-[0.75rem] shrink-0 overflow-hidden">
            <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 font-medium whitespace-nowrap">{scoreInfo.score}%</span>
            <span className="text-green-700 font-medium truncate max-w-[120px] lg:max-w-[140px]" title={scoreInfo.suggestion}>{scoreInfo.suggestion}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <label className="cursor-pointer flex items-center min-h-[44px]">
            <input ref={uploadInputRef} type="file" accept=".pdf" className="hidden" onChange={handleUpload} disabled={uploading} />
            <span className="text-[14px] sm:text-[16px] font-medium text-[#f97316] hover:opacity-80 px-2.5 py-2 rounded-md hover:bg-black/5 active:bg-black/10">{uploading ? '…' : 'Upload PDF'}</span>
          </label>
          {uploadError && <span className="text-[0.6875rem] text-red-600" title={uploadError}>Failed</span>}
          {isAuthenticated ? (
            <button type="button" onClick={handleSave} disabled={saving} className="min-h-[44px] px-4 py-2 rounded-full bg-[#BFED8D] text-[#1c1917] text-[14px] sm:text-[16px] font-medium border border-[#a8e070] hover:bg-[#b0e87d] disabled:opacity-50 flex items-center">
              {saving ? '…' : 'Save'}
            </button>
          ) : (
            <a href="/signup" className="min-h-[44px] px-4 py-2 rounded-full bg-[#BFED8D] text-[#1c1917] text-[14px] sm:text-[16px] font-medium border border-[#a8e070] hover:bg-[#b0e87d] inline-flex items-center">Sign up to save</a>
          )}
        </div>
      </header>

      <main className="flex-1 flex min-h-0 flex-col relative">
        {hasFinished && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 flex flex-col items-center gap-6">
              <h2 className="text-xl font-bold text-[#1c1917] text-center">Your resume is ready</h2>
              <p className="text-[#78716c] text-center text-sm">Choose a format to download.</p>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  type="button"
                  onClick={() => previewRef.current?.print()}
                  className="flex-1 px-5 py-3 rounded-full bg-[#BFED8D] text-[#1c1917] text-base font-medium border border-[#a8e070] hover:bg-[#b0e87d] transition-colors"
                >
                  Download PDF
                </button>
                <button
                  type="button"
                  onClick={() => previewRef.current?.downloadWord()}
                  className="flex-1 px-5 py-3 rounded-full border-2 border-[#f97316] text-[#f97316] text-base font-medium hover:bg-[#fff7ed] transition-colors"
                >
                  Download Word
                </button>
              </div>
              <button
                type="button"
                onClick={() => setHasFinished(false)}
                className="text-sm text-[#78716c] hover:text-[#1c1917] underline"
              >
                Back to editing
              </button>
            </div>
          </div>
        )}
        {/* On mobile: stack editor above preview. On md+: side by side */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 min-w-0 overflow-hidden">
          {activeTab === 'edit' ? (
            <>
              <aside className="w-full md:max-w-[420px] flex-none md:border-r border-cvmora-ink/8 bg-white flex flex-col min-h-0 overflow-y-auto md:overflow-y-auto">
                <div className="flex-1 min-h-0 pb-24">
                  <BuilderStepContent stepIndex={builderStep} />
                </div>
              </aside>
              <section className="flex-1 min-w-0 flex flex-col min-h-[50vh] md:min-h-0 bg-[#f5f5f7] border-t md:border-t-0 border-cvmora-ink/8">
                <ResumePreview ref={previewRef} showDownloadButtons={false} />
              </section>
            </>
          ) : (
            <>
              <aside className="w-full md:max-w-[360px] flex-none md:border-r border-cvmora-ink/8 bg-white flex flex-col min-h-0 overflow-y-auto">
                <div className="flex-none px-4 py-3 border-b border-cvmora-ink/6">
                  <h2 className="text-[0.8125rem] font-semibold text-cvmora-ink">Customize</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 min-h-0">
                  <TemplatePicker />
                </div>
              </aside>
              <section className="flex-1 min-w-0 flex flex-col min-h-[50vh] md:min-h-0 bg-[#f5f5f7] border-t md:border-t-0 border-cvmora-ink/8">
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
