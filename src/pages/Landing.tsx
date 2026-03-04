import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { TemplateCard } from '../components/TemplateCard'
import { allTemplates } from '../data/templates'

/* Target count for "resumes created today": ~3.5k at midnight → ~28k by end of day, resets daily */
function getResumeCountForTimeOfDay(): number {
  const now = new Date()
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)
  const msIntoDay = now.getTime() - start.getTime()
  const progress = msIntoDay / (24 * 60 * 60 * 1000)
  const minCount = 3500
  const maxCount = 28500
  return Math.round(minCount + progress * (maxCount - minCount))
}

/* Smooth ease-out for roll-up (gentle deceleration at the end) */
function easeOutQuart(t: number): number {
  return 1 - (1 - t) ** 4
}

/* Get digits of a number (left to right, e.g. 22301 -> [2,2,3,0,1]) */
function getDigits(n: number): number[] {
  const d: number[] = []
  let x = Math.max(0, Math.floor(n))
  do {
    d.unshift(x % 10)
    x = Math.floor(x / 10)
  } while (x > 0)
  if (d.length === 0) d.push(0)
  return d
}

const ODOMETER_DIGITS = 5

function padDigits(digits: number[], len: number): number[] {
  if (digits.length >= len) return digits.slice(-len)
  return [...Array(len - digits.length).fill(0), ...digits]
}

/* Next value when moving current toward target by changing only the rightmost differing digit. */
function nextStepOneDigit(current: number, target: number): number {
  const c = getDigits(current)
  const t = getDigits(target)
  const maxLen = Math.max(c.length, t.length)
  while (c.length < maxLen) c.unshift(0)
  while (t.length < maxLen) t.unshift(0)
  for (let i = maxLen - 1; i >= 0; i--) {
    if (c[i] !== t[i]) {
      const next = c.slice()
      next[i] = t[i]
      return next.reduce((n, d) => n * 10 + d, 0)
    }
  }
  return current
}

const DIGIT_TRANSITION_MS = 380
const INITIAL_ROLL_DURATION_MS = 2600

/* Returns 5 digit values (0–9, can be fractional for smooth roll). Initial: all 0, then each digit rolls left-to-right one by one. */
function useResumeCountDigits(): number[] {
  const targetAtStart = getResumeCountForTimeOfDay()
  const targetPadded = padDigits(getDigits(targetAtStart), ODOMETER_DIGITS)
  const [digitValues, setDigitValues] = useState<number[]>(() => Array(ODOMETER_DIGITS).fill(0))
  const hasRolledRef = useRef(false)
  const displayRef = useRef(0)
  const lastStepAtRef = useRef(0)
  const initialTargetRef = useRef(targetAtStart)
  useEffect(() => {
    initialTargetRef.current = targetAtStart
    const startTime = performance.now()
    let rafId: number
    const runFrame = (now: number) => {
      const elapsed = now - startTime
      if (!hasRolledRef.current) {
        const progress = Math.min(1, elapsed / INITIAL_ROLL_DURATION_MS)
        const next: number[] = []
        for (let i = 0; i < ODOMETER_DIGITS; i++) {
          const segmentStart = i / ODOMETER_DIGITS
          const segmentEnd = (i + 1) / ODOMETER_DIGITS
          if (progress <= segmentStart) next.push(0)
          else if (progress >= segmentEnd) next.push(targetPadded[i])
          else {
            const t = (progress - segmentStart) / (1 / ODOMETER_DIGITS)
            next.push(easeOutQuart(t) * targetPadded[i])
          }
        }
        setDigitValues(next)
        if (progress >= 1) {
          hasRolledRef.current = true
          displayRef.current = targetAtStart
          lastStepAtRef.current = now
        }
      } else {
        const target = getResumeCountForTimeOfDay()
        const current = displayRef.current
        if (target > current && now - lastStepAtRef.current >= DIGIT_TRANSITION_MS) {
          const nextVal = nextStepOneDigit(current, target)
          if (nextVal !== current) {
            displayRef.current = nextVal
            lastStepAtRef.current = now
            setDigitValues(padDigits(getDigits(nextVal), ODOMETER_DIGITS))
          }
        }
      }
      rafId = requestAnimationFrame(runFrame)
    }
    rafId = requestAnimationFrame(runFrame)
    return () => cancelAnimationFrame(rafId)
  }, [])
  return digitValues
}

/* Odometer: 5 columns, each rolls 0–9. digitValues can be fractional for smooth animation. */
function OdometerDisplay({ digitValues, className = '' }: { digitValues: number[]; className?: string }) {
  const [transitionReady, setTransitionReady] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setTransitionReady(true))
    })
    return () => cancelAnimationFrame(id)
  }, [])
  const values =
    digitValues.length >= ODOMETER_DIGITS ? digitValues.slice(0, ODOMETER_DIGITS) : padDigits(getDigits(0), ODOMETER_DIGITS)
  const commaAfter = 1

  return (
    <span className={`inline-flex items-center tabular-nums ${className}`} style={{ lineHeight: 1, letterSpacing: '0.02em' }}>
      {values.map((d, i) => (
        <span key={i} className="inline-flex shrink-0" style={{ isolation: 'isolate' }}>
          <span
            className="inline-block overflow-hidden align-middle text-center"
            style={{ height: '1em', width: '0.65em', minWidth: '0.65em', lineHeight: 1 }}
          >
            <span
              className="block"
              style={{
                transform: `translateZ(0) translateY(-${d}em)`,
                lineHeight: 1,
                backfaceVisibility: 'hidden' as const,
                ...(transitionReady ? { transition: 'transform 0.45s cubic-bezier(0.25, 0.1, 0.25, 1)' } : {}),
              }}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <span
                  key={n}
                  className="flex items-center justify-center shrink-0"
                  style={{ height: '1em', width: '100%', lineHeight: 1, boxSizing: 'border-box' }}
                >
                  {n}
                </span>
              ))}
            </span>
          </span>
          {i === commaAfter && <span className="inline-block mx-0.5" style={{ width: '0.15em' }}>,</span>}
        </span>
      ))}
    </span>
  )
}

/* Resume.io-style: cloud icon (light blue, “live” meter) */
function ResumesCreatedIcon() {
  return (
    <span className="inline-flex shrink-0 text-[#38bdf8]" aria-hidden title="Live count">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="sm:w-10 sm:h-10">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      </svg>
    </span>
  )
}

/* Base44-style: section becomes visible when it enters viewport */
function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold, rootMargin: '0px 0px -80px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])
  return { ref, visible }
}

const HERO_TEMPLATE_IDS = ['professional', 'modern', 'minimal', 'simple-ats', 'balanced', 'elegant'] as const

function HeroResumeCarousel() {
  const [index, setIndex] = useState(0)
  const templateId = HERO_TEMPLATE_IDS[index % HERO_TEMPLATE_IDS.length]
  const template = allTemplates.find((t) => t.id === templateId) ?? allTemplates[0]
  const next = useCallback(
    () => setIndex((i) => (i + 1) % HERO_TEMPLATE_IDS.length),
    []
  )

  useEffect(() => {
    const id = setInterval(next, 4500)
    return () => clearInterval(id)
  }, [next])

  return (
    <div
      className="relative w-full max-w-[420px] mx-auto sm:max-w-[480px] overflow-hidden flex items-center justify-center"
      style={{ minHeight: '520px' }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={template.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.6, ease: [0.33, 0, 0.2, 1] }}
          className="absolute inset-0 flex items-center justify-center w-full"
        >
          <div
            className="w-full flex justify-center"
            style={{ transform: 'scale(0.95)', transformOrigin: 'center center' }}
          >
            <TemplateCard template={template} variant="hero" />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

const features = [
  {
    title: 'Resume Builder',
    desc: 'Build the resume that gets you hired. Live preview, recruiter-approved templates, finish a draft in minutes.',
    to: '/builder',
    tag: null,
    tint: 'from-transparent to-transparent',
    border: 'border-cvmora-ink/8',
  },
  {
    title: 'Cover Letters',
    desc: 'Write matching cover letters in minutes. Paste the job, tailor your pitch, download as PDF or Word.',
    to: '/cover-letter',
    tag: 'Useful',
    tint: 'from-cvmora-accent/8 to-transparent',
    border: 'border-cvmora-accent/15',
  },
  {
    title: 'Job Board',
    desc: 'See remote jobs in one place. Search by category and apply with your Cvmora resume.',
    to: '/jobs',
    tag: null,
    tint: 'from-transparent to-transparent',
    border: 'border-cvmora-ink/8',
  },
  {
    title: 'Interview Prep',
    desc: 'Practice the questions that get you hired. By category, with space to draft your answers.',
    to: '/interview',
    tag: null,
    tint: 'from-transparent to-transparent',
    border: 'border-cvmora-ink/8',
  },
  {
    title: 'Salary Analyzer',
    desc: 'Check if your offer is at market rate. Links to trusted tools so you negotiate with confidence.',
    to: '/salary',
    tag: null,
    tint: 'from-transparent to-transparent',
    border: 'border-cvmora-ink/8',
  },
  {
    title: 'Resources',
    desc: 'Expert guides on resumes, cover letters, and career advice. Field-tested tips.',
    to: '/resources',
    tag: 'Guides',
    tint: 'from-cvmora-accent/8 to-transparent',
    border: 'border-cvmora-accent/15',
  },
]

const testimonials = [
  { quote: 'Very intuitive and easy to use. Makes the CV/resume building simple to do.', name: 'Benjamin P.', rating: 5 },
  { quote: 'Really helpful at creating my Resume so it is ATS compatible and creating a job-specific cover letter.', name: 'Mel S.', rating: 5 },
  { quote: 'I can easily use it to generate a simple yet professional CV.', name: 'Carol', rating: 5 },
]

/* Base44-style feature sections: step indicator, heading, description, CTA, and right-side card */
const featureSteps = [
  {
    step: '01',
    total: '04',
    title: 'Your goal → a recruiter-ready resume, in minutes',
    desc: 'Other builders make you click through dozens of fields. Tell Cvmora what you’re applying for and get a structured draft with the right sections and wording—no guessing what to include or how to phrase it.',
    cta: 'Start building',
    to: '/builder',
  },
  {
    step: '02',
    total: '04',
    title: 'Templates that actually get past ATS',
    desc: 'Many free templates break in applicant tracking systems, so recruiters never see your full resume. Every Cvmora layout is tested to parse correctly so your content looks right and you stand out.',
    cta: 'Browse templates',
    to: '/templates',
  },
  {
    step: '03',
    total: '04',
    title: 'Download in one click. No paywall.',
    desc: 'Try the full builder without signing up. Export to PDF or Word with no watermarks or “upgrade to download” prompts. Create an account only when you want to save versions and switch between them.',
    cta: 'Start building',
    to: '/builder',
  },
  {
    step: '04',
    total: '04',
    title: 'One builder for every stage of your career',
    desc: 'First job or next promotion, tech or teaching—use the same Cvmora builder for resumes and cover letters. No switching tools or reformatting when you change direction.',
    cta: 'Start building',
    to: '/builder',
  },
]

function FeatureSection({
  step,
  total,
  title,
  desc,
  cta,
  to,
  children,
}: {
  step: string
  total: string
  title: string
  desc: string
  cta: string
  to: string
  children: React.ReactNode
}) {
  const { ref, visible } = useScrollReveal(0.12)
  return (
    <section
      ref={ref}
      className={`min-h-[70vh] sm:min-h-[75vh] flex items-center py-12 sm:py-16 px-4 sm:px-6 transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-[1400px] mx-auto w-full">
        <div className="max-w-[1100px] mx-auto rounded-[1.25rem] lg:rounded-[1.5rem] bg-white/95 shadow-[0_8px_40px_rgba(0,0,0,0.08),0_2px_12px_rgba(0,0,0,0.04)] border border-[#e5e7eb]/80 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center p-5 sm:p-6 lg:p-8">
            <div className="lg:col-span-5 flex flex-col justify-center min-w-0">
              <p className="text-[#78716c] text-sm sm:text-base font-medium mb-2">
                {step} <span className="text-[#1c1917]/50">/</span> {total}
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-bold text-[#1c1917] tracking-tight leading-tight mb-4">
                {title}
              </h2>
              <p className="text-lg sm:text-[1.125rem] text-[#44403c] leading-relaxed mb-6" style={{ lineHeight: 1.6 }}>
                {desc}
              </p>
              <Link
                to={to}
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-[#1c1917] text-white text-base font-medium hover:bg-[#44403c] transition-colors w-fit shadow-sm"
              >
                {cta}
              </Link>
            </div>
            <div className="lg:col-span-7 flex justify-center lg:justify-end items-center">
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* Wrapper: cards stacked one on top of the other (Base44-style overlap) */
function StackedCards({ children }: { children: React.ReactNode }) {
  const cards = Array.isArray(children) ? children : [children]
  return (
    <div className="relative w-full max-w-[420px] min-h-[260px] sm:min-h-[280px] mx-auto lg:mx-0">
      {/* Soft gradient behind stack (Base44-style) */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-100/40 via-rose-50/30 to-amber-100/40 -z-10" aria-hidden />
      {cards.map((child, i) => (
        <div
          key={i}
          className="absolute transition-all duration-700 ease-out"
          style={{
            zIndex: cards.length - i,
            left: i * 28,
            top: i * 24,
            transform: `translateY(${i * 12}px)`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

/* Card 1: Resume preview — shows output quality and why it matters */
function CardResumePreview() {
  return (
    <div className="w-full max-w-[400px] rounded-2xl overflow-hidden shadow-[0_24px_48px_rgba(0,0,0,0.12)] border border-white/20">
      <div
        className="h-2 w-full"
        style={{
          background: 'linear-gradient(90deg, #fbbf24 0%, #fbb52c 18%, #f59e0b 35%, #f97316 50%, #f87171 70%, #fb7185 85%, #f43f5e 100%)',
        }}
      />
      <div className="bg-white p-5 sm:p-6">
        <p className="text-xs font-semibold text-[#78716c] uppercase tracking-wider mb-3">Recruiter-ready output</p>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#fff7ed] to-[#ffedd5] flex items-center justify-center text-[#ea580c] font-bold text-lg border border-orange-200/50">A</div>
          <div>
            <p className="font-semibold text-[#1c1917] text-base">Alice Hart</p>
            <p className="text-sm text-[#78716c]">Math Teacher</p>
          </div>
        </div>
        <p className="text-sm text-[#44403c] leading-relaxed mb-4" style={{ lineHeight: 1.55 }}>
          Summary, experience, and skills in the right order—no reformatting or missing sections.
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="px-2.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200/60">ATS Ready</span>
          <span className="px-2.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200/60">Professional</span>
        </div>
      </div>
    </div>
  )
}

/* Card 2: Builder output — shows speed and structure, not endless forms */
function CardBuilderOutput() {
  const items = [
    'Added Experience section',
    'Added Education',
    'Added Skills',
    'Added Summary',
    'Formatted for ATS',
  ]
  return (
    <div className="w-full max-w-[400px] rounded-2xl overflow-hidden shadow-[0_24px_48px_rgba(0,0,0,0.12)] border border-white/20">
      <div
        className="h-3 w-full"
        style={{
          background: 'linear-gradient(90deg, #fcd34d 0%, #fbbf24 20%, #f59e0b 40%, #f97316 60%, #fb923c 75%, #fb7185 90%, #f43f5e 100%)',
        }}
      />
      <div className="bg-gradient-to-b from-white to-rose-50/30 p-5 sm:p-6 border-t border-orange-100/50">
        <p className="text-xs font-semibold text-[#78716c] uppercase tracking-wider mb-2">Built in seconds, not hours</p>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-8 h-8 rounded-lg bg-[#f97316] flex items-center justify-center text-white text-sm font-bold shadow-sm">C</span>
          <span className="font-semibold text-[#1c1917] text-base">Cvmora</span>
        </div>
        <p className="text-sm text-[#44403c] mt-2 mb-4" style={{ lineHeight: 1.55 }}>
          One goal → full structure. No clicking through 20 screens.
        </p>
        <div className="space-y-2">
          {items.map((label, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-[#1c1917]">
              <span className="w-5 h-5 rounded flex items-center justify-center bg-amber-100 text-amber-700 text-[10px] font-bold">✓</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* Card 3: Export — no paywall, no watermarks */
function CardExportOptions() {
  return (
    <div className="w-full max-w-[360px] rounded-2xl overflow-hidden shadow-[0_24px_48px_rgba(0,0,0,0.12)] border border-white/20">
      <div
        className="h-2 w-full"
        style={{
          background: 'linear-gradient(90deg, #c4b5fd 0%, #a78bfa 25%, #d946ef 50%, #ec4899 75%, #f472b6 100%)',
        }}
      />
      <div className="bg-white p-5 sm:p-6">
        <p className="text-xs font-semibold text-[#78716c] uppercase tracking-wider mb-2">No paywall · No watermarks</p>
        <p className="font-semibold text-[#1c1917] text-base mb-4">Download your resume</p>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50/50 border border-slate-200/80">
            <span className="text-base font-medium text-[#1c1917]">PDF</span>
            <span className="text-sm text-[#78716c]">Print-ready</span>
          </div>
          <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-gradient-to-r from-slate-50 to-indigo-50/50 border border-slate-200/80">
            <span className="text-base font-medium text-[#1c1917]">Word (.docx)</span>
            <span className="text-sm text-[#78716c]">Editable</span>
          </div>
        </div>
        <p className="text-sm font-medium text-emerald-700 mt-4">One click. No watermarks. No paywall.</p>
      </div>
    </div>
  )
}

/* Card 4: Template picker — every layout recruiter- and ATS-tested */
function CardTemplatePicker() {
  const options = ['Professional', 'Modern', 'Minimal']
  return (
    <div className="w-full max-w-[360px] rounded-2xl overflow-hidden shadow-[0_24px_48px_rgba(0,0,0,0.12)] border border-white/20">
      <div
        className="h-2 w-full"
        style={{
          background: 'linear-gradient(90deg, #a5b4fc 0%, #818cf8 30%, #c084fc 50%, #f97316 70%, #fbbf24 100%)',
        }}
      />
      <div className="bg-white p-5 sm:p-6">
        <p className="text-xs font-semibold text-[#78716c] uppercase tracking-wider mb-2">Every layout ATS- & recruiter-tested</p>
        <p className="font-semibold text-[#1c1917] text-base mb-4">Choose a template</p>
        <div className="space-y-0 divide-y divide-[#e7e5e4]">
          {options.map((name, i) => (
            <div key={name} className="flex items-center justify-between py-4 first:pt-0">
              <div className="flex items-center gap-3">
                {i === 0 && <span className="w-5 h-5 rounded-full bg-[#f97316] flex items-center justify-center text-white text-[10px] font-bold">✓</span>}
                {i !== 0 && <span className="w-5 h-5 rounded-full border-2 border-[#e7e5e4]" />}
                <span className="text-base font-medium text-[#1c1917]">{name}</span>
              </div>
              <span className="text-sm text-emerald-600 font-medium">ATS-friendly</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* Back card: dark Kanban-style (peeks behind section 1) */
function _CardKanbanPeek() {
  const cols = [
    { label: 'Experience', color: 'bg-amber-400' },
    { label: 'Education', color: 'bg-orange-400' },
    { label: 'Skills', color: 'bg-sky-400' },
    { label: 'Summary', color: 'bg-violet-400' },
  ]
  return (
    <div className="w-full max-w-[380px] rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.15)] border border-slate-700/50 bg-slate-800">
      <div className="p-3 border-b border-slate-600/80">
        <p className="text-xs font-semibold text-white/90">Resume sections</p>
        <p className="text-[10px] text-slate-400">All sections · ATS-ready</p>
      </div>
      <div className="flex gap-1 p-2">
        {cols.map((c, i) => (
          <div key={i} className={`flex-1 rounded-lg ${c.color} py-2 px-1.5 text-center`}>
            <p className="text-[9px] font-bold text-white/95 truncate">{c.label}</p>
          </div>
        ))}
      </div>
      <div className="p-2 space-y-1.5">
        {['Contact details', 'Work history', 'Skills list'].map((t, i) => (
          <div key={i} className="rounded-lg bg-slate-700/80 px-2 py-1.5">
            <p className="text-[10px] text-white/90">{t}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* Back card: gradient strip only (peeks behind) */
function _CardGradientPeek() {
  return (
    <div className="w-full max-w-[340px] rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-white/30">
      <div className="h-24 bg-gradient-to-br from-rose-200 via-amber-100 to-violet-200" />
      <div className="bg-white/95 p-4">
        <p className="text-xs font-medium text-[#1c1917]">Consider yourself limitless</p>
        <p className="text-[10px] text-[#78716c] mt-0.5">Build your resume in minutes.</p>
      </div>
    </div>
  )
}

const suggestionChips = [
  { label: 'Resume from scratch', to: '/builder' },
  { label: 'ATS-friendly template', to: '/templates/ats' },
  { label: 'Cover letter', to: '/cover-letter' },
]

function ToolsSection() {
  return (
    <section
      className="py-20 sm:py-28 px-4 sm:px-6"
      style={{ background: 'linear-gradient(180deg, #ffffff 0%, #fefefe 30%, #ffffff 70%, #ffffff 100%)' }}
    >
      <div className="max-w-[1400px] mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#1c1917] text-center mb-6 tracking-tight">
          Every tool you need is here...
        </h2>
        <p className="text-[#78716c] text-center text-xl max-w-xl mx-auto mb-14 leading-relaxed" style={{ lineHeight: 1.6 }}>
          From building your resume to landing the offer.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {features.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="surface-card group flex flex-col justify-center p-5 sm:p-6 rounded-2xl bg-white border border-[#e7e5e4] hover:border-[#f97316]/30 min-h-[200px]"
            >
              {item.tag && (
                <span className="inline-block px-3 py-1 rounded-lg bg-[#fff7ed] text-[#f97316] text-[11px] font-semibold uppercase tracking-wider mb-3">
                  {item.tag}
                </span>
              )}
              <h3 className="font-semibold text-[#1c1917] text-xl mb-2 group-hover:text-[#f97316] transition-colors duration-200">
                {item.title}
              </h3>
              <p className="text-base text-[#44403c] leading-relaxed mb-2" style={{ lineHeight: 1.55 }}>{item.desc}</p>
              <span className="inline-flex items-center gap-1.5 text-base font-semibold text-[#f97316] group-hover:gap-2.5 transition-all duration-200 shrink-0">
                Get started
                <span aria-hidden>→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Landing() {
  const resumeCountDigits = useResumeCountDigits()
  return (
    <div className="overflow-hidden">
      {/* Hero — smooth transition: warm orange/beige at top → light blue at bottom */}
      <section
        className="relative pt-16 sm:pt-20 pb-24 sm:pb-32 px-4 sm:px-6 min-h-[85vh] flex items-center"
        style={{
          background: 'linear-gradient(180deg, #fef7f0 0%, #ffedd5 12%, #ffe4c4 25%, #f5e6dc 40%, #e8f0f4 55%, #dceef5 70%, #d4ebf7 85%, #e0f2fe 100%)',
        }}
      >
        <div className="max-w-[1100px] mx-auto relative w-full flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="flex-1 text-center lg:text-left max-w-xl mx-auto lg:mx-0">
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] tracking-tight mb-6 text-[#1c1917]">
              This resume builder gets you{' '}
              <span className="text-[#f97316]">hired faster</span>
            </h1>
            <p className="text-xl sm:text-2xl text-[#78716c] leading-relaxed mb-10 max-w-md mx-auto lg:mx-0" style={{ lineHeight: 1.6 }}>
              Only 2% of resumes win. Yours will be one of them.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-10">
              <Link
                to="/signup"
                className="btn-primary px-8 py-4 rounded-full bg-[#BFED8D] text-[#1c1917] border border-[#a8e070] shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:bg-[#b0e87d] transition-colors font-medium"
              >
                Create my resume
              </Link>
              <Link
                to="/builder"
                className="btn-primary px-8 py-4 rounded-full border border-[#e7e5e4] text-[#1c1917] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:border-[#d6d3d1] hover:bg-[#fafafa] transition-colors font-medium"
              >
                Upload my resume
              </Link>
            </div>
            <p className="text-sm uppercase tracking-wider text-[#78716c] font-semibold mb-4">Or try one of these:</p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-2">
              {suggestionChips.map((chip) => (
                <Link
                  key={chip.label}
                  to={chip.to}
                  className="px-4 py-2.5 rounded-full border border-[#e7e5e4] bg-white text-[#44403c] text-base font-medium hover:border-[#d6d3d1] hover:bg-[#fafafa] transition-colors"
                >
                  {chip.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-10 sm:gap-12 mt-10">
              <span className="flex items-center gap-3 text-base text-[#44403c] font-medium">
                <span className="w-6 h-6 rounded-full bg-[#a7f3d0] flex items-center justify-center shrink-0" aria-hidden>
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none" className="text-[#059669]">
                    <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span><strong className="text-[#1c1917] font-semibold">75%</strong> more likely to land the job</span>
              </span>
              <span className="flex items-center gap-3 text-base text-[#44403c] font-medium">
                <span className="w-6 h-6 flex items-center justify-center shrink-0 text-[#f59e0b]" aria-hidden>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </span>
                <span><strong className="text-[#1c1917] font-semibold">4.8</strong> out of 5 <span className="text-[#78716c]">·</span> <strong className="text-[#1c1917] font-semibold">22,000+</strong> reviews</span>
              </span>
            </div>
          </div>
          <div className="flex-1 flex justify-center lg:justify-end w-full max-w-[420px] sm:max-w-[480px]">
            <HeroResumeCarousel />
          </div>
        </div>
      </section>

      {/* Resume.io-style: stats + benefit cards — [icon] [big number] [resumes created today] */}
      <section
        className="relative py-12 sm:py-16 px-4 sm:px-6"
        style={{
          background: 'linear-gradient(180deg, #e0f2fe 0%, #dceff8 15%, #e8f4fa 40%, #f0f7fc 70%, #e0f2fe 100%)',
        }}
      >
        <div className="max-w-[1100px] mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 mb-12 sm:mb-14">
            <ResumesCreatedIcon />
            <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <span className="text-[#1c1917] font-bold tracking-tight" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
                <OdometerDisplay digitValues={resumeCountDigits} className="text-[#1c1917]" />
              </span>
              <span className="text-lg sm:text-xl text-[#44403c] font-normal">
                resumes created today
              </span>
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {[
              {
                icon: '✨',
                title: 'A draft in 10 mins',
                desc: 'The builder is 10× faster than doing it on your own. One goal → full structure.',
              },
              {
                icon: 'A+',
                title: 'Zero mistakes',
                desc: "Don't stress over typos. You'll sound great and look professional.",
              },
              {
                icon: '◎',
                title: 'ATS templates',
                desc: 'Your resume stays 100% compliant. Recruiters will see you.',
              },
              {
                icon: '$',
                title: 'Get paid more',
                desc: 'We can help you negotiate a higher starting salary with confidence.',
              },
            ].map((card, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white/95 border border-[#e5e7eb]/80 p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.08)] hover:border-[#f97316]/20 transition-all duration-300"
              >
                <span className="inline-flex w-10 h-10 items-center justify-center rounded-xl bg-[#fff7ed] text-[#ea580c] font-bold text-lg mb-3">
                  {card.icon}
                </span>
                <h3 className="font-semibold text-[#1c1917] text-lg mb-2">{card.title}</h3>
                <p className="text-base text-[#44403c] leading-relaxed" style={{ lineHeight: 1.55 }}>{card.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 sm:mt-16 pt-10 sm:pt-12 border-t border-[#e5e7eb]/60">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-6 sm:gap-10">
              <p className="text-[#44403c] text-base font-medium leading-snug shrink-0 text-center sm:text-left">
                Our candidates
                <br />
                have been hired at:
              </p>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-8 items-center justify-items-center max-w-[640px] sm:max-w-none mx-auto sm:mx-0">
                {[
                  { name: 'Booking.com', logo: '/logos/booking.svg' },
                  { name: 'Apple', logo: '/logos/apple.svg' },
                  { name: 'DHL', logo: '/logos/dhl.svg' },
                  { name: 'Amazon', logo: '/logos/amazon.svg' },
                  { name: 'American Express', logo: '/logos/amex.svg' },
                  { name: 'Accenture', logo: '/logos/accenture.svg' },
                  { name: 'KPMG', logo: '/logos/kpmg.svg' },
                ].map(({ name, logo }) => (
                  <div key={name} className="h-8 w-full flex items-center justify-center">
                    <img
                      src={logo}
                      alt={name}
                      title={name}
                      className="max-h-7 w-full max-w-[100px] object-contain object-center opacity-80 grayscale hover:grayscale-0 hover:opacity-100 transition-all mx-auto"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature sections: four quote blocks in normal scroll order with gradient background */}
      <div
        className="relative"
        style={{
          background: 'linear-gradient(180deg, #e0f2fe 0%, #dceff8 8%, #e8f4fa 20%, #f0f7fc 35%, #fef9f5 50%, #fef3e8 65%, #eef6f9 82%, #e0f2fe 100%)',
        }}
      >
        {featureSteps.map((s, i) => (
          <FeatureSection
            key={s.step}
            step={s.step}
            total={s.total}
            title={s.title}
            desc={s.desc}
            cta={s.cta}
            to={s.to}
          >
            <StackedCards>
              {i === 0 ? [<CardResumePreview key="a" />]
                : i === 1 ? [<CardTemplatePicker key="a" />]
                : i === 2 ? [<CardExportOptions key="a" />]
                : [<CardBuilderOutput key="a" />]}
            </StackedCards>
          </FeatureSection>
        ))}
      </div>

      {/* Stats — smooth transition: continues from feature blue into white */}
      <section
        className="relative py-10 sm:py-12 px-4 sm:px-6"
        style={{ background: 'linear-gradient(180deg, #e0f2fe 0%, #e5f3f9 12%, #eef6fb 25%, #f5f9fc 45%, #fafafa 65%, #fefefe 85%, #ffffff 100%)' }}
      >
        <div className="max-w-[1400px] mx-auto text-center">
          <p className="text-2xl sm:text-3xl font-semibold text-[#1c1917] tracking-tight">
            <span className="text-[#f97316]">Resumes created today</span>
            <span className="block sm:inline sm:ml-2 mt-1 sm:mt-0 text-[#44403c]">with Cvmora</span>
          </p>
          <p className="text-base text-cvmora-muted mt-2 font-medium">Start now and get hired faster.</p>
        </div>
      </section>

      {/* Every tool you need — smooth white band (no hard edge from stats) */}
      <ToolsSection />

      {/* Testimonials — smooth transition from white into peach, then back to white */}
      <section
        className="py-20 sm:py-28 px-4 sm:px-6"
        style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #fffdfb 8%, #fffbf7 18%, #fff9f3 28%, #fff7ed 35%, #fff7ed 65%, #fff9f3 75%, #fffbf7 88%, #fffdfb 95%, #ffffff 100%)',
        }}
      >
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1c1917] text-center mb-3 tracking-tight">
            92% of users recommend us
          </h2>
          <p className="text-[#78716c] text-center text-base font-medium mb-12">4.8 out of 5 · based on reviews</p>
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="surface-card p-6 sm:p-7 rounded-2xl bg-white border-[#e7e5e4]"
              >
                <div className="flex gap-0.5 mb-4 text-amber-500 text-[1.125rem]">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j} aria-hidden>★</span>
                  ))}
                </div>
                <p className="text-base text-[#44403c] leading-relaxed mb-5 font-medium" style={{ lineHeight: 1.6 }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="text-sm font-medium text-[#78716c]">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA — smooth from peach/cream into white */}
      <section
        className="py-20 sm:py-28 px-4 sm:px-6"
        style={{
          background: 'linear-gradient(180deg, #fffbf7 0%, #fffaf5 12%, #fff8f2 25%, #fff6f0 40%, #fff4ee 55%, #fff8f8 75%, #ffffff 100%)',
        }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1c1917] mb-6 tracking-tight">
            Ready to stand out?
          </h2>
          <p className="text-[#44403c] text-xl leading-relaxed mb-10" style={{ lineHeight: 1.6 }}>
            Join Cvmora and create your resume in minutes. Save multiple versions and download anytime.
          </p>
          <Link
            to="/signup"
            className="btn-primary inline-flex items-center gap-2 px-10 py-4 rounded-full bg-[#BFED8D] text-[#1c1917] border border-[#a8e070] hover:bg-[#b0e87d] transition-colors shadow-sm font-medium"
          >
            Get started free
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
