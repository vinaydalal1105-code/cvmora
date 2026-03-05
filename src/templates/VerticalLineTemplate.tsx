import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing } from './resumeSpacing'

function hasContent(exp: { jobTitle?: string; company?: string; description?: string }) {
  return !!(exp.jobTitle?.trim() || exp.company?.trim() || exp.description?.trim())
}
function hasEduContent(edu: { degree?: string; school?: string; description?: string }) {
  return !!(edu.degree?.trim() || edu.school?.trim() || edu.description?.trim())
}

/** Thin vertical accent line on the left; section titles and content with left border accent. */
export function VerticalLineTemplate({ data, accentColor }: { data: ResumeData; accentColor?: string }) {
  const { contact, summary, experience, education, skills, references } = data
  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const showExperience = experience.some(hasContent)
  const showEducation = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const hasSummary = !!(summary?.trim())
  const hasSkills = skills.filter(Boolean).length > 0
  const accent = accentColor ?? '#059669'
  const ph = (s: string) => <span className="text-[#9ca3af]">{s}</span>

  return (
    <div className="vertical-line-template bg-white text-[#1c1c1c] h-full min-h-0 max-w-[210mm] mx-auto font-sans text-sm flex">
      <div className="w-1 shrink-0 self-stretch" style={{ backgroundColor: accent }} aria-hidden />
      <div className="flex-1 min-w-0 pt-10 px-8 pb-6">
        <h1 className="text-2xl font-bold text-[#1c1917] tracking-tight uppercase">{name || ph('Your name')}</h1>
        <div className="flex flex-wrap gap-x-4 text-[12px] text-[#6b7280] mt-1 mb-4">
          {contact.email || contact.phone || contact.location ? (
            <>
              {contact.email && <span>{contact.email}</span>}
              {contact.phone && <span>{contact.phone}</span>}
              {contact.location && <span>{contact.location}</span>}
            </>
          ) : (
            ph('Email · Phone · Location')
          )}
        </div>

        {hasSummary && (
          <section className={`${resumeSpacing.section} pl-4 border-l-2`} style={{ borderLeftColor: accent }}>
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#1c1c1c] mb-1.5">Professional Summary</h2>
            <p className={resumeSpacing.summary}>{summary}</p>
          </section>
        )}

        {hasSkills && (
          <section className={`${resumeSpacing.section} pl-4 border-l-2`} style={{ borderLeftColor: accent }}>
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#1c1c1c] mb-1.5">Skills</h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-1 text-[13px] text-[#333]">
              {skills.filter(Boolean).map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: accent }} aria-hidden />
                  {s}
                </div>
              ))}
            </div>
          </section>
        )}

        {showExperience && (
          <section className={`${resumeSpacing.section} pl-4 border-l-2`} style={{ borderLeftColor: accent }}>
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#1c1c1c] mb-1.5">Work History</h2>
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
          </section>
        )}

        {showEducation && (
          <section className={`${resumeSpacing.section} pl-4 border-l-2`} style={{ borderLeftColor: accent }}>
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#1c1c1c] mb-1.5">Education</h2>
            {education.filter(hasEduContent).map((edu) => (
              <div key={edu.id} className={resumeSpacing.eduEntry}>
                <div className="font-semibold text-[#1c1c1c]">{edu.degree}</div>
                <div className="text-[12px] text-[#4b5563] mt-0.5">
                  {edu.school}
                  {edu.location && ` · ${edu.location}`}
                  {edu.startDate && ` · ${edu.startDate} – ${edu.endDate}`}
                </div>
                {edu.description && <p className={resumeSpacing.eduDescriptionSm}>{edu.description}</p>}
              </div>
            ))}
          </section>
        )}

        {hasRefs && (
          <section className={`pl-4 border-l-2`} style={{ borderLeftColor: accent }}>
            <h2 className={resumeSpacing.sectionHeading}>References</h2>
            <div className={resumeSpacing.refBlock}>
              {references!.map((ref, i) => (
                <div key={i}>
                  <span className="font-medium text-[#1c1c1c]">{ref.name}</span>
                  {ref.affiliation && <span className="text-[#4b5563]">, {ref.affiliation}</span>}
                  {ref.email && <span className="text-[#6b7280]"> · {ref.email}</span>}
                  {ref.phone && <span className="text-[#6b7280]"> · {ref.phone}</span>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
