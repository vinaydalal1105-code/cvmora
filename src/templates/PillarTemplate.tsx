import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing } from './resumeSpacing'

function hasContent(exp: { jobTitle?: string; company?: string; description?: string }) {
  return !!(exp.jobTitle?.trim() || exp.company?.trim() || exp.description?.trim())
}
function hasEduContent(edu: { degree?: string; school?: string; description?: string }) {
  return !!(edu.degree?.trim() || edu.school?.trim() || edu.description?.trim())
}

/** Narrow left accent pillar; name and content in main area. Editorial, modern. */
export function PillarTemplate({ data, accentColor }: { data: ResumeData; accentColor?: string }) {
  const { contact, summary, experience, education, skills, references, jobTarget } = data
  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const showExp = experience.some(hasContent)
  const showEdu = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const accent = accentColor ?? '#0f766e'

  return (
    <div className="pillar-template bg-white text-[#1c1c1c] h-full min-h-0 max-w-[210mm] mx-auto font-sans text-sm flex">
      <div className="w-[5%] min-w-[12px] shrink-0 self-stretch" style={{ backgroundColor: accent }} aria-hidden />
      <div className="flex-1 min-w-0 pt-10 px-8 pb-6">
        {name && (
          <h1 className="text-[22px] font-bold text-[#0f172a] tracking-tight pl-3" style={{ borderLeft: `4px solid ${accent}` }}>
            {name}
          </h1>
        )}
        {jobTarget?.trim() && <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b] mt-1 pl-3">{jobTarget.trim()}</p>}
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[12px] text-[#64748b] mt-3 pl-3 mb-6">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {contact.location && <span>{contact.location}</span>}
        </div>

        {summary && (
          <section className={resumeSpacing.section}>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f172a] mb-1.5" style={{ color: accent }}>Summary</h2>
            <p className={resumeSpacing.summary}>{summary}</p>
          </section>
        )}

        {skills.filter(Boolean).length > 0 && (
          <section className={resumeSpacing.section}>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5" style={{ color: accent }}>Skills</h2>
            <div className="flex flex-wrap gap-2 mt-1">
              {skills.filter(Boolean).map((s, i) => (
                <span key={i} className="text-[12px] px-2 py-0.5 rounded-sm border" style={{ borderColor: accent, color: '#334155' }}>{s}</span>
              ))}
            </div>
          </section>
        )}

        {showExp && (
          <section className={resumeSpacing.section}>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5" style={{ color: accent }}>Experience</h2>
            <div className={resumeSpacing.expWrapper}>
              {experience.filter(hasContent).map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline gap-2 flex-wrap">
                    <span className="font-semibold text-[#0f172a]">{exp.jobTitle}</span>
                    <span className="text-[11px] text-[#64748b]">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <div className="text-[12px] text-[#475569] mt-0.5">{exp.company}{exp.location && ` · ${exp.location}`}</div>
                  {exp.description && (
                    <ul className={resumeSpacing.bulletList}>
                      {line(exp.description).map((b, i) => <li key={i}>{b.replace(/^[•\-]\s*/, '')}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {showEdu && (
          <section className={resumeSpacing.section}>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5" style={{ color: accent }}>Education</h2>
            {education.filter(hasEduContent).map((edu) => (
              <div key={edu.id} className={resumeSpacing.eduEntry}>
                <div className="font-semibold text-[#0f172a]">{edu.degree}</div>
                <div className="text-[12px] text-[#475569] mt-0.5">{edu.school}{edu.location && ` · ${edu.location}`}</div>
                {edu.description && <p className={resumeSpacing.eduDescriptionSm}>{edu.description}</p>}
              </div>
            ))}
          </section>
        )}

        {hasRefs && (
          <section>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5" style={{ color: accent }}>References</h2>
            <div className={resumeSpacing.refBlock}>
              {references!.map((ref, i) => (
                <div key={i}>
                  <span className="font-medium text-[#0f172a]">{ref.name}</span>
                  {ref.affiliation && <span className="text-[#475569]">, {ref.affiliation}</span>}
                  {ref.email && <span className="text-[#64748b]"> · {ref.email}</span>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
