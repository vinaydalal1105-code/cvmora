import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing } from './resumeSpacing'

function hasContent(exp: { jobTitle?: string; company?: string; description?: string }) {
  return !!(exp.jobTitle?.trim() || exp.company?.trim() || exp.description?.trim())
}
function hasEduContent(edu: { degree?: string; school?: string; description?: string }) {
  return !!(edu.degree?.trim() || edu.school?.trim() || edu.description?.trim())
}

/** Centered name and contact; section titles centered with short accent underline under text only. */
export function ElegantTemplate({ data, accentColor }: { data: ResumeData; accentColor?: string }) {
  const { contact, summary, experience, education, skills, references } = data
  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const showExp = experience.some(hasContent)
  const showEdu = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const accent = accentColor ?? '#1e3a5f'

  const CenteredHeading = ({ title }: { title: string }) => (
    <h2 className="text-center mb-2">
      <span className="text-[11px] font-bold uppercase tracking-widest text-[#1c1c1c] inline-block pb-1 border-b-2" style={{ borderBottomColor: accent }}>
        {title}
      </span>
    </h2>
  )

  return (
    <div className="elegant-template bg-white text-[#1c1c1c] pt-10 px-8 pb-6 min-h-0 max-w-[210mm] mx-auto font-sans text-sm">
      <header className="text-center mb-8">
        {name && <h1 className="text-2xl font-bold text-[#1c1917] tracking-tight">{name}</h1>}
        <div className="flex flex-wrap justify-center gap-x-4 text-[12px] text-[#6b7280] mt-2">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {contact.location && <span>{contact.location}</span>}
        </div>
      </header>

      {summary && (
        <section className={resumeSpacing.section}>
          <CenteredHeading title="Professional Summary" />
          <p className={`${resumeSpacing.summary} text-center max-w-[85%] mx-auto`}>{summary}</p>
        </section>
      )}

      {skills.filter(Boolean).length > 0 && (
        <section className={resumeSpacing.section}>
          <CenteredHeading title="Skills" />
          <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-2 text-[13px] text-[#333] max-w-[90%] mx-auto">
            {skills.filter(Boolean).map((s, i) => (
              <div key={i} className="flex items-center justify-center gap-2">
                <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: accent }} aria-hidden />
                {s}
              </div>
            ))}
          </div>
        </section>
      )}

      {showExp && (
        <section className={resumeSpacing.section}>
          <CenteredHeading title="Work History" />
          <div className={resumeSpacing.expWrapper} style={{ maxWidth: '95%', margin: '0 auto' }}>
            {experience.filter(hasContent).map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline gap-2 flex-wrap">
                  <span className="font-semibold text-[#1c1c1c]">{exp.jobTitle}</span>
                  <span className="text-[11px] text-[#6b7280]">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div className="text-[12px] text-[#4b5563] mt-0.5">{exp.company}{exp.location && ` · ${exp.location}`}</div>
                {exp.description && (
                  <ul className={resumeSpacing.bulletList}>
                    {line(exp.description).map((b, i) => (
                      <li key={i}>{b.replace(/^[•\-]\s*/, '')}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {showEdu && (
        <section className={resumeSpacing.section}>
          <CenteredHeading title="Education" />
          <div style={{ maxWidth: '95%', margin: '0 auto' }}>
            {education.filter(hasEduContent).map((edu) => (
              <div key={edu.id} className={resumeSpacing.eduEntry}>
                <div className="font-semibold text-[#1c1c1c]">{edu.degree}</div>
                <div className="text-[12px] text-[#4b5563] mt-0.5">{edu.school}{edu.location && ` · ${edu.location}`}</div>
                {edu.description && <p className={resumeSpacing.eduDescriptionSm}>{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {hasRefs && (
        <section>
          <CenteredHeading title="References" />
          <div className={resumeSpacing.refBlock} style={{ maxWidth: '95%', margin: '0 auto' }}>
            {references!.map((ref, i) => (
              <div key={i} className="text-center">
                <span className="font-medium text-[#1c1c1c]">{ref.name}</span>
                {ref.affiliation && <span className="text-[#4b5563]">, {ref.affiliation}</span>}
                {ref.email && <span className="text-[#6b7280]"> · {ref.email}</span>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
