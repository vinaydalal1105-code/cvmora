import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing } from './resumeSpacing'

function hasContent(exp: { jobTitle?: string; company?: string; description?: string }) {
  return !!(exp.jobTitle?.trim() || exp.company?.trim() || exp.description?.trim())
}
function hasEduContent(edu: { degree?: string; school?: string; description?: string }) {
  return !!(edu.degree?.trim() || edu.school?.trim() || edu.description?.trim())
}

/** Header: initials in a square box, name, contact on the right. Then standard sections. */
export function InitialsHeaderTemplate({ data, accentColor }: { data: ResumeData; accentColor?: string }) {
  const { contact, summary, experience, education, skills, references } = data
  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const showExperience = experience.some(hasContent)
  const showEducation = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const accent = accentColor ?? '#1e3a5f'
  const initials = name ? name.split(/\s+/).map((n) => n[0]).join('').slice(0, 2) : '—'
  const ph = (s: string) => <span className="text-[#9ca3af]">{s}</span>

  return (
    <div className="initials-header-template bg-white text-[#1c1c1c] pt-10 px-8 pb-6 min-h-0 max-w-[210mm] mx-auto font-sans text-sm">
      <header className="flex items-start gap-4 mb-6 pb-4 border-b-2 border-[#e5e7eb]" style={{ borderBottomColor: accent }}>
        <div
          className="w-14 h-14 shrink-0 flex items-center justify-center text-lg font-bold text-white rounded border-2"
          style={{ backgroundColor: accent, borderColor: accent }}
          aria-hidden
        >
          {initials}
        </div>
        <div className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold text-[#1c1917] tracking-tight uppercase">{name || ph('Your name')}</h1>
          </div>
          <div className="text-[12px] text-[#6b7280] text-left sm:text-right">
            {contact.email || contact.phone || contact.location ? (
              <>
                {contact.email && <div>{contact.email}</div>}
                {contact.phone && <div>{contact.phone}</div>}
                {contact.location && <div>{contact.location}</div>}
              </>
            ) : (
              <div>{ph('Email · Phone · Location')}</div>
            )}
          </div>
        </div>
      </header>

      <section className={resumeSpacing.section}>
        <h2 className={resumeSpacing.sectionHeading}>Professional Summary</h2>
        <p className={resumeSpacing.summary}>{summary || ph('Add a short summary.')}</p>
      </section>

      <section className={resumeSpacing.section}>
        <h2 className={resumeSpacing.sectionHeading}>Skills</h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-1 text-[13px] text-[#333]">
          {skills.filter(Boolean).length > 0 ? skills.filter(Boolean).map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#1c1917] shrink-0" aria-hidden />
              {s}
            </div>
          )) : <p className="text-[13px] text-[#9ca3af] italic">Add your skills</p>}
        </div>
      </section>

      <section className={resumeSpacing.section}>
        <h2 className={resumeSpacing.sectionHeading}>Work History</h2>
        {showExperience ? (
          <div className={resumeSpacing.expWrapper}>
            {experience.filter(hasContent).map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline gap-2 flex-wrap">
                  <span className="font-semibold text-[#1c1c1c]">{exp.jobTitle}</span>
                  <span className="text-[11px] text-[#6b7280]">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-[12px] text-[#4b5563] mt-0.5">
                  {exp.company}
                  {exp.location && ` · ${exp.location}`}
                </div>
                {exp.description && (
                  <ul className={resumeSpacing.bulletList}>
                    {line(exp.description).map((bullet, i) => (
                      <li key={i}>{bullet.replace(/^[•\-]\s*/, '')}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[13px] text-[#9ca3af] italic">Add your work history.</p>
        )}
      </section>

      <section className={resumeSpacing.section}>
        <h2 className={resumeSpacing.sectionHeading}>Education</h2>
        {showEducation ? (
          education.filter(hasEduContent).map((edu) => (
            <div key={edu.id} className={resumeSpacing.eduEntry}>
              <div className="font-semibold text-[#1c1c1c]">{edu.degree}</div>
              <div className="text-[12px] text-[#4b5563] mt-0.5">
                {edu.school}
                {edu.location && ` · ${edu.location}`}
                {edu.startDate && ` · ${edu.startDate} – ${edu.endDate}`}
              </div>
              {edu.description && <p className={resumeSpacing.eduDescriptionSm}>{edu.description}</p>}
            </div>
          ))
        ) : (
          <p className="text-[13px] text-[#9ca3af] italic">Add your education.</p>
        )}
      </section>

      <section>
        <h2 className={resumeSpacing.sectionHeading}>References</h2>
        <div className={resumeSpacing.refBlock}>
          {hasRefs ? references!.map((ref, i) => (
            <div key={i}>
              <span className="font-medium text-[#1c1c1c]">{ref.name}</span>
              {ref.affiliation && <span className="text-[#4b5563]">, {ref.affiliation}</span>}
              {ref.email && <span className="text-[#6b7280]"> · {ref.email}</span>}
              {ref.phone && <span className="text-[#6b7280]"> · {ref.phone}</span>}
            </div>
          )) : (
            <p className="text-[13px] text-[#9ca3af] italic">Add references if needed.</p>
          )}
        </div>
      </section>
    </div>
  )
}
