import { useResume } from '../context/ResumeContext'

function toBulletedLines(value: string): string {
  return value
    .split('\n')
    .map((line) => {
      const cleaned = line.replace(/^\s*[•-]\s*/, '').trimStart()
      return cleaned ? `• ${cleaned}` : ''
    })
    .join('\n')
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-primary)] mb-3">
        {title}
      </h2>
      {children}
    </section>
  )
}

export function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <div className="mb-3">
      <label className="block text-[13px] font-medium text-[#44403c] mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-premium text-[15px] py-2.5"
      />
    </div>
  )
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
}) {
  return (
    <div className="mb-3">
      <label className="block text-[13px] font-medium text-[#44403c] mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="input-premium resize-y text-[15px] py-2.5"
      />
    </div>
  )
}

export function Editor() {
  const {
    data,
    updateContact,
    updateSummary,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    setSkills,
    setDescriptionFormat,
    setExperienceFormat,
    setEducationFormat,
  } = useResume()

  const { contact, summary, experience, education, skills } = data
  const summaryFmt = data.descriptionFormat ?? 'bullets'
  const expFmt = data.experienceFormat ?? 'bullets'
  const eduFmt = data.educationFormat ?? 'bullets'

  return (
    <div className="p-5 sm:p-6 overflow-y-auto max-h-full">
      <Section title="Contact">
        <Input
          label="Full name"
          value={contact.fullName}
          onChange={(v) => updateContact({ fullName: v })}
          placeholder="Jane Doe"
        />
        <Input
          label="Email"
          type="email"
          value={contact.email}
          onChange={(v) => updateContact({ email: v })}
          placeholder="jane@example.com"
        />
        <Input
          label="Phone"
          value={contact.phone}
          onChange={(v) => updateContact({ phone: v })}
          placeholder="+1 (555) 000-0000"
        />
        <Input
          label="Location"
          value={contact.location}
          onChange={(v) => updateContact({ location: v })}
          placeholder="City, Country"
        />
        <Input
          label="Website"
          value={contact.website}
          onChange={(v) => updateContact({ website: v })}
          placeholder="https://..."
        />
        <Input
          label="LinkedIn"
          value={contact.linkedin}
          onChange={(v) => updateContact({ linkedin: v })}
          placeholder="linkedin.com/in/..."
        />
      </Section>

      <Section title="Professional summary">
        <div className="flex items-center gap-1 bg-[#f5f5f4] rounded-lg p-0.5 mb-3">
          <button
            type="button"
            onClick={() => setDescriptionFormat('bullets')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${summaryFmt === 'bullets' ? 'bg-white text-[#1c1917] shadow-sm' : 'text-[#78716c] hover:text-[#1c1917]'}`}
          >
            Bullets
          </button>
          <button
            type="button"
            onClick={() => setDescriptionFormat('paragraph')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${summaryFmt === 'paragraph' ? 'bg-white text-[#1c1917] shadow-sm' : 'text-[#78716c] hover:text-[#1c1917]'}`}
          >
            Paragraph
          </button>
        </div>
        <TextArea
          label="Summary"
          value={summary}
          onChange={updateSummary}
          placeholder="A few lines about your experience and goals..."
          rows={8}
        />
      </Section>

      <Section title="Experience">
        <div className="flex items-center gap-1 bg-[#f5f5f4] rounded-lg p-0.5 mb-4">
          <button
            type="button"
            onClick={() => setExperienceFormat('bullets')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${expFmt === 'bullets' ? 'bg-white text-[#1c1917] shadow-sm' : 'text-[#78716c] hover:text-[#1c1917]'}`}
          >
            Bullets
          </button>
          <button
            type="button"
            onClick={() => setExperienceFormat('paragraph')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${expFmt === 'paragraph' ? 'bg-white text-[#1c1917] shadow-sm' : 'text-[#78716c] hover:text-[#1c1917]'}`}
          >
            Paragraph
          </button>
        </div>
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
              <Input label="Start" value={exp.startDate} onChange={(v) => updateExperience(exp.id, { startDate: v })} placeholder="Jan 2020" />
              <Input label="End" value={exp.endDate} onChange={(v) => updateExperience(exp.id, { endDate: v })} placeholder="Present" />
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
              rows={4}
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
      </Section>

      <Section title="Education">
        <div className="flex items-center gap-1 bg-[#f5f5f4] rounded-lg p-0.5 mb-3">
          <button
            type="button"
            onClick={() => setEducationFormat('bullets')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${eduFmt === 'bullets' ? 'bg-white text-[#1c1917] shadow-sm' : 'text-[#78716c] hover:text-[#1c1917]'}`}
          >
            Bullets
          </button>
          <button
            type="button"
            onClick={() => setEducationFormat('paragraph')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${eduFmt === 'paragraph' ? 'bg-white text-[#1c1917] shadow-sm' : 'text-[#78716c] hover:text-[#1c1917]'}`}
          >
            Paragraph
          </button>
        </div>
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
              <Input label="Start" value={edu.startDate} onChange={(v) => updateEducation(edu.id, { startDate: v })} />
              <Input label="End" value={edu.endDate} onChange={(v) => updateEducation(edu.id, { endDate: v })} />
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
          className="flex items-center gap-1.5 text-[13px] text-[#f97316] font-semibold hover:underline"
        >
          <span className="text-base leading-none">+</span>
          Add education
        </button>
      </Section>

      <Section title="Skills">
        <div className="mb-2">
          <label className="block text-[13px] font-medium text-[#44403c] mb-1.5">
            One per line or comma-separated
          </label>
          <textarea
            value={skills.join(', ')}
            onChange={(e) => {
              const raw = e.target.value
              const list = raw
                .split(/[\n,]+/)
                .map((s) => s.trim())
                .filter(Boolean)
              setSkills(list)
            }}
            rows={4}
            placeholder="Leadership, Project management, Python, ..."
            className="input-premium resize-y text-[15px] py-2.5"
          />
        </div>
      </Section>
    </div>
  )
}
