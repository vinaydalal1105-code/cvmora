import { useNavigate } from 'react-router-dom'

interface LetsGetStartedModalProps {
  open: boolean
  onClose: () => void
  templateId?: string | null
  accentColor?: string
  builderQuery?: string
  /** Ref set when card is clicked – use this so we never lose the chosen accent to stale state */
  pendingRef?: React.MutableRefObject<{ templateId: string; accentColor: string | undefined } | null>
}

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
    id: 'ai',
    label: 'Create with AI assistance',
    desc: 'Get suggestions and phrasing help',
    badge: 'New',
    icon: (
      <svg className="w-5 h-5 text-cvmora-ink/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    action: 'builder-ai',
  },
  {
    id: 'upload',
    label: 'Upload resume',
    desc: 'Import your existing PDF to edit',
    icon: (
      <svg className="w-5 h-5 text-cvmora-ink/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
    action: 'upload',
  },
  {
    id: 'linkedin',
    label: 'Create with LinkedIn profile',
    desc: 'Pull experience from your LinkedIn',
    icon: (
      <svg className="w-5 h-5 text-cvmora-ink/70" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    action: 'linkedin',
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

const ACCENT_HEX = /^#[0-9A-Fa-f]{6}$/

function buildBuilderPath(templateId: string | null | undefined, accentColor: string | undefined): string {
  if (!templateId) return '/builder'
  const base = `?template=${encodeURIComponent(templateId)}`
  const accent = accentColor && ACCENT_HEX.test(accentColor) ? `&accent=${encodeURIComponent(accentColor)}` : ''
  return `/builder${base}${accent}`
}

export function LetsGetStartedModal({ open, onClose, templateId, accentColor, builderQuery, pendingRef }: LetsGetStartedModalProps) {
  const navigate = useNavigate()

  const pending = pendingRef?.current
  const effectiveTemplateId = pending?.templateId ?? templateId ?? null
  const effectiveAccent = (pending?.accentColor && ACCENT_HEX.test(pending.accentColor) ? pending.accentColor : null) ?? (accentColor && ACCENT_HEX.test(accentColor) ? accentColor : null)

  const navState = effectiveAccent ? { accentColor: effectiveAccent } : {}
  const builderPath = buildBuilderPath(effectiveTemplateId, effectiveAccent ?? undefined)
  const builderAiPath = effectiveTemplateId
    ? `/builder?mode=ai&template=${encodeURIComponent(effectiveTemplateId)}${effectiveAccent ? `&accent=${encodeURIComponent(effectiveAccent)}` : ''}`
    : '/builder?mode=ai'

  const handleSelect = (action: string) => {
    const accentToStore = effectiveAccent ?? accentColor
    if (accentToStore && ACCENT_HEX.test(accentToStore)) {
      try {
        sessionStorage.setItem('cvmora_builder_accent', accentToStore)
      } catch (_) {}
    }
    switch (action) {
      case 'builder': {
        navigate(builderPath, { state: navState })
        break
      }
      case 'builder-ai': {
        navigate(builderAiPath, { state: navState })
        break
      }
      case 'upload':
        navigate('/builder', { state: { showUpload: true } })
        break
      case 'linkedin':
        // Coming soon - could open LinkedIn or show toast
        window.open('https://www.linkedin.com/', '_blank')
        break
      case 'examples':
        navigate('/examples')
        break
      default:
        navigate('/builder')
    }
    onClose()
  }

  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 z-[200] bg-cvmora-ink/50 backdrop-blur-sm"
        aria-hidden
        onClick={onClose}
      />
      <div
        className="fixed left-1/2 top-1/2 z-[201] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-[var(--shadow-card-hover)] border border-cvmora-ink/10 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
      >
        <div className="p-6 sm:p-8">
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
              className="p-2 rounded-lg text-cvmora-muted hover:bg-cvmora-ink/5 hover:text-cvmora-ink transition-colors"
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
                  className="w-full flex items-center gap-4 p-4 rounded-xl text-left hover:bg-cvmora-ink/5 active:bg-cvmora-ink/10 transition-colors group"
                >
                  <span className="w-10 h-10 rounded-xl bg-cvmora-ink/5 flex items-center justify-center shrink-0 group-hover:bg-[var(--color-primary)]/10 transition-colors">
                    {opt.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-cvmora-ink text-[0.9375rem] flex items-center gap-2">
                      {opt.label}
                      {opt.badge && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-violet-100 text-violet-700">
                          {opt.badge}
                        </span>
                      )}
                    </span>
                    <p className="text-[0.8125rem] text-cvmora-muted mt-0.5">{opt.desc}</p>
                  </div>
                  <span className="text-cvmora-muted shrink-0 group-hover:text-[var(--color-primary)] transition-colors" aria-hidden>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
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
