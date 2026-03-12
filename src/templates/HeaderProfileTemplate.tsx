import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing, textSafeAccent } from './resumeSpacing'

function isLightBg(hex: string): boolean {
  const h = hex.replace(/^#/, '')
  if (h.length !== 6) return false
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255
  return 0.299 * r + 0.587 * g + 0.114 * b > 0.55
}

function hasContent(exp: { jobTitle?: string; company?: string; description?: string }) {
  return !!(exp.jobTitle?.trim() || exp.company?.trim() || exp.description?.trim())
}
function hasEduContent(edu: { degree?: string; school?: string; description?: string }) {
  return !!(edu.degree?.trim() || edu.school?.trim() || edu.description?.trim())
}

export function HeaderProfileTemplate({ data, accentColor }: { data: ResumeData; accentColor?: string }) {
  const { jobTarget, contact, summary, experience, education, skills, references } = data
  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const hasRefs = references && references.length > 0
  const barColor = accentColor ?? '#1e3a5f'
  const safeBarColor = textSafeAccent(barColor)
  const light = isLightBg(barColor)
  const textCls = light ? 'text-[#0f172a]' : 'text-white'
  const mutedCls = light ? 'text-[#1e293b]' : 'text-white/80'
  const summaryTextCls = light ? 'text-[#1e293b]' : 'text-white/90'

  return (
    <div className="header-profile-template bg-white text-[#1a1a1a] min-h-[842px] max-w-[210mm] mx-auto font-sans text-[13px] leading-[1.55] overflow-visible">
      <header className={`px-8 py-6 ${textCls}`} style={{ backgroundColor: barColor }}>
        <div className="flex items-start gap-4">
          {contact.photo && (
            <img src={contact.photo} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-white/30 shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            {name && <h1 className="text-[26px] font-extrabold tracking-tight uppercase">{name}</h1>}
            {jobTarget?.trim() && <p className={`text-[12px] font-semibold uppercase tracking-[0.15em] mt-0.5 ${mutedCls}`}>{jobTarget.trim()}</p>}
          </div>
        </div>
        {summary && (
          <p className={`text-[12.5px] ${summaryTextCls} mt-4 leading-[1.65] max-w-[92%]`}>
            {summary.slice(0, 280)}{summary.length > 280 ? '...' : ''}
          </p>
        )}
        <div className={`flex flex-wrap gap-x-4 gap-y-0.5 text-[11px] ${mutedCls} mt-3`}>
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {(contact.address?.trim() || contact.location) && <span>{(contact.address?.trim() || contact.location)}</span>}
          {contact.website && <span>{contact.website.replace(/^https?:\/\//, '')}</span>}
        </div>
      </header>

      <div className="flex">
        <div className="w-[62%] min-w-0 pt-6 pl-8 pr-5 pb-8">
          {experience.some(hasContent) && (
            <section className={resumeSpacing.section}>
              <h2 className="text-[10.5px] font-bold uppercase tracking-[0.2em] mb-2 pb-1 border-b-2" style={{ color: safeBarColor, borderBottomColor: barColor }}>Experience</h2>
              <div className={resumeSpacing.expWrapper}>
                {experience.filter(hasContent).map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline gap-2 flex-nowrap">
                      <span className="font-bold text-[#0f172a] min-w-0 truncate">{exp.jobTitle}</span>
                      <span className="text-[10.5px] text-[#94a3b8] whitespace-nowrap shrink-0 font-medium">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                    </div>
                    <div className="text-[11.5px] text-[#64748b] mt-0.5 font-medium">{exp.company}{exp.location && ` · ${exp.location}`}</div>
                    {exp.description && (
                      <ul className={`${resumeSpacing.bulletList} exp-desc`}>
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

          {education.some(hasEduContent) && (
            <section className={resumeSpacing.section}>
              <h2 className="text-[10.5px] font-bold uppercase tracking-[0.2em] mb-2 pb-1 border-b-2" style={{ color: safeBarColor, borderBottomColor: barColor }}>Education</h2>
              {education.filter(hasEduContent).map((edu) => (
                <div key={edu.id} className={resumeSpacing.eduEntry} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                  <div className="font-bold text-[#0f172a]">{edu.degree}</div>
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
        </div>

        <div className="w-[38%] min-w-0 pt-6 pl-5 pr-8 pb-8 border-l border-[#e2e8f0]">
          {skills.filter(Boolean).length > 0 && (
            <section className={resumeSpacing.section}>
              <h2 className="text-[10.5px] font-bold uppercase tracking-[0.2em] mb-2 pb-1 border-b-2" style={{ color: safeBarColor, borderBottomColor: barColor }}>Skills</h2>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {skills.filter(Boolean).map((s, i) => (
                  <span key={i} className="px-2 py-[2px] rounded text-[11px] font-medium border border-[#e2e8f0] text-[#334155] bg-[#f8fafc]">{s}</span>
                ))}
              </div>
            </section>
          )}

          {hasRefs && (
            <section>
              <h2 className="text-[10.5px] font-bold uppercase tracking-[0.2em] mb-2 pb-1 border-b-2" style={{ color: safeBarColor, borderBottomColor: barColor }}>References</h2>
              <div className={resumeSpacing.refBlock}>
                {references!.map((ref, i) => (
                  <div key={i}>
                    <span className="font-semibold text-[#0f172a]">{ref.name}</span>
                    {ref.affiliation && <span className="text-[#64748b]">, {ref.affiliation}</span>}
                    {ref.phone && <span className="text-[#94a3b8]"> · {ref.phone}</span>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
