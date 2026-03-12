import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiUploadResume } from '../api/client'
import { buildResumeFromUpload, PENDING_UPLOADED_RESUME_KEY } from '../utils/uploadedResume'

interface LetsGetStartedModalProps {
  open: boolean
  onClose: () => void
  templateId?: string | null
  accentColor?: string
  builderQuery?: string
  /** Ref set when card is clicked – use this so we never lose the chosen accent to stale state */
  pendingRef?: React.MutableRefObject<{ templateId: string; accentColor: string | undefined } | null>
}

const ACCENT_HEX = /^#[0-9A-Fa-f]{6}$/

function buildBuilderPath(templateId: string | null | undefined, accentColor: string | undefined): string {
  if (!templateId) return '/builder'
  const base = `?template=${encodeURIComponent(templateId)}`
  const accent = accentColor && ACCENT_HEX.test(accentColor) ? `&accent=${encodeURIComponent(accentColor)}` : ''
  return `/builder${base}${accent}`
}

export function LetsGetStartedModal({ open, onClose, templateId, accentColor, builderQuery: _builderQuery, pendingRef }: LetsGetStartedModalProps) {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const pending = pendingRef?.current
  const effectiveTemplateId = pending?.templateId ?? templateId ?? null
  const effectiveAccent = (pending?.accentColor && ACCENT_HEX.test(pending.accentColor) ? pending.accentColor : null) ?? (accentColor && ACCENT_HEX.test(accentColor) ? accentColor : null)

  const navState = effectiveAccent ? { accentColor: effectiveAccent } : {}
  const builderPath = buildBuilderPath(effectiveTemplateId, effectiveAccent ?? undefined)

  const storeAccent = () => {
    const accentToStore = effectiveAccent ?? accentColor
    if (accentToStore && ACCENT_HEX.test(accentToStore)) {
      try { sessionStorage.setItem('cvmora_builder_accent', accentToStore) } catch (_) {}
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError('')
    setUploading(true)
    try {
      const { text, data: parsed } = await apiUploadResume(file)
      const next = buildResumeFromUpload({ text, parsed })
      if (!next) throw new Error('Could not read resume content from that file.')
      sessionStorage.setItem(PENDING_UPLOADED_RESUME_KEY, JSON.stringify(next))
      storeAccent()
      navigate(builderPath, { state: navState })
      onClose()
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleSelect = (action: string) => {
    storeAccent()
    switch (action) {
      case 'builder':
        navigate(builderPath, { state: navState })
        onClose()
        break
      case 'upload':
        fileInputRef.current?.click()
        break
      case 'examples':
        navigate('/examples')
        onClose()
        break
      default:
        navigate('/builder')
        onClose()
    }
  }

  if (!open) return null

  const options = [
    {
      id: 'new',
      label: 'Create new resume',
      desc: 'Start from scratch with your chosen template',
      icon: (
        <svg className="w-5 h-5 text-cvmora-ink/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      action: 'builder',
    },
    {
      id: 'upload',
      label: uploading ? 'Uploading…' : 'Upload resume',
      desc: uploadError || 'Import your existing PDF or Word — we\'ll pull your info into the right sections',
      icon: (
        <svg className="w-5 h-5 text-cvmora-ink/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      action: 'upload',
    },
    {
      id: 'example',
      label: 'Create from example',
      desc: 'Start from an industry example',
      icon: (
        <svg className="w-5 h-5 text-cvmora-ink/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      action: 'examples',
    },
  ]

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />
      <div
        className="fixed inset-0 z-[200] bg-cvmora-ink/50 backdrop-blur-sm"
        aria-hidden
        onClick={uploading ? undefined : onClose}
      />
      <div
        className="fixed left-1/2 top-1/2 z-[201] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-[var(--shadow-card-hover)] border border-cvmora-ink/10 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
      >
        <div className="p-5 sm:p-8">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h2 id="modal-title" className="text-xl font-bold text-cvmora-ink tracking-tight">
                Let's get started
              </h2>
              <p id="modal-desc" className="text-[0.9375rem] text-cvmora-muted mt-1">
                How do you want to create your resume?
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="min-w-[44px] min-h-[44px] p-2 rounded-lg text-cvmora-muted hover:bg-cvmora-ink/5 hover:text-cvmora-ink active:bg-cvmora-ink/10 transition-colors flex items-center justify-center"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <ul className="mt-6 space-y-1">
            {options.map((opt) => (
              <li key={opt.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(opt.action)}
                  disabled={uploading}
                  className="w-full flex items-center gap-4 p-4 min-h-[60px] sm:min-h-0 rounded-xl text-left hover:bg-cvmora-ink/5 active:bg-cvmora-ink/10 transition-colors group disabled:opacity-60 disabled:pointer-events-none"
                >
                  <span className="w-10 h-10 rounded-xl bg-cvmora-ink/5 flex items-center justify-center shrink-0 group-hover:bg-[var(--color-primary)]/10 transition-colors">
                    {opt.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-cvmora-ink text-[0.9375rem] flex items-center gap-2">
                      {opt.label}
                    </span>
                    <p className={`text-[0.8125rem] mt-0.5 ${opt.id === 'upload' && uploadError ? 'text-red-600' : 'text-cvmora-muted'}`}>{opt.desc}</p>
                  </div>
                  <span className="text-cvmora-muted shrink-0 group-hover:text-[var(--color-primary)] transition-colors" aria-hidden>
                    {opt.id === 'upload' && uploading ? (
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
