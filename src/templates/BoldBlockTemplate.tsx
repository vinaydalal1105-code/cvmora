import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing } from './resumeSpacing'

function hasContent(exp: { jobTitle?: string; company?: string; description?: string }) {
  return !!(exp.jobTitle?.trim() || exp.company?.trim() || exp.description?.trim())
}
function hasEduContent(edu: { degree?: string; school?: string; description?: string }) {
  return !!(edu.degree?.trim() || edu.school?.trim() || edu.description?.trim())
}
function isLightBg(hex: string): boolean {
  const h = hex.replace(/^#/, '')
  if (h.length !== 6) return false
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255
  return 0.299 * r + 0.587 * g + 0.114 * b > 0.55
}

export function BoldBlockTemplate({ data, accentColor }: { data: ResumeData; accentColor?: string }) {
  const { contact, summary, experience, education, skills, references, jobTarget } = data
  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const showExp = experience.some(hasContent)
  const showEdu = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const accent = accentColor ?? '#1e293b'
  const light = isLightBg(accent)
  const headerCls = light ? 'text-[#1c1917]' : 'text-white'
  const labelCls = light ? 'text-[#1c1917]' : 'text-white'

  const H = ({ t }: { t: string }) => (
    <h2 className={`text-[11px] font-bold uppercase tracking-widest py-1.5 px-3 mb-2 inline-block ${labelCls}`} style={{ backgroundColor: accent }}>{t}</h2>
  )

  return (
    <div className="bold-block-template bg-white text-[#1c1c1c] min-h-0 max-w-[210mm] mx-auto font-sans text-sm">
      <header className={`py-5 px-8 mb-6 ${headerCls}`} style={{ backgroundColor: accent }}>
        {name && <h1 className="text-[24px] font-bold tracking-tight">{name}</h1>}
        {jobTarget?.trim() && <p className="text-[13px] opacity-90 mt-1">{jobTarget.trim()}</p>}
        <div className="flex flex-wrap gap-x-4 text-[12px] opacity-85 mt-3">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {contact.location && <span>{contact.location}</span>}
        </div>
      </header>
      <div className="px-8 pb-6">
      {summary && (<section className={resumeSpacing.section}><H t="Summary" /><p className={resumeSpacing.summary}>{summary}</p></section>)}
      {skills.filter(Boolean).length > 0 && (
        <section className={resumeSpacing.section}>
          <H t="Skills" />
          <div className="flex flex-wrap gap-2 mt-1 text-[13px] text-[#334155]">
            {skills.filter(Boolean).map((s, i) => (<span key={i} className="px-2.5 py-0.5 border-2 font-medium" style={{ borderColor: accent }}>{s}</span>))}
          </div>
        </section>
      )}
      {showExp && (
        <section className={resumeSpacing.section}>
          <H t="Experience" />
          <div className={resumeSpacing.expWrapper}>
            {experience.filter(hasContent).map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline gap-2 flex-wrap">
                  <span className="font-bold text-[#0f172a]">{exp.jobTitle}</span>
                  <span className="text-[11px] text-[#64748b]">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div className="text-[12px] text-[#475569] mt-0.5">{exp.company}{exp.location && ` · ${exp.location}`}</div>
                {exp.description && (<ul className={resumeSpacing.bulletList}>{line(exp.description).map((b, i) => (<li key={i}>{b.replace(/^[•\-]\s*/, '')}</li>))}</ul>)}
              </div>
            ))}
          </div>
        </section>
      )}
      {showEdu && (
        <section className={resumeSpacing.section}>
          <H t="Education" />
          {education.filter(hasEduContent).map((edu) => (
            <div key={edu.id} className={resumeSpacing.eduEntry}>
              <div className="font-bold text-[#0f172a]">{edu.degree}</div>
              <div className="text-[12px] text-[#475569] mt-0.5">{edu.school}{edu.location && ` · ${edu.location}`}</div>
              {edu.description && <p className={resumeSpacing.eduDescriptionSm}>{edu.description}</p>}
            </div>
          ))}
        </section>
      )}
      {hasRefs && (
        <section>
          <H t="References" />
          <div className={resumeSpacing.refBlock}>
            {references!.map((ref, i) => (
              <div key={i}><span className="font-medium text-[#0f172a]">{ref.name}</span>{ref.affiliation && <span className="text-[#475569]">, {ref.affiliation}</span>}{ref.email && <span className="text-[#64748b]"> · {ref.email}</span>}</div>
            ))}
          </div>
        </section>
      )}
      </div>
    </div>
  )
}
