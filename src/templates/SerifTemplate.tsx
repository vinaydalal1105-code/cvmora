import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing } from './resumeSpacing'

function hasContent(exp: { jobTitle?: string; company?: string; description?: string }) {
  return !!(exp.jobTitle?.trim() || exp.company?.trim() || exp.description?.trim())
}
function hasEduContent(edu: { degree?: string; school?: string; description?: string }) {
  return !!(edu.degree?.trim() || edu.school?.trim() || edu.description?.trim())
}

/** Serif headings for name and section titles; body in sans-serif. Elegant, distinctive. */
export function SerifTemplate({ data, accentColor }: { data: ResumeData; accentColor?: string }) {
  const { contact, summary, experience, education, skills, references, jobTarget } = data
  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const showExp = experience.some(hasContent)
  const showEdu = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const accent = accentColor ?? '#1e3a5f'

  return (
    <div className="serif-template bg-white text-[#1c1c1c] pt-10 px-8 pb-6 min-h-0 max-w-[210mm] mx-auto text-sm">
      <header className="border-b pb-5 mb-6" style={{ borderColor: `${accent}25` }}>
        {name && <h1 className="text-[26px] font-normal text-[#0f172a] tracking-tight" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>{name}</h1>}
        {jobTarget?.trim() && <p className="text-[13px] text-[#475569] mt-1 font-sans">{jobTarget.trim()}</p>}
        <div className="flex flex-wrap gap-x-5 gap-y-0.5 text-[12px] text-[#64748b] mt-3 font-sans">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {contact.location && <span>{contact.location}</span>}
        </div>
      </header>

      {summary && (
        <section className={resumeSpacing.section}>
          <h2 className="text-[12px] font-normal uppercase tracking-[0.2em] text-[#1e293b] mb-2 font-serif" style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: accent }}>Summary</h2>
          <p className={`${resumeSpacing.summary} font-sans`}>{summary}</p>
        </section>
      )}

      {skills.filter(Boolean).length > 0 && (
        <section className={resumeSpacing.section}>
          <h2 className="text-[12px] font-normal uppercase tracking-[0.2em] text-[#1e293b] mb-2 font-serif" style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: accent }}>Skills</h2>
          <p className="font-sans text-[13px] text-[#334155] leading-relaxed">{skills.filter(Boolean).join(' · ')}</p>
        </section>
      )}

      {showExp && (
        <section className={resumeSpacing.section}>
          <h2 className="text-[12px] font-normal uppercase tracking-[0.2em] text-[#1e293b] mb-2 font-serif" style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: accent }}>Experience</h2>
          <div className={resumeSpacing.expWrapper}>
            {experience.filter(hasContent).map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline gap-2 flex-wrap">
                  <span className="font-semibold text-[#0f172a] font-sans">{exp.jobTitle}</span>
                  <span className="text-[11px] text-[#64748b] font-sans">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div className="text-[12px] text-[#475569] mt-0.5 font-sans">{exp.company}{exp.location && ` · ${exp.location}`}</div>
                {exp.description && (
                  <ul className={resumeSpacing.bulletList}>
                    {line(exp.description).map((b, i) => <li key={i} className="font-sans">{b.replace(/^[•\-]\s*/, '')}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {showEdu && (
        <section className={resumeSpacing.section}>
          <h2 className="text-[12px] font-normal uppercase tracking-[0.2em] text-[#1e293b] mb-2 font-serif" style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: accent }}>Education</h2>
          {education.filter(hasEduContent).map((edu) => (
            <div key={edu.id} className={resumeSpacing.eduEntry}>
              <div className="font-semibold text-[#0f172a] font-sans">{edu.degree}</div>
              <div className="text-[12px] text-[#475569] mt-0.5 font-sans">{edu.school}{edu.location && ` · ${edu.location}`}</div>
              {edu.description && <p className={`${resumeSpacing.eduDescriptionSm} font-sans`}>{edu.description}</p>}
            </div>
          ))}
        </section>
      )}

      {hasRefs && (
        <section>
          <h2 className="text-[12px] font-normal uppercase tracking-[0.2em] text-[#1e293b] mb-2 font-serif" style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: accent }}>References</h2>
          <div className={`${resumeSpacing.refBlock} font-sans`}>
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
  )
}
