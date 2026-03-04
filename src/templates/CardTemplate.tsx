import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing } from './resumeSpacing'

function hasContent(exp: { jobTitle?: string; company?: string; description?: string }) {
  return !!(exp.jobTitle?.trim() || exp.company?.trim() || exp.description?.trim())
}
function hasEduContent(edu: { degree?: string; school?: string; description?: string }) {
  return !!(edu.degree?.trim() || edu.school?.trim() || edu.description?.trim())
}

export function CardTemplate({ data, accentColor }: { data: ResumeData; accentColor?: string }) {
  const { contact, summary, experience, education, skills, references, jobTarget } = data
  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const showExp = experience.some(hasContent)
  const showEdu = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const accent = accentColor ?? '#0369a1'
  const cardCls = 'rounded-lg border p-3 mb-2'
  const cardStyle = { borderColor: `${accent}30`, backgroundColor: '#fafafa' }

  return (
    <div className="card-template bg-white text-[#1c1c1c] pt-6 px-8 pb-5 min-h-0 max-w-[210mm] mx-auto font-sans text-sm overflow-hidden">
      <header className="mb-4">
        {name && <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight">{name}</h1>}
        {jobTarget?.trim() && <p className="text-[12px] font-medium text-[#475569] mt-0.5">{jobTarget.trim()}</p>}
        <div className="flex flex-wrap gap-x-4 text-[12px] text-[#64748b] mt-2">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {contact.location && <span>{contact.location}</span>}
        </div>
      </header>
      {summary && (
        <section className={cardCls} style={cardStyle}>
          <h2 className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>Summary</h2>
          <p className={resumeSpacing.summary}>{summary}</p>
        </section>
      )}
      {skills.filter(Boolean).length > 0 && (
        <section className={cardCls} style={cardStyle}>
          <h2 className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>Skills</h2>
          <div className="flex flex-wrap gap-2 text-[13px] text-[#334155]">
            {skills.filter(Boolean).map((s, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-white border border-[#e2e8f0]">{s}</span>
            ))}
          </div>
        </section>
      )}
      {showExp && (
        <section className={cardCls} style={cardStyle}>
          <h2 className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>Experience</h2>
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
        <section className={cardCls} style={cardStyle}>
          <h2 className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>Education</h2>
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
        <section className={cardCls} style={cardStyle}>
          <h2 className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>References</h2>
          <div className={resumeSpacing.refBlock}>
            {references!.map((ref, i) => (
              <div key={i} className="break-words min-w-0">
                <span className="font-medium text-[#0f172a]">{ref.name}</span>
                {ref.affiliation && <span className="text-[#475569]">, {ref.affiliation}</span>}
                {ref.email && <span className="text-[#64748b] break-all"> · {ref.email}</span>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
