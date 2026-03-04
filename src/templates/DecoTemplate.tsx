import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing } from './resumeSpacing'

function hasContent(exp: { jobTitle?: string; company?: string; description?: string }) {
  return !!(exp.jobTitle?.trim() || exp.company?.trim() || exp.description?.trim())
}
function hasEduContent(edu: { degree?: string; school?: string; description?: string }) {
  return !!(edu.degree?.trim() || edu.school?.trim() || edu.description?.trim())
}

function SectionTitle({ title, accent }: { title: string; accent: string }) {
  return (
    <h2 className="flex items-center gap-2 mb-1.5 pb-0.5 border-b-2 text-[11px] font-bold uppercase tracking-widest text-[#1c1c1c]" style={{ borderBottomColor: accent }}>
      <span className="w-1 h-4 shrink-0 rounded-sm" style={{ backgroundColor: accent }} aria-hidden />
      {title}
    </h2>
  )
}

/** Name left with accent underline; decorative icon on right. Section titles with left bar + underline. */
export function DecoTemplate({ data, accentColor }: { data: ResumeData; accentColor?: string }) {
  const { contact, summary, experience, education, skills, references } = data
  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const showExperience = experience.some(hasContent)
  const showEducation = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const accent = accentColor ?? '#0ea5e9'

  return (
    <div className="deco-template bg-white text-[#1c1c1c] pt-10 px-8 pb-6 min-h-0 max-w-[210mm] mx-auto font-sans text-sm">
      <header className="flex items-start justify-between gap-4 mb-6">
        <div className="min-w-0 flex-1">
          {name && (
            <h1 className="text-2xl font-bold text-[#1c1917] tracking-tight uppercase pb-1 border-b-2" style={{ borderBottomColor: accent }}>{name}</h1>
          )}
          <div className="flex flex-wrap gap-x-4 text-[12px] text-[#6b7280] mt-2">
            {contact.email && <span>{contact.email}</span>}
            {contact.phone && <span>{contact.phone}</span>}
            {contact.location && <span>{contact.location}</span>}
          </div>
        </div>
        <div className="shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center opacity-80" style={{ borderColor: accent }} aria-hidden>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round">
            <path d="M12 2L15 8.5L22 9L17 14L18.5 21L12 18L5.5 21L7 14L2 9L9 8.5L12 2Z" />
          </svg>
        </div>
      </header>

      {summary && (
        <section className={resumeSpacing.section}>
          <SectionTitle title="Professional Summary" accent={accent} />
          <p className={resumeSpacing.summary}>{summary}</p>
        </section>
      )}

      {skills.filter(Boolean).length > 0 && (
        <section className={resumeSpacing.section}>
          <SectionTitle title="Skills" accent={accent} />
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-1 text-[13px] text-[#333]">
            {skills.filter(Boolean).map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rotate-45 shrink-0 bg-[#94a3b8]" aria-hidden />
                {s}
              </div>
            ))}
          </div>
        </section>
      )}

      {showExperience && (
        <section className={resumeSpacing.section}>
          <SectionTitle title="Work History" accent={accent} />
          <div className={resumeSpacing.expWrapper}>
            {experience.filter(hasContent).map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline gap-2 flex-wrap">
                  <span className="font-semibold text-[#1c1c1c]">{exp.jobTitle}</span>
                  <span className="text-[11px] text-[#6b7280]">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div className="text-[12px] text-[#4b5563] mt-0.5">{exp.company}{exp.location && ` · ${exp.location}`}</div>
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
        <section className={resumeSpacing.section}>
          <SectionTitle title="Education" accent={accent} />
          {education.filter(hasEduContent).map((edu) => (
            <div key={edu.id} className={resumeSpacing.eduEntry}>
              <div className="font-semibold text-[#1c1c1c]">{edu.degree}</div>
              <div className="text-[12px] text-[#4b5563] mt-0.5">{edu.school}{edu.location && ` · ${edu.location}`}{edu.startDate && ` · ${edu.startDate} – ${edu.endDate}`}</div>
              {edu.description && <p className={resumeSpacing.eduDescriptionSm}>{edu.description}</p>}
            </div>
          ))}
        </section>
      )}

      {hasRefs && (
        <section>
          <SectionTitle title="References" accent={accent} />
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
  )
}
