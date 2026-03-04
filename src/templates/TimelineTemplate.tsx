import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing } from './resumeSpacing'

function hasContent(exp: { jobTitle?: string; company?: string; description?: string }) {
  return !!(exp.jobTitle?.trim() || exp.company?.trim() || exp.description?.trim())
}
function hasEduContent(edu: { degree?: string; school?: string; description?: string }) {
  return !!(edu.degree?.trim() || edu.school?.trim() || edu.description?.trim())
}

export function TimelineTemplate({ data, accentColor }: { data: ResumeData; accentColor?: string }) {
  const { contact, summary, experience, education, skills, references, jobTarget } = data
  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const showExp = experience.some(hasContent)
  const showEdu = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const accent = accentColor ?? '#0d9488'
  const dotCls = 'absolute left-0 top-0.5 w-2.5 h-2.5 rounded-full -translate-x-[calc(0.625rem+5px)]'

  return (
    <div className="timeline-template bg-white text-[#1c1c1c] pt-8 px-8 pb-6 min-h-0 max-w-[210mm] mx-auto font-sans text-sm">
      <header className="mb-6 pb-4 border-b-2" style={{ borderColor: accent }}>
        {name && <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight">{name}</h1>}
        {jobTarget?.trim() && <p className="text-[13px] text-[#475569] mt-0.5">{jobTarget.trim()}</p>}
        <div className="flex flex-wrap gap-x-4 text-[12px] text-[#64748b] mt-2">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {contact.location && <span>{contact.location}</span>}
        </div>
      </header>
      {summary && (
        <section className={resumeSpacing.section}>
          <h2 className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>Summary</h2>
          <p className={resumeSpacing.summary}>{summary}</p>
        </section>
      )}
      {skills.filter(Boolean).length > 0 && (
        <section className={resumeSpacing.section}>
          <h2 className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>Skills</h2>
          <p className="text-[13px] text-[#334155] leading-relaxed">{skills.filter(Boolean).join(' · ')}</p>
        </section>
      )}
      {showExp && (
        <section className={resumeSpacing.section}>
          <h2 className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>Experience</h2>
          <div className="relative pl-5 border-l-2 space-y-4" style={{ borderColor: accent }}>
            {experience.filter(hasContent).map((exp) => (
              <div key={exp.id} className="relative">
                <span className={dotCls} style={{ backgroundColor: accent }} aria-hidden />
                <div className="text-[11px] font-semibold text-[#64748b]">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
                <div className="font-semibold text-[#0f172a] mt-0.5">{exp.jobTitle}</div>
                <div className="text-[12px] text-[#475569]">{exp.company}{exp.location && ` · ${exp.location}`}</div>
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
          <h2 className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>Education</h2>
          <div className="relative pl-5 border-l-2 space-y-3" style={{ borderColor: accent }}>
            {education.filter(hasEduContent).map((edu) => (
              <div key={edu.id} className="relative">
                <span className={dotCls} style={{ backgroundColor: accent }} aria-hidden />
                <div className="font-semibold text-[#0f172a]">{edu.degree}</div>
                <div className="text-[12px] text-[#475569] mt-0.5">{edu.school}{edu.location && ` · ${edu.location}`}</div>
                {edu.description && <p className={resumeSpacing.eduDescriptionSm}>{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
      {hasRefs && (
        <section>
          <h2 className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>References</h2>
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
  )
}
