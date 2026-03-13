import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { TemplateCard } from '../components/TemplateCard'
import { allTemplates } from '../data/templates'
import { apiUploadResume } from '../api/client'
import { buildResumeFromUpload, PENDING_UPLOADED_RESUME_KEY } from '../utils/uploadedResume'

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

const HERO_TEMPLATES = ['professional', 'modern', 'minimal', 'simple-ats'] as const

function HeroResumeStack() {
  const [active, setActive] = useState(0)
  const templates = HERO_TEMPLATES.map(
    (id) => allTemplates.find((t) => t.id === id) ?? allTemplates[0]
  )

  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const resetAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current)
    autoRef.current = setInterval(
      () => setActive((i) => (i + 1) % templates.length),
      5000
    )
  }, [templates.length])

  useEffect(() => {
    resetAuto()
    return () => { if (autoRef.current) clearInterval(autoRef.current) }
  }, [resetAuto])

  const handleSelect = (i: number) => {
    setActive(i)
    resetAuto()
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <div className="relative w-full" style={{ aspectRatio: '210/297' }}>
        {templates.map((t, i) => {
          const isActive = i === active
          const offset = i - active
          return (
            <motion.div
              key={t.id}
              className="absolute inset-0 cursor-pointer"
              style={{ zIndex: isActive ? 10 : 5 - Math.abs(offset) }}
              animate={{
                scale: isActive ? 1 : 0.92 - Math.abs(offset) * 0.03,
                x: offset * 24,
                y: Math.abs(offset) * 8,
                opacity: Math.abs(offset) > 1 ? 0 : isActive ? 1 : 0.6,
                rotateY: offset * -2,
              }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => handleSelect(i)}
            >
              <div className="w-full h-full rounded-lg overflow-hidden bg-white shadow-[0_4px_24px_rgba(0,0,0,0.1)] border border-[#e7e5e4]">
                <TemplateCard template={t} variant="hero" />
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="flex items-center gap-2">
        {templates.map((t, i) => (
          <button
            key={t.id}
            type="button"
            onClick={() => handleSelect(i)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
              i === active
                ? 'bg-[#1c1917] text-white shadow-sm'
                : 'bg-white text-[#78716c] border border-[#e7e5e4] hover:border-[#d6d3d1]'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>
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

const featureSteps = [
  {
    step: '01',
    total: '04',
    heading: 'Build your resume',
    title: 'Upload or start from scratch',
    desc: 'Drop a PDF or Word file and we structure it. Or build step-by-step with a live preview.',
    cta: 'Start building',
    to: '/builder',
  },
  {
    step: '02',
    total: '04',
    heading: 'Pick a template',
    title: 'ATS-ready templates',
    desc: 'Professional, Modern, and Simple layouts. Recruiter-tested so formatting stays intact.',
    cta: 'Browse templates',
    to: '/templates',
  },
  {
    step: '03',
    total: '04',
    heading: 'Download & go',
    title: 'PDF or Word — print-ready',
    desc: 'Download when ready. No watermarks. One platform from draft to send.',
    cta: 'Start building',
    to: '/builder',
  },
  {
    step: '04',
    total: '04',
    heading: 'Your career toolkit',
    title: 'More than resumes',
    desc: 'Cover letters, job board, interview prep, salary tools, and guides.',
    cta: 'Explore tools',
    to: '/resources',
  },
]

const FEATURE_BG_COLORS = [
  '#faf5ff',
  '#fef2f2',
  '#fffbeb',
  '#f0fdf4',
]

function StickyFeatureStack({
  steps,
  cards,
}: {
  steps: typeof featureSteps
  cards: React.ReactNode[]
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [bgColor, setBgColor] = useState(FEATURE_BG_COLORS[0])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const onScroll = () => {
      const rect = container.getBoundingClientRect()
      const scrolled = -rect.top
      const totalScroll = container.scrollHeight - window.innerHeight
      if (totalScroll <= 0) return
      const progress = Math.max(0, Math.min(1, scrolled / totalScroll))
      const idx = Math.min(
        steps.length - 1,
        Math.floor(progress * steps.length)
      )
      setBgColor(FEATURE_BG_COLORS[idx] ?? FEATURE_BG_COLORS[0])
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [steps.length])

  return (
    <div
      ref={containerRef}
      className="relative transition-colors duration-700 ease-out"
      style={{ backgroundColor: bgColor }}
    >
      {steps.map((s, i) => (
        <div
          key={s.step}
          className="lg:sticky lg:top-0 lg:min-h-screen flex flex-col justify-center px-5 sm:px-6 py-4 sm:py-10 lg:py-14"
          style={{ zIndex: i + 1 }}
        >
          <div className="max-w-[1100px] mx-auto w-full">
            <div className="flex items-baseline gap-3 mb-3 sm:mb-4 pl-1">
              <span className="text-[#a8a29e] text-xs sm:text-sm font-medium tabular-nums">
                {s.step} <span className="mx-1 text-[#d6d3d1]">/</span> {s.total}
              </span>
              <span className="text-[#78716c] text-xs sm:text-sm font-medium">{s.heading}</span>
            </div>
            <div className="rounded-2xl sm:rounded-[1.5rem] bg-white shadow-[0_4px_32px_rgba(0,0,0,0.08)] border border-[#e5e7eb]/60 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch min-h-0 lg:min-h-[420px]">
                <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12 lg:pr-8">
                  <h2 className="text-[1.2rem] sm:text-[2rem] lg:text-[2.25rem] font-bold text-[#1c1917] tracking-tight leading-[1.3] sm:leading-[1.15] mb-4 sm:mb-5">
                    {s.title}
                  </h2>
                  <p className="text-[13px] sm:text-lg text-[#57534e] leading-relaxed mb-6 sm:mb-8" style={{ lineHeight: 1.65 }}>
                    {s.desc}
                  </p>
                  <Link
                    to={s.to}
                    className="inline-flex items-center justify-center px-6 sm:px-7 py-3.5 sm:py-3.5 rounded-full bg-[#1c1917] text-white text-[14px] sm:text-[0.9375rem] font-medium hover:bg-[#292524] transition-colors w-full sm:w-fit"
                  >
                    {s.cta}
                  </Link>
                </div>
                <div className="hidden sm:flex items-center justify-center p-8 lg:p-10 lg:pl-4">
                  {cards[i]}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="h-[15vh]" aria-hidden />
    </div>
  )
}

function CardResumePreview() {
  const steps = [
    { icon: '📄', label: 'Upload PDF or Word', done: true },
    { icon: '✏️', label: 'Edit sections in builder', done: true },
    { icon: '👁️', label: 'Live preview updates', done: true },
    { icon: '✅', label: 'Resume ready', done: false },
  ]
  return (
    <div className="w-full max-w-[380px] mx-auto rounded-xl overflow-hidden bg-white border border-[#e7e5e4] shadow-sm">
      <div className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-7 h-7 rounded-md bg-[#1c1917] flex items-center justify-center text-white text-xs font-bold">C</span>
          <span className="font-semibold text-[#1c1917] text-[0.9375rem]">Cvmora Builder</span>
        </div>
        <div className="space-y-3">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-base">{s.icon}</span>
              <span className={`text-sm ${s.done ? 'text-[#1c1917]' : 'text-[#a8a29e]'}`}>{s.label}</span>
              {s.done && (
                <span className="ml-auto w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold flex items-center justify-center border border-emerald-200/60">&#10003;</span>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-[#f5f5f4] flex items-center gap-2">
          <span className="text-xs text-[#a8a29e]">Start from scratch or upload</span>
          <span className="ml-auto text-xs font-medium text-[#f97316]">3 ways to begin</span>
        </div>
      </div>
    </div>
  )
}

function CardToolkit() {
  const tools = [
    { emoji: '✉️', name: 'Cover Letters', desc: 'Match your resume' },
    { emoji: '💼', name: 'Job Board', desc: 'Remote jobs in one place' },
    { emoji: '🎤', name: 'Interview Prep', desc: 'Practice questions' },
    { emoji: '💰', name: 'Salary Analyzer', desc: 'Market rate checks' },
    { emoji: '📖', name: 'Career Guides', desc: 'Expert tips & advice' },
  ]
  return (
    <div className="w-full max-w-[380px] mx-auto rounded-xl overflow-hidden bg-white border border-[#e7e5e4] shadow-sm">
      <div className="p-5">
        <p className="text-[11px] font-semibold text-[#a8a29e] uppercase tracking-wider mb-4">All-in-one platform</p>
        <div className="space-y-1">
          {tools.map((t) => (
            <div key={t.name} className="flex items-center gap-3 py-2 px-2 -mx-2 rounded-lg hover:bg-[#fafaf9] transition-colors">
              <span className="text-base">{t.emoji}</span>
              <div className="flex-1 min-w-0">
                <span className="text-[0.9375rem] font-medium text-[#1c1917] block">{t.name}</span>
              </div>
              <span className="text-xs text-[#a8a29e] shrink-0">{t.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CardExportOptions() {
  return (
    <div className="w-full max-w-[380px] mx-auto rounded-xl overflow-hidden bg-white border border-[#e7e5e4] shadow-sm">
      <div className="p-5">
        <p className="text-[11px] font-semibold text-[#a8a29e] uppercase tracking-wider mb-3">Export your resume</p>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-[#fafaf9] border border-[#e7e5e4]">
            <div className="flex items-center gap-2.5">
              <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor"><path d="M7 18h10V6H7v12zM14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/></svg>
              <span className="text-[0.9375rem] font-medium text-[#1c1917]">PDF</span>
            </div>
            <span className="text-xs text-[#a8a29e]">Print-ready</span>
          </div>
          <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-[#fafaf9] border border-[#e7e5e4]">
            <div className="flex items-center gap-2.5">
              <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM13 9V3.5L18.5 9H13z"/></svg>
              <span className="text-[0.9375rem] font-medium text-[#1c1917]">Word (.docx)</span>
            </div>
            <span className="text-xs text-[#a8a29e]">Editable</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-[#f5f5f4]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#57534e]">No watermarks. No signup required.</span>
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
              Secure
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function CardTemplatePicker() {
  const templates = [
    { name: 'Professional', category: 'Professional', selected: true },
    { name: 'Modern', category: 'Modern', selected: false },
    { name: 'Simple ATS', category: 'ATS', selected: false },
    { name: 'Classic', category: 'Simple', selected: false },
  ]
  return (
    <div className="w-full max-w-[380px] mx-auto rounded-xl overflow-hidden bg-white border border-[#e7e5e4] shadow-sm">
      <div className="p-5">
        <p className="text-[11px] font-semibold text-[#a8a29e] uppercase tracking-wider mb-3">Choose a template</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {['All', 'Simple', 'Professional', 'Modern', 'ATS'].map((f, i) => (
            <span key={f} className={`px-2.5 py-1 rounded-full text-xs font-medium ${i === 0 ? 'bg-[#1c1917] text-white' : 'bg-[#fafaf9] text-[#78716c] border border-[#e7e5e4]'}`}>{f}</span>
          ))}
        </div>
        <div className="space-y-0 divide-y divide-[#f5f5f4]">
          {templates.map((t) => (
            <div key={t.name} className="flex items-center justify-between py-3 first:pt-0">
              <div className="flex items-center gap-3">
                {t.selected
                  ? <span className="w-5 h-5 rounded-full bg-[#1c1917] flex items-center justify-center text-white text-[10px] font-bold">&#10003;</span>
                  : <span className="w-5 h-5 rounded-full border-2 border-[#e7e5e4]" />}
                <span className="text-[0.9375rem] font-medium text-[#1c1917]">{t.name}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-medium border border-emerald-200/60">{t.category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ToolsSection() {
  const tools = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
      ),
      title: 'Resume Builder',
      desc: 'Live preview, recruiter-approved templates, finish a draft in minutes.',
      to: '/builder',
      color: 'text-[#f97316]',
      bg: 'bg-[#fff7ed]',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>
      ),
      title: 'Cover Letters',
      desc: 'Write matching cover letters. Paste the job, tailor your pitch, download.',
      to: '/cover-letter',
      color: 'text-violet-600',
      bg: 'bg-violet-50',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
      ),
      title: 'Job Board',
      desc: 'Browse remote jobs in one place. Search by category and apply directly.',
      to: '/jobs',
      color: 'text-sky-600',
      bg: 'bg-sky-50',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
        </svg>
      ),
      title: 'Interview Prep',
      desc: 'Practice questions that get you hired. By category, with space to draft answers.',
      to: '/interview',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
        </svg>
      ),
      title: 'Salary Analyzer',
      desc: 'Check if your offer is at market rate. Negotiate with confidence.',
      to: '/salary',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>
      ),
      title: 'Resources',
      desc: 'Expert guides on resumes, cover letters, and career advice.',
      to: '/resources',
      color: 'text-rose-600',
      bg: 'bg-rose-50',
    },
  ]

  return (
    <section
      className="py-12 sm:py-28 px-5 sm:px-6"
      style={{ background: 'linear-gradient(180deg, #ffffff 0%, #fefefe 30%, #ffffff 70%, #ffffff 100%)' }}
    >
      <div className="max-w-[960px] mx-auto">
        <h2 className="text-xl sm:text-4xl font-bold text-[#1c1917] text-center mb-2 sm:mb-4 tracking-tight">
          Every tool you need
        </h2>
        <p className="text-[#78716c] text-center text-sm sm:text-lg max-w-md mx-auto mb-8 sm:mb-12 leading-relaxed">
          From building your resume to landing the offer.
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {tools.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="group flex flex-col p-4 sm:p-5 rounded-xl bg-white border border-[#e7e5e4] hover:border-[#d6d3d1] hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-200"
            >
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg ${item.bg} ${item.color} flex items-center justify-center mb-2.5 sm:mb-4 [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6`}>
                {item.icon}
              </div>
              <h3 className="font-semibold text-[#1c1917] text-[13px] sm:text-[0.9375rem] mb-1 sm:mb-1.5 group-hover:text-[#f97316] transition-colors duration-200">
                {item.title}
              </h3>
              <p className="text-[11px] sm:text-sm text-[#78716c] leading-relaxed mb-2 sm:mb-3 flex-1 hidden sm:block">{item.desc}</p>
              <span className="inline-flex items-center gap-1 text-[11px] sm:text-sm font-semibold text-[#f97316] group-hover:gap-2 transition-all duration-200">
                Go
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Landing() {
  const { isAuthenticated } = useAuth()
  const resumeCountDigits = useResumeCountDigits()
  const navigate = useNavigate()
  const uploadInputRef = useRef<HTMLInputElement>(null)
  const [uploadingResume, setUploadingResume] = useState(false)
  const [uploadResumeError, setUploadResumeError] = useState('')

  const handleLandingUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadResumeError('')
    setUploadingResume(true)
    try {
      const { text, data: parsed } = await apiUploadResume(file)
      const next = buildResumeFromUpload({ text, parsed })
      if (next) {
        sessionStorage.setItem(PENDING_UPLOADED_RESUME_KEY, JSON.stringify(next))
      }
      navigate('/builder')
    } catch (err) {
      setUploadResumeError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploadingResume(false)
      e.target.value = ''
    }
  }

  return (
    <div className="overflow-hidden">
      {/* Hero — smooth transition: warm orange/beige at top → light blue at bottom */}
      <section
        className="relative pt-10 sm:pt-20 pb-14 sm:pb-32 px-5 sm:px-6 min-h-0 sm:min-h-[85vh] sm:min-h-[85dvh] flex items-center"
        style={{
          background: 'linear-gradient(180deg, #fef7f0 0%, #ffedd5 12%, #ffe4c4 25%, #f5e6dc 40%, #e8f0f4 55%, #dceef5 70%, #d4ebf7 85%, #e0f2fe 100%)',
        }}
      >
        <div className="max-w-[1100px] mx-auto relative w-full flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <div className="flex-1 text-center lg:text-left max-w-lg mx-auto lg:mx-0 w-full">
            <h1 className="text-[1.625rem] sm:text-5xl lg:text-[3.25rem] font-bold leading-[1.2] sm:leading-[1.12] tracking-tight mb-5 sm:mb-6 text-[#1c1917]">
              This resume builder gets you{' '}
              <span className="text-[#f97316]">hired faster</span>
            </h1>
            <p className="text-[15px] sm:text-xl text-[#57534e] leading-relaxed mb-8 sm:mb-8 max-w-sm sm:max-w-md mx-auto lg:mx-0" style={{ lineHeight: 1.7 }}>
              Only 2% of resumes win. Yours will be one of them.
            </p>
            <div className="flex flex-col gap-3 mb-8 sm:mb-8 max-w-xs sm:max-w-none mx-auto lg:mx-0 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
              <Link
                to={isAuthenticated ? '/builder' : '/signup'}
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 sm:py-3.5 rounded-full bg-[#1c1917] text-white text-[15px] sm:text-[0.9375rem] font-medium hover:bg-[#292524] transition-colors shadow-sm"
              >
                Create my resume
              </Link>
              <button
                type="button"
                onClick={() => uploadInputRef.current?.click()}
                disabled={uploadingResume}
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 sm:py-3.5 rounded-full border border-[#e7e5e4] text-[#1c1917] bg-white text-[15px] sm:text-[0.9375rem] font-medium hover:border-[#d6d3d1] hover:bg-[#fafafa] transition-colors"
              >
                {uploadingResume ? 'Uploading...' : 'Upload my resume'}
              </button>
              <input
                ref={uploadInputRef}
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                onChange={handleLandingUpload}
                disabled={uploadingResume}
              />
            </div>
            {uploadResumeError && (
              <p className="text-sm text-red-600 mb-4">{uploadResumeError}</p>
            )}
            <div className="flex items-center justify-center lg:justify-start gap-6 text-[13px] sm:text-sm text-[#57534e]">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                <span><strong className="text-[#1c1917]">75%</strong> more likely</span>
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-400 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                <span><strong className="text-[#1c1917]">4.8</strong> · 22K+ reviews</span>
              </span>
            </div>
          </div>
          <div className="w-full max-w-[260px] sm:max-w-[380px] lg:max-w-[420px] shrink-0">
            <HeroResumeStack />
          </div>
        </div>
      </section>

      {/* Resume.io-style: stats + benefit cards — [icon] [big number] [resumes created today] */}
      <section
        className="relative py-10 sm:py-16 px-5 sm:px-6"
        style={{
          background: 'linear-gradient(180deg, #e0f2fe 0%, #dceff8 15%, #e8f4fa 40%, #f0f7fc 70%, #e0f2fe 100%)',
        }}
      >
        <div className="max-w-[1100px] mx-auto">
          <div className="flex flex-col items-center justify-center gap-1 mb-10 sm:mb-14">
            <div className="flex items-center gap-3">
              <ResumesCreatedIcon />
              <span className="text-[#1c1917] font-bold tracking-tight" style={{ fontSize: 'clamp(2rem, 6vw, 4rem)' }}>
                <OdometerDisplay digitValues={resumeCountDigits} className="text-[#1c1917]" />
              </span>
            </div>
            <span className="text-base sm:text-xl text-[#44403c] font-normal">
              resumes created today
            </span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {[
              { icon: '✨', title: '10 min draft', desc: '10× faster than doing it alone.' },
              { icon: 'A+', title: 'Zero mistakes', desc: 'Sound great, look professional.' },
              { icon: '◎', title: 'ATS ready', desc: 'Recruiters will see your resume.' },
              { icon: '$', title: 'Get paid more', desc: 'Negotiate a higher salary.' },
            ].map((card, i) => (
              <div
                key={i}
                className="rounded-xl sm:rounded-2xl bg-white/95 border border-[#e5e7eb]/80 p-4 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
              >
                <span className="inline-flex w-9 h-9 sm:w-10 sm:h-10 items-center justify-center rounded-lg sm:rounded-xl bg-[#fff7ed] text-[#ea580c] font-bold text-base sm:text-lg mb-2 sm:mb-3">
                  {card.icon}
                </span>
                <h3 className="font-semibold text-[#1c1917] text-[14px] sm:text-lg mb-1 sm:mb-2">{card.title}</h3>
                <p className="text-[12px] sm:text-base text-[#44403c] leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 sm:mt-16 pt-8 sm:pt-12 border-t border-[#e5e7eb]/60">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 sm:gap-10">
              <p className="text-[#44403c] text-sm sm:text-base font-medium leading-snug shrink-0 text-center sm:text-left">
                Our candidates have been hired at:
              </p>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-6 sm:gap-8 items-center justify-items-center max-w-[300px] sm:max-w-none mx-auto sm:mx-0">
                {[
                  { name: 'Booking.com', logo: '/logos/booking.svg' },
                  { name: 'Apple', logo: '/logos/apple.svg' },
                  { name: 'DHL', logo: '/logos/dhl.svg' },
                  { name: 'Amazon', logo: '/logos/amazon.svg' },
                  { name: 'American Express', logo: '/logos/amex.svg' },
                  { name: 'Accenture', logo: '/logos/accenture.svg' },
                  { name: 'KPMG', logo: '/logos/kpmg.svg' },
                ].map(({ name, logo }) => (
                  <div key={name} className="h-6 sm:h-8 w-full flex items-center justify-center">
                    <img
                      src={logo}
                      alt={name}
                      title={name}
                      className="max-h-5 sm:max-h-7 w-full max-w-[80px] sm:max-w-[100px] object-contain object-center opacity-80 grayscale hover:grayscale-0 hover:opacity-100 transition-all mx-auto"
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
      <StickyFeatureStack
        steps={featureSteps}
        cards={[
          <CardResumePreview key="a" />,
          <CardTemplatePicker key="b" />,
          <CardExportOptions key="c" />,
          <CardToolkit key="d" />,
        ]}
      />

      <section
        className="relative py-8 sm:py-12 px-5 sm:px-6"
        style={{ background: 'linear-gradient(180deg, #f0fdf4 0%, #f5fdf8 15%, #fafcfa 35%, #fefefe 60%, #ffffff 100%)' }}
      >
        <div className="max-w-[1400px] mx-auto text-center">
          <p className="text-xl sm:text-3xl font-semibold text-[#1c1917] tracking-tight">
            <span className="text-[#f97316]">Resumes created today</span>
            <span className="block sm:inline sm:ml-2 mt-1 sm:mt-0 text-[#44403c]">with Cvmora</span>
          </p>
          <p className="text-sm sm:text-base text-cvmora-muted mt-1 sm:mt-2 font-medium">Start now and get hired faster.</p>
        </div>
      </section>

      {/* Every tool you need — smooth white band (no hard edge from stats) */}
      <ToolsSection />

      {/* Testimonials — smooth transition from white into peach, then back to white */}
      <section
        className="py-12 sm:py-28 px-5 sm:px-6"
        style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #fffdfb 8%, #fffbf7 18%, #fff9f3 28%, #fff7ed 35%, #fff7ed 65%, #fff9f3 75%, #fffbf7 88%, #fffdfb 95%, #ffffff 100%)',
        }}
      >
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-xl sm:text-3xl font-bold text-[#1c1917] text-center mb-2 sm:mb-3 tracking-tight">
            92% of users recommend us
          </h2>
          <p className="text-[#78716c] text-center text-sm sm:text-base font-medium mb-8 sm:mb-12">4.8 out of 5 · based on reviews</p>
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="surface-card p-5 sm:p-7 rounded-xl sm:rounded-2xl bg-white border-[#e7e5e4]"
              >
                <div className="flex gap-0.5 mb-2 sm:mb-4 text-amber-500 text-[0.9375rem] sm:text-[1.125rem]">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j} aria-hidden>★</span>
                  ))}
                </div>
                <p className="text-[13px] sm:text-base text-[#44403c] leading-relaxed mb-3 sm:mb-5 font-medium" style={{ lineHeight: 1.6 }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="text-xs sm:text-sm font-medium text-[#78716c]">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA — smooth from peach/cream into white */}
      <section
        className="py-14 sm:py-28 px-5 sm:px-6"
        style={{
          background: 'linear-gradient(180deg, #fffbf7 0%, #fffaf5 12%, #fff8f2 25%, #fff6f0 40%, #fff4ee 55%, #fff8f8 75%, #ffffff 100%)',
        }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-xl sm:text-3xl font-bold text-[#1c1917] mb-4 sm:mb-6 tracking-tight">
            Ready to stand out?
          </h2>
          <p className="text-[#44403c] text-[15px] sm:text-xl leading-relaxed mb-8 sm:mb-10" style={{ lineHeight: 1.6 }}>
            Create your resume in minutes. Download anytime.
          </p>
          <Link
            to={isAuthenticated ? '/builder' : '/signup'}
            className="btn-primary inline-flex items-center gap-2 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-[#BFED8D] text-[#1c1917] border border-[#a8e070] hover:bg-[#b0e87d] transition-colors shadow-sm font-medium text-[15px] sm:text-base"
          >
            Get started free
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
