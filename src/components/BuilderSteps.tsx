import { useState, useRef } from 'react'
import { useResume } from '../context/ResumeContext'
import { Input, TextArea } from './Editor'

/** Template IDs that display a profile photo in their layout – show photo upload only for these */
const TEMPLATES_WITH_PHOTO: string[] = [
  'classic',
  'traditional',
  'professional',
  'corporate',
  'minimal',
  'clean',
  'modern',
  'vivid',
]

export const BUILDER_STEPS = [
  { id: 'personal', title: 'Personal Details', nextLabel: 'Employment History' },
  { id: 'employment', title: 'Employment History', nextLabel: 'Education' },
  { id: 'education', title: 'Education', nextLabel: 'Skills' },
  { id: 'skills', title: 'Skills', nextLabel: 'Summary' },
  { id: 'summary', title: 'Summary', nextLabel: 'Finish' },
] as const

export function resumeScore(data: {
  jobTarget?: string
  contact: { fullName?: string; email?: string; phone?: string; firstName?: string; lastName?: string }
  experience: unknown[]
  education: unknown[]
  skills: string[]
  summary?: string
}): { score: number; suggestion: string } {
  let score = 0
  const checks = [
    [!!(data.jobTarget?.trim()), 10, 'Add job title'],
    [!!(data.contact.firstName?.trim() || data.contact.lastName?.trim() || data.contact.fullName?.trim()), 15, 'Add your name'],
    [!!(data.contact.email?.trim()), 15, 'Add email'],
    [!!(data.contact.phone?.trim()), 10, 'Add phone number'],
    [data.experience.length > 0 && (data.experience as { jobTitle?: string }[]).some((e) => !!(e.jobTitle?.trim())), 20, 'Add employment history'],
    [data.education.length > 0 && (data.education as { degree?: string }[]).some((e) => !!(e.degree?.trim() || (e as { school?: string }).school?.trim())), 15, 'Add education'],
    [data.skills.some(Boolean), 10, 'Add skills'],
    [!!(data.summary?.trim()), 5, 'Add summary'],
  ]
  for (const [ok, points] of checks) {
    if (ok) score += Number(points)
  }
  const firstMissing = checks.find(([ok]) => !ok)
  return {
    score: Math.min(100, score),
    suggestion: firstMissing ? `+${(firstMissing as [boolean, number, string])[1]}% ${(firstMissing as [boolean, number, string])[2]}` : 'Looking good!',
  }
}

function PersonalDetailsStep() {
  const { data, updateContact, updateJobTarget, template } = useResume()
  const [showMore, setShowMore] = useState(false)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const c = data.contact
  const showPhotoOption = TEMPLATES_WITH_PHOTO.includes(template)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataURL = reader.result as string
      updateContact({ photo: dataURL })
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <div className="px-4 py-4">
      <h1 className="text-lg font-bold text-cvmora-ink tracking-tight mb-1">Personal Details</h1>
      <p className="text-[0.8125rem] text-cvmora-muted mb-6">
        Users who added phone number and email received 64% more positive feedback from recruiters.
      </p>

      <div className="mb-3">
        <label className="block text-[0.8125rem] font-semibold text-cvmora-ink/80 mb-1.5">Job Target</label>
        <input
          type="text"
          value={data.jobTarget ?? ''}
          onChange={(e) => updateJobTarget(e.target.value)}
          placeholder="The role you want"
          className="input-premium text-[0.9375rem] py-2.5 w-full"
        />
      </div>

      {showPhotoOption && (
        <div className="mb-4">
          <label className="block text-[0.8125rem] font-semibold text-cvmora-ink/80 mb-1.5">Profile photo</label>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhotoChange}
            className="hidden"
            aria-label="Upload profile photo"
          />
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="w-20 h-20 rounded-full overflow-hidden border-2 border-dashed border-[#e7e5e4] bg-[#f5f5f4] flex items-center justify-center shrink-0 hover:border-[#f97316] hover:bg-[#fff7ed] transition-colors"
            >
              {c.photo ? (
                <img src={c.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[#86868b] text-2xl" aria-hidden>+</span>
              )}
            </button>
            <div className="min-w-0">
              <p className="text-[0.8125rem] text-[#6e6e73]">
                {c.photo ? 'Click to change photo' : 'Add a professional headshot. JPG, PNG or WebP.'}
              </p>
              {c.photo && (
                <button
                  type="button"
                  onClick={() => updateContact({ photo: '' })}
                  className="text-[0.8125rem] font-medium text-[#f97316] hover:underline mt-0.5"
                >
                  Remove photo
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-3">
        <Input
          label="First Name"
          value={c.firstName ?? ''}
          onChange={(v) => updateContact({ firstName: v })}
          placeholder="First name"
        />
        <Input
          label="Last Name"
          value={c.lastName ?? ''}
          onChange={(v) => updateContact({ lastName: v })}
          placeholder="Last name"
        />
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <Input
          label="Email*"
          value={c.email}
          onChange={(v) => updateContact({ email: v })}
          placeholder="you@example.com"
          type="email"
        />
        <Input
          label="Phone"
          value={c.phone}
          onChange={(v) => updateContact({ phone: v })}
          placeholder="+1 (555) 000-0000"
        />
      </div>
      <Input
        label="Address"
        value={c.address ?? ''}
        onChange={(v) => updateContact({ address: v })}
        placeholder="Street address"
      />
      <div className="grid grid-cols-2 gap-3 mb-3">
        <Input
          label="City, State"
          value={(c.city ?? '') + (c.state ? ', ' + (c.state ?? '') : '')}
          onChange={(v) => {
            const parts = v.split(',')
            const city = parts[0] ?? ''
            const state = (parts.slice(1).join(',') ?? '').trim()
            updateContact({ city, state })
          }}
          placeholder="City, State"
        />
        <Input
          label="Country"
          value={c.country ?? ''}
          onChange={(v) => updateContact({ country: v })}
          placeholder="Country"
        />
      </div>

      {showMore ? (
        <>
          <Input
            label="Website"
            value={c.website}
            onChange={(v) => updateContact({ website: v })}
            placeholder="https://..."
          />
          <Input
            label="LinkedIn"
            value={c.linkedin}
            onChange={(v) => updateContact({ linkedin: v })}
            placeholder="linkedin.com/in/..."
          />
          <button
            type="button"
            onClick={() => setShowMore(false)}
            className="text-sm text-[var(--color-primary)] font-medium hover:underline"
          >
            Show less
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setShowMore(true)}
          className="flex items-center gap-1.5 text-sm text-[var(--color-primary)] font-medium hover:underline"
        >
          <span className="text-[0.75rem]" aria-hidden>▼</span>
          Add more details
        </button>
      )}
    </div>
  )
}

function ExperienceStepContent() {
  const { data, addExperience, updateExperience, removeExperience } = useResume()
  const experience = data.experience

  return (
    <div className="px-4 py-4">
      <h1 className="text-xl font-bold text-cvmora-ink tracking-tight mb-1">Employment History</h1>
      <p className="text-[0.8125rem] text-cvmora-muted mb-6">
        List your most recent roles first. Include job title, company, dates and key achievements.
      </p>
      {experience.map((exp) => (
        <div
          key={exp.id}
          className="mb-4 p-5 rounded-xl border border-cvmora-ink/8 bg-white shadow-[var(--shadow-xs)]"
        >
          <div className="flex justify-between items-start gap-2 mb-2">
            <span className="text-xs text-[var(--color-primary)] font-medium">Job</span>
            {experience.length > 1 && (
              <button
                type="button"
                onClick={() => removeExperience(exp.id)}
                className="text-xs text-red-600 hover:underline"
              >
                Remove
              </button>
            )}
          </div>
          <Input label="Job title" value={exp.jobTitle} onChange={(v) => updateExperience(exp.id, { jobTitle: v })} />
          <Input label="Company" value={exp.company} onChange={(v) => updateExperience(exp.id, { company: v })} />
          <Input label="Location" value={exp.location} onChange={(v) => updateExperience(exp.id, { location: v })} />
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Start"
              value={exp.startDate}
              onChange={(v) => updateExperience(exp.id, { startDate: v })}
              placeholder="Jan 2020"
            />
            <Input
              label="End"
              value={exp.endDate}
              onChange={(v) => updateExperience(exp.id, { endDate: v })}
              placeholder="Present"
            />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              id={`current-${exp.id}`}
              checked={exp.current}
              onChange={(e) => updateExperience(exp.id, { current: e.target.checked })}
              className="rounded border-cvmora-ink/30"
            />
            <label htmlFor={`current-${exp.id}`} className="text-xs text-cvmora-ink/80">
              I currently work here
            </label>
          </div>
          <TextArea
            label="Description (bullets on new lines)"
            value={exp.description}
            onChange={(v) => updateExperience(exp.id, { description: v })}
            rows={4}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={addExperience}
        className="text-sm text-[var(--color-primary)] font-medium hover:underline"
      >
        + Add experience
      </button>
    </div>
  )
}

function EducationStepContent() {
  const { data, addEducation, updateEducation, removeEducation } = useResume()
  const education = data.education

  return (
    <div className="px-4 py-4">
      <h1 className="text-xl font-bold text-cvmora-ink tracking-tight mb-1">Education</h1>
      <p className="text-[0.8125rem] text-cvmora-muted mb-6">
        Add your degrees and certifications. Most recent first.
      </p>
      {education.map((edu) => (
        <div
          key={edu.id}
          className="mb-4 p-5 rounded-xl border border-cvmora-ink/8 bg-white shadow-[var(--shadow-xs)]"
        >
          <div className="flex justify-between items-start gap-2 mb-2">
            <span className="text-xs text-[var(--color-primary)] font-medium">School</span>
            {education.length > 1 && (
              <button
                type="button"
                onClick={() => removeEducation(edu.id)}
                className="text-xs text-red-600 hover:underline"
              >
                Remove
              </button>
            )}
          </div>
          <Input label="Degree" value={edu.degree} onChange={(v) => updateEducation(edu.id, { degree: v })} />
          <Input label="School" value={edu.school} onChange={(v) => updateEducation(edu.id, { school: v })} />
          <Input label="Location" value={edu.location} onChange={(v) => updateEducation(edu.id, { location: v })} />
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Start"
              value={edu.startDate}
              onChange={(v) => updateEducation(edu.id, { startDate: v })}
            />
            <Input
              label="End"
              value={edu.endDate}
              onChange={(v) => updateEducation(edu.id, { endDate: v })}
            />
          </div>
          <TextArea
            label="Details"
            value={edu.description}
            onChange={(v) => updateEducation(edu.id, { description: v })}
            rows={2}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={addEducation}
        className="text-sm text-[var(--color-primary)] font-medium hover:underline"
      >
        + Add education
      </button>
    </div>
  )
}

function SkillsStepContent() {
  const { data, setSkills } = useResume()
  const skills = data.skills.length ? data.skills : ['']

  const updateSkill = (index: number, value: string) => {
    const next = skills.length ? [...skills] : ['']
    next[index] = value
    setSkills(next)
  }

  const removeSkill = (index: number) => {
    if (skills.length <= 1) {
      setSkills([''])
      return
    }
    setSkills(skills.filter((_, i) => i !== index))
  }

  const addSkill = () => {
    setSkills([...skills, ''])
  }

  const moveSkill = (index: number, direction: -1 | 1) => {
    const next = [...skills]
    const target = index + direction
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    setSkills(next)
  }

  return (
    <div className="px-4 py-4">
      <h1 className="text-lg font-bold text-cvmora-ink tracking-tight mb-1">Skills</h1>
      <p className="text-[0.8125rem] text-cvmora-muted mb-4">
        Choose important skills that show you fit the position. Match key skills from the job listing when applying online.
      </p>
      <div className="space-y-3 mb-4">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-3 rounded-lg border border-cvmora-ink/10 bg-white"
          >
            <input
              type="text"
              value={skill}
              onChange={(e) => updateSkill(index, e.target.value)}
              placeholder="e.g. Leadership, Python, Project management"
              className="input-premium text-[0.9375rem] py-2 flex-1 min-w-0"
            />
            <div className="flex items-center gap-0.5 shrink-0">
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => moveSkill(index, -1)}
                  className="p-1.5 rounded text-cvmora-ink/50 hover:bg-cvmora-ink/10 hover:text-cvmora-ink"
                  aria-label="Move up"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                </button>
              )}
              {index < skills.length - 1 && (
                <button
                  type="button"
                  onClick={() => moveSkill(index, 1)}
                  className="p-1.5 rounded text-cvmora-ink/50 hover:bg-cvmora-ink/10 hover:text-cvmora-ink"
                  aria-label="Move down"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
              )}
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="p-1.5 rounded text-cvmora-ink/50 hover:bg-red-50 hover:text-red-600"
                aria-label="Remove skill"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addSkill}
        className="flex items-center gap-2 text-[var(--color-primary)] font-semibold text-[0.9375rem] hover:underline"
      >
        <span className="text-lg leading-none">+</span>
        Add one more skill
      </button>
    </div>
  )
}

function SummaryStepContent() {
  const { data, updateSummary } = useResume()
  return (
    <div className="px-4 py-4">
      <h1 className="text-xl font-bold text-cvmora-ink tracking-tight mb-1">Professional summary</h1>
      <p className="text-[0.8125rem] text-cvmora-muted mb-6">
        A few sentences about your experience and goals. Recruiters often read this first.
      </p>
      <TextArea
        label="Summary"
        value={data.summary}
        onChange={updateSummary}
        placeholder="A few lines about your experience and goals..."
        rows={4}
      />
    </div>
  )
}

export function BuilderStepContent({ stepIndex }: { stepIndex: number }) {
  switch (stepIndex) {
    case 0:
      return <PersonalDetailsStep />
    case 1:
      return <ExperienceStepContent />
    case 2:
      return <EducationStepContent />
    case 3:
      return <SkillsStepContent />
    case 4:
      return <SummaryStepContent />
    default:
      return <PersonalDetailsStep />
  }
}

export function BuilderStepFooter({
  stepIndex,
  onNext,
  onBack,
  onStepClick,
  onFinish,
  canProceed = true,
}: {
  stepIndex: number
  onNext: () => void
  onBack: () => void
  onStepClick?: (index: number) => void
  /** When on last step, clicking Finish calls this instead of onNext */
  onFinish?: () => void
  /** When false, Next button is disabled (e.g. required email on Personal Details) */
  canProceed?: boolean
}) {
  const total = BUILDER_STEPS.length
  const step = BUILDER_STEPS[stepIndex]
  const isLast = stepIndex === total - 1
  const handleMainAction = isLast && onFinish ? onFinish : onNext

  return (
    <footer className="flex-none flex items-center justify-between gap-4 px-4 py-3 border-t border-cvmora-ink/8 bg-white">
      <div className="flex items-center gap-3 min-w-0">
        <p className="text-[0.6875rem] text-cvmora-ink/50 shrink-0">
          <a href="/privacy" className="text-[var(--color-primary)] hover:underline">Terms</a> & <a href="/privacy" className="text-[var(--color-primary)] hover:underline">Privacy</a>
        </p>
        {stepIndex > 0 && (
          <button
            type="button"
            onClick={onBack}
            className="shrink-0 px-4 py-2 rounded-[980px] border border-cvmora-ink/15 text-[17px] font-normal text-cvmora-ink/80 hover:bg-cvmora-ink/5 transition-colors"
          >
            Back
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onStepClick?.(i)}
            aria-label={`Step ${i + 1}`}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              i === stepIndex ? 'bg-[#f97316]' : 'bg-black/15 hover:bg-black/25'
            } ${onStepClick ? 'cursor-pointer' : 'cursor-default'}`}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[0.75rem] text-cvmora-ink/60 tabular-nums hidden sm:inline">{stepIndex + 1}/{total}</span>
        <button
          type="button"
          onClick={handleMainAction}
          disabled={!canProceed}
          title={!canProceed && stepIndex === 0 ? 'Please enter your email to continue' : undefined}
          className="px-4 py-2 rounded-full bg-[#BFED8D] text-[#1c1917] text-[16px] font-medium border border-[#a8e070] hover:bg-[#b0e87d] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#BFED8D]"
        >
          {isLast ? 'Finish' : `Next: ${step.nextLabel}`}
        </button>
      </div>
    </footer>
  )
}
