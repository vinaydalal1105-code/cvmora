import { useState, useRef } from 'react'
import { useResume } from '../context/ResumeContext'
import { Input, TextArea } from './Editor'
import { SKILL_SUGGESTIONS } from '../data/skillSuggestions'

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

function toBulletedLines(value: string): string {
  return value
    .split('\n')
    .map((line) => {
      const cleaned = line.replace(/^\s*[•-]\s*/, '').trimStart()
      return cleaned ? `• ${cleaned}` : ''
    })
    .join('\n')
}

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

function FormatToggle({ value, onChange }: { value: 'bullets' | 'paragraph'; onChange: (v: 'bullets' | 'paragraph') => void }) {
  return (
    <div className="flex items-center gap-1 bg-[#f5f5f4] rounded-lg p-0.5 mb-4">
      <button
        type="button"
        onClick={() => onChange('bullets')}
        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${value === 'bullets' ? 'bg-white text-[#1c1917] shadow-sm' : 'text-[#78716c] hover:text-[#1c1917]'}`}
      >
        Bullet points
      </button>
      <button
        type="button"
        onClick={() => onChange('paragraph')}
        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${value === 'paragraph' ? 'bg-white text-[#1c1917] shadow-sm' : 'text-[#78716c] hover:text-[#1c1917]'}`}
      >
        Paragraph
      </button>
    </div>
  )
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
    <div className="px-5 py-5">
      <h1 className="text-lg font-bold text-[#1c1917] tracking-tight mb-1">Personal Details</h1>
      <p className="text-[13px] text-[#78716c] mb-5 leading-relaxed">
        Users who added phone number and email received 64% more positive feedback from recruiters.
      </p>

      <Input
        label="Job Target"
        value={data.jobTarget ?? ''}
        onChange={(v) => updateJobTarget(v)}
        placeholder="The role you want"
      />

      {showPhotoOption && (
        <div className="mb-4">
          <label className="block text-[13px] font-medium text-[#44403c] mb-2">Profile photo</label>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhotoChange}
            className="hidden"
            aria-label="Upload profile photo"
          />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="w-16 h-16 rounded-full overflow-hidden border-2 border-dashed border-[#d6d3d1] bg-[#fafaf9] flex items-center justify-center shrink-0 hover:border-[#f97316] hover:bg-[#fff7ed] transition-colors"
            >
              {c.photo ? (
                <img src={c.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <svg className="w-5 h-5 text-[#a8a29e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
              )}
            </button>
            <div className="min-w-0">
              <p className="text-[13px] text-[#78716c]">
                {c.photo ? 'Click to change photo' : 'JPG, PNG or WebP'}
              </p>
              {c.photo && (
                <button
                  type="button"
                  onClick={() => updateContact({ photo: '' })}
                  className="text-[13px] font-medium text-[#f97316] hover:underline mt-0.5"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
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
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Email"
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
      <div className="grid grid-cols-2 gap-3">
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
            className="text-[13px] text-[#f97316] font-medium hover:underline"
          >
            Show less
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setShowMore(true)}
          className="flex items-center gap-1.5 text-[13px] text-[#f97316] font-medium hover:underline mt-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          Add more details
        </button>
      )}
    </div>
  )
}

function ExperienceStepContent() {
  const { data, addExperience, updateExperience, removeExperience, setExperienceFormat } = useResume()
  const experience = data.experience
  const fmt = data.experienceFormat ?? 'bullets'

  return (
    <div className="px-5 py-5">
      <h1 className="text-lg font-bold text-[#1c1917] tracking-tight mb-1">Employment History</h1>
      <p className="text-[13px] text-[#78716c] mb-5 leading-relaxed">
        List your most recent roles first. Include job title, company, dates and key achievements.
      </p>
      <FormatToggle value={fmt} onChange={setExperienceFormat} />
      {experience.map((exp) => (
        <div
          key={exp.id}
          className="mb-4 p-4 rounded-xl border border-[#e7e5e4] bg-white"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-[#f97316]">Job</span>
            {experience.length > 1 && (
              <button
                type="button"
                onClick={() => removeExperience(exp.id)}
                className="text-xs text-[#dc2626] font-medium hover:underline"
              >
                Remove
              </button>
            )}
          </div>
          <Input label="Job title" value={exp.jobTitle} onChange={(v) => updateExperience(exp.id, { jobTitle: v })} />
          <Input label="Company" value={exp.company} onChange={(v) => updateExperience(exp.id, { company: v })} />
          <Input label="Location" value={exp.location} onChange={(v) => updateExperience(exp.id, { location: v })} />
          <div className="grid grid-cols-2 gap-3">
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
          <div className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              id={`current-${exp.id}`}
              checked={exp.current}
              onChange={(e) => updateExperience(exp.id, { current: e.target.checked })}
              className="rounded border-[#d6d3d1] text-[#f97316] focus:ring-[#f97316]"
            />
            <label htmlFor={`current-${exp.id}`} className="text-[13px] text-[#44403c]">
              I currently work here
            </label>
          </div>
          <TextArea
            label="Description (bullets on new lines)"
            value={exp.description}
            onChange={(v) => updateExperience(exp.id, { description: toBulletedLines(v) })}
            rows={6}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={addExperience}
        className="flex items-center gap-1.5 text-[13px] text-[#f97316] font-semibold hover:underline"
      >
        <span className="text-base leading-none">+</span>
        Add experience
      </button>
    </div>
  )
}

function EducationStepContent() {
  const { data, addEducation, updateEducation, removeEducation, setEducationFormat } = useResume()
  const education = data.education
  const fmt = data.educationFormat ?? 'bullets'

  return (
    <div className="px-5 py-5">
      <h1 className="text-lg font-bold text-[#1c1917] tracking-tight mb-1">Education</h1>
      <p className="text-[13px] text-[#78716c] mb-5 leading-relaxed">
        Add your degrees and certifications. Most recent first.
      </p>
      <FormatToggle value={fmt} onChange={setEducationFormat} />
      {education.map((edu) => (
        <div
          key={edu.id}
          className="mb-4 p-4 rounded-xl border border-[#e7e5e4] bg-white"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-[#f97316]">School</span>
            {education.length > 1 && (
              <button
                type="button"
                onClick={() => removeEducation(edu.id)}
                className="text-xs text-[#dc2626] font-medium hover:underline"
              >
                Remove
              </button>
            )}
          </div>
          <Input label="Degree" value={edu.degree} onChange={(v) => updateEducation(edu.id, { degree: v })} />
          <Input label="School" value={edu.school} onChange={(v) => updateEducation(edu.id, { school: v })} />
          <Input label="Location" value={edu.location} onChange={(v) => updateEducation(edu.id, { location: v })} />
          <div className="grid grid-cols-2 gap-3">
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
            rows={4}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={addEducation}
        className="flex items-center gap-1.5 text-[13px] text-[#f97316] font-semibold hover:underline"
      >
        <span className="text-base leading-none">+</span>
        Add education
      </button>
    </div>
  )
}

function getSkillSuggestions(prefix: string): string[] {
  const q = prefix.trim().toLowerCase()
  if (!q) return [...SKILL_SUGGESTIONS]
  return SKILL_SUGGESTIONS.filter((s) => s.toLowerCase().startsWith(q))
}

function SkillsStepContent() {
  const { data, setSkills } = useResume()
  const skills = data.skills.length ? data.skills : ['']
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)

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

  const applySuggestion = (index: number, value: string) => {
    updateSkill(index, value)
    setFocusedIndex(null)
  }

  return (
    <div className="px-5 py-5">
      <h1 className="text-lg font-bold text-[#1c1917] tracking-tight mb-1">Skills</h1>
      <p className="text-[13px] text-[#78716c] mb-4 leading-relaxed">
        Choose skills that show you fit the position. Match key skills from the job listing.
      </p>
      <div className="space-y-2.5 mb-4">
        {skills.map((skill, index) => {
          const suggestions = getSkillSuggestions(skill)
          const showList = focusedIndex === index && suggestions.length > 0

          return (
            <div
              key={index}
              className="relative flex flex-col gap-0 p-3 rounded-xl border border-[#e7e5e4] bg-white"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => updateSkill(index, e.target.value)}
                  onFocus={() => setFocusedIndex(index)}
                  onBlur={() => setTimeout(() => setFocusedIndex(null), 180)}
                  placeholder="e.g. Leadership, Python, Project management"
                  className="input-premium text-[15px] py-2 flex-1 min-w-0"
                  autoComplete="off"
                />
                <div className="flex items-center gap-0.5 shrink-0">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => moveSkill(index, -1)}
                      className="p-1.5 rounded-md text-[#a8a29e] hover:bg-[#f5f5f4] hover:text-[#1c1917] transition-colors"
                      aria-label="Move up"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                    </button>
                  )}
                  {index < skills.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveSkill(index, 1)}
                      className="p-1.5 rounded-md text-[#a8a29e] hover:bg-[#f5f5f4] hover:text-[#1c1917] transition-colors"
                      aria-label="Move down"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="p-1.5 rounded-md text-[#a8a29e] hover:bg-red-50 hover:text-[#dc2626] transition-colors"
                    aria-label="Remove skill"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
              {showList && (
                <ul
                  className="absolute left-3 right-14 top-full z-10 mt-1 max-h-[200px] overflow-y-auto rounded-xl border border-[#e7e5e4] bg-white py-1 shadow-lg"
                  onMouseDown={(e) => e.preventDefault()}
                  role="listbox"
                >
                  {suggestions.map((s, i) => (
                    <li key={i} role="option">
                      <button
                        type="button"
                        className="w-full px-3 py-2 text-left text-[14px] text-[#1c1917] hover:bg-[#fff7ed] focus:bg-[#fff7ed] focus:outline-none transition-colors"
                        onMouseDown={() => applySuggestion(index, s)}
                      >
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>
      <button
        type="button"
        onClick={addSkill}
        className="flex items-center gap-1.5 text-[13px] text-[#f97316] font-semibold hover:underline"
      >
        <span className="text-base leading-none">+</span>
        Add one more skill
      </button>
    </div>
  )
}

function SummaryStepContent() {
  const { data, updateSummary, setDescriptionFormat } = useResume()
  const fmt = data.descriptionFormat ?? 'bullets'
  return (
    <div className="px-5 py-5">
      <h1 className="text-lg font-bold text-[#1c1917] tracking-tight mb-1">Professional Summary</h1>
      <p className="text-[13px] text-[#78716c] mb-5 leading-relaxed">
        A few sentences about your experience and goals. Recruiters often read this first.
      </p>
      <FormatToggle value={fmt} onChange={setDescriptionFormat} />
      <TextArea
        label="Summary"
        value={data.summary}
        onChange={updateSummary}
        placeholder="A few lines about your experience and goals..."
        rows={8}
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
  onFinish?: () => void
  canProceed?: boolean
}) {
  const total = BUILDER_STEPS.length
  const step = BUILDER_STEPS[stepIndex]
  const isLast = stepIndex === total - 1
  const handleMainAction = isLast && onFinish ? onFinish : onNext

  return (
    <footer className="flex-none flex items-center justify-between gap-3 px-4 py-3 border-t border-[#e7e5e4] bg-white">
      <div className="flex items-center gap-2">
        {stepIndex > 0 ? (
          <button
            type="button"
            onClick={onBack}
            className="min-h-[40px] px-4 py-2 rounded-full border border-[#e7e5e4] text-[14px] font-medium text-[#44403c] hover:bg-[#fafaf9] active:bg-[#f5f5f4] transition-colors"
          >
            Back
          </button>
        ) : (
          <a href="/privacy" className="text-[11px] text-[#a8a29e] hover:text-[#78716c]">Terms & Privacy</a>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onStepClick?.(i)}
            aria-label={`Step ${i + 1}: ${BUILDER_STEPS[i].title}`}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === stepIndex ? 'bg-[#f97316] scale-125' : i < stepIndex ? 'bg-[#f97316]/40' : 'bg-[#d6d3d1]'
            } ${onStepClick ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
          />
        ))}
        <span className="text-[11px] text-[#a8a29e] tabular-nums ml-1">{stepIndex + 1}/{total}</span>
      </div>

      <button
        type="button"
        onClick={handleMainAction}
        disabled={!canProceed}
        title={!canProceed && stepIndex === 0 ? 'Please enter your email to continue' : undefined}
        className="min-h-[40px] px-5 py-2 rounded-full bg-[#BFED8D] text-[#1c1917] text-[14px] font-semibold border border-[#a8e070] hover:bg-[#b0e87d] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLast ? 'Finish' : `Next: ${step.nextLabel}`}
      </button>
    </footer>
  )
}
