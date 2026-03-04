import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing } from './resumeSpacing'

function hasContent(exp: { jobTitle?: string; company?: string; description?: string }) {
  return !!(exp.jobTitle?.trim() || exp.company?.trim() || exp.description?.trim())
}
function hasEduContent(edu: { degree?: string; school?: string; description?: string }) {
  return !!(edu.degree?.trim() || edu.school?.trim() || edu.description?.trim())
}

/** Two-column: left sidebar with contact + skills; right column profile, experience, education. */
export function ProficiencyTemplate({ data, accentColor }: { data: ResumeData; accentColor?: string }) {
  const { contact, summary, experience, education, skills, references, jobTarget } = data
  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const showExperience = experience.some(hasContent)
  const showEducation = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const accent = accentColor ?? '#1e40af'
  const initials = name ? name.split(/\s+/).map((n) => n[0]).join('').slice(0, 2) : '—'

  return (
    <div className="proficiency-template bg-white text-[#1c1c1c] h-full min-h-0 max-w-[210mm] mx-auto font-sans text-sm flex">
      <aside className="w-[26%] shrink-0 min-h-full pt-10 px-3 pb-6 flex flex-col" style={{ backgroundColor: `${accent}12` }}>
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white shrink-0 mx-auto mb-4"
          style={{ backgroundColor: accent }}
          aria-hidden
        >
          {initials}
        </div>
        {jobTarget && <p className="text-center text-[12px] font-semibold text-[#1c1c1c] mb-4">{jobTarget}</p>}
        <div className="space-y-3 text-[12px] text-[#4b5563]">
          {contact.email && <div>{contact.email}</div>}
          {contact.phone && <div>{contact.phone}</div>}
          {contact.location && <div>{contact.location}</div>}
        </div>
        {skills.filter(Boolean).length > 0 && (
          <>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#1c1c1c] mt-6 mb-2">Skills</h2>
            <ul className="space-y-1.5 text-[12px] text-[#333] list-disc pl-4">
              {skills.filter(Boolean).map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </>
        )}
      </aside>
      <main className="flex-1 min-w-0 pt-10 px-8 pb-6 border-l border-[#e5e7eb]">
        {name && <h1 className="text-2xl font-bold text-[#1c1917] tracking-tight mb-4">{name}</h1>}

        {summary && (
          <section className={resumeSpacing.section}>
            <h2 className={resumeSpacing.sectionHeading}>Profile</h2>
            <p className={resumeSpacing.summary}>{summary}</p>
          </section>
        )}

        {showExperience && (
          <section className={resumeSpacing.section}>
            <h2 className={resumeSpacing.sectionHeading}>Employment History</h2>
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
          <section className={resumeSpacing.section}>
            <h2 className={resumeSpacing.sectionHeading}>Education</h2>
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
          <section>
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
      </main>
    </div>
  )
}
