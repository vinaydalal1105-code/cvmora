import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing, textSafeAccent } from './resumeSpacing'

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
  const safeAccent = textSafeAccent(accent)
  const light = isLightBg(accent)
  const headerCls = light ? 'text-[#0f172a]' : 'text-white'
  const headerMuted = light ? 'text-[#1e293b]' : 'text-white/80'
  const labelCls = light ? 'text-[#0f172a]' : 'text-white'

  const H = ({ t }: { t: string }) => (
    <h2 className={`text-[10.5px] font-bold uppercase tracking-[0.2em] py-1.5 px-3 mb-3 inline-block rounded-sm ${labelCls}`} style={{ backgroundColor: accent }}>{t}</h2>
  )

  return (
    <div className="bold-block-template bg-white text-[#1a1a1a] min-h-[842px] max-w-[210mm] mx-auto font-sans text-[13px] leading-[1.55] overflow-visible">
      <header className={`py-6 px-8 ${headerCls}`} style={{ backgroundColor: accent }}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {name && <h1 className="text-[26px] font-extrabold tracking-tight">{name}</h1>}
            {jobTarget?.trim() && <p className={`text-[12px] font-medium mt-1 ${headerMuted}`}>{jobTarget.trim()}</p>}
          </div>
          {contact.photo && (
            <img src={contact.photo} alt="" className="w-14 h-14 rounded-lg object-cover border-2 border-white/30 shrink-0" />
          )}
        </div>
        <div className={`flex flex-wrap gap-x-4 text-[11px] mt-3 ${headerMuted}`}>
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {(contact.address?.trim() || contact.location) && <span>{(contact.address?.trim() || contact.location)}</span>}
        </div>
      </header>

      <div className="px-8 py-6">
        {summary && (
          <section className={resumeSpacing.section}>
            <H t="Summary" />
            {data.descriptionFormat === 'bullets' && summary.includes('\n') ? (
              <ul className="list-disc ml-4 text-[12.5px] text-[#374151] space-y-1 summary-desc leading-[1.65]">
                {summary.split('\n').filter((l) => l.trim()).map((l, i) => (
                  <li key={i}>{l.replace(/^[•\-]\s*/, '').trim()}</li>
                ))}
              </ul>
            ) : (
              <p className={resumeSpacing.summary}>{summary}</p>
            )}
          </section>
        )}

        {skills.filter(Boolean).length > 0 && (
          <section className={resumeSpacing.section}>
            <H t="Skills" />
            <div className="flex flex-wrap gap-1.5 mt-1">
              {skills.filter(Boolean).map((s, i) => (
                <span key={i} className="px-2.5 py-[3px] border-2 font-semibold text-[11px] rounded-sm" style={{ borderColor: accent, color: safeAccent }}>{s}</span>
              ))}
            </div>
          </section>
        )}

        {showExp && (
          <section className={resumeSpacing.section}>
            <H t="Experience" />
            <div className={resumeSpacing.expWrapper}>
              {experience.filter(hasContent).map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline gap-2 flex-nowrap">
                    <span className="font-extrabold text-[#0f172a] min-w-0 truncate">{exp.jobTitle}</span>
                    <span className="text-[10.5px] text-[#94a3b8] whitespace-nowrap shrink-0 font-medium">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <div className="text-[11.5px] text-[#64748b] mt-0.5 font-medium">{exp.company}{exp.location && ` · ${exp.location}`}</div>
                  {exp.description && (
                    <ul className={`${resumeSpacing.bulletList} exp-desc`}>
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
            <H t="Education" />
            {education.filter(hasEduContent).map((edu) => (
              <div key={edu.id} className={resumeSpacing.eduEntry} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <div className="font-extrabold text-[#0f172a]">{edu.degree}</div>
                <div className="flex justify-between items-baseline gap-x-2 mt-0.5">
                  <span className="text-[11.5px] text-[#64748b] font-medium">
                    {edu.school}
                    {edu.location && ` · ${edu.location}`}
                  </span>
                  {edu.startDate && (
                    <span className="text-[10.5px] text-[#94a3b8] whitespace-nowrap shrink-0 ml-auto">{edu.startDate} – {edu.endDate}</span>
                  )}
                </div>
                {edu.description && (
                  <ul className="list-disc ml-4 mt-1 text-[12px] text-[#374151] space-y-0.5 edu-desc leading-[1.6]">
                    {edu.description.split('\n').filter(Boolean).map((line, j) => (
                      <li key={j}>{line}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {hasRefs && (
          <section>
            <H t="References" />
            <div className={resumeSpacing.refBlock}>
              {references!.map((ref, i) => (
                <div key={i}>
                  <span className="font-semibold text-[#0f172a]">{ref.name}</span>
                  {ref.affiliation && <span className="text-[#64748b]">, {ref.affiliation}</span>}
                  {ref.email && <span className="text-[#94a3b8]"> · {ref.email}</span>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
