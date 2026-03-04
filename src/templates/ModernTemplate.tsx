import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing } from './resumeSpacing'

function hasExpContent(exp: { jobTitle?: string; company?: string; description?: string }) {
  return !!(exp.jobTitle?.trim() || exp.company?.trim() || exp.description?.trim())
}
function hasEduContent(edu: { degree?: string; school?: string; description?: string }) {
  return !!(edu.degree?.trim() || edu.school?.trim() || edu.description?.trim())
}

const DEFAULT_ACCENT = '#2563eb'

export function ModernTemplate({ data, accentColor }: { data: ResumeData; accentColor?: string }) {
  const { jobTarget, contact, summary, experience, education, skills, references } = data
  const accent = accentColor ?? DEFAULT_ACCENT

  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const showExperience = experience.some(hasExpContent)
  const showEducation = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const ph = (s: string) => <span className="text-[#9ca3af]">{s}</span>

  return (
    <div className="modern-template bg-white text-[#1c1c1c] pt-10 px-8 pb-6 min-h-0 max-w-[210mm] mx-auto font-sans text-sm">
      <header className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-[#e5e7eb]">
        <div className="min-w-0">
          <div className="w-12 h-1 rounded-full mb-2" style={{ backgroundColor: accent }} />
          <h1 className="text-2xl font-bold tracking-tight text-[#1c1c1c]">{name || ph('Your name')}</h1>
          <p className="text-[12px] text-[#6b7280] uppercase tracking-wider mt-0.5">{jobTarget?.trim() || ph('Job title')}</p>
        </div>
        <div className="flex items-start gap-4 shrink-0">
          <div className="text-right text-[12px] text-[#6b7280] space-y-0.5">
            {contact.email || contact.phone || contact.address?.trim() || contact.location || contact.website || contact.linkedin ? (
              <>
                {contact.email && <div>{contact.email}</div>}
                {contact.phone && <div>{contact.phone}</div>}
                {contact.address?.trim() && <div>{contact.address.trim()}</div>}
                {contact.location && <div>{contact.location}</div>}
                {contact.website && (
                  <a href={contact.website} className="text-[#2563eb] underline block">{contact.website.replace(/^https?:\/\//, '')}</a>
                )}
                {contact.linkedin && (
                  <a href={contact.linkedin} className="text-[#2563eb] underline block">LinkedIn</a>
                )}
              </>
            ) : (
              <div>{ph('Email · Phone · Location')}</div>
            )}
          </div>
          {contact.photo ? (
            <img src={contact.photo} alt="" className="w-14 h-14 rounded-full object-cover border border-[#e5e7eb]" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-[#f3f4f6] border border-[#e5e7eb]" />
          )}
        </div>
      </header>

      <section className={`${resumeSpacing.section} pl-4 border-l-2`} style={{ borderLeftColor: accent }}>
        <h2 className={resumeSpacing.sectionHeading}>Summary</h2>
        <p className={resumeSpacing.summary}>{summary || ph('Add a short summary of your experience and goals.')}</p>
      </section>

      <section className={resumeSpacing.section}>
        <h2 className={resumeSpacing.sectionHeading}>Experience</h2>
        {showExperience ? (
          <div className={resumeSpacing.expWrapper}>
            {experience.filter(hasExpContent).map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline gap-2 flex-wrap">
                  <span className="font-semibold text-[#1c1c1c]">{exp.jobTitle}</span>
                  <span className="text-[11px] text-[#6b7280]">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-[12px] text-[#4b5563] font-medium mt-0.5">
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
              <span className="font-semibold text-[#1c1c1c]">{edu.degree}</span>
              <span className="text-[#4b5563]"> — {edu.school}</span>
              {(edu.location || edu.startDate) && (
                <span className="text-[12px] text-[#6b7280]">
                  {' '}
                  · {[edu.location, `${edu.startDate} – ${edu.endDate}`].filter(Boolean).join(' · ')}
                </span>
              )}
              {edu.description && (
                <p className={resumeSpacing.eduDescriptionSm}>{edu.description}</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-[13px] text-[#9ca3af] italic">Add your education.</p>
        )}
      </section>

      <section className={resumeSpacing.section}>
        <h2 className={resumeSpacing.sectionHeading}>Skills</h2>
        <div className="flex flex-wrap gap-2">
          {skills.filter(Boolean).length > 0 ? skills.filter(Boolean).map((s, i) => (
            <span
              key={i}
              className="px-2.5 py-0.5 rounded-full bg-[#f3f4f6] text-[12px] text-[#374151] border border-[#e5e7eb]"
            >
              {s}
            </span>
          )) : (
            <span className="text-[13px] text-[#9ca3af] italic">Add your skills</span>
          )}
        </div>
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
