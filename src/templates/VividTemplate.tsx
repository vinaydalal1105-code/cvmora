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

export function VividTemplate({ data, accentColor }: { data: ResumeData; accentColor?: string }) {
  const { jobTarget, contact, summary, experience, education, skills, references } = data
  const accent = accentColor ?? '#f59e0b'
  const safeAccent = textSafeAccent(accent)
  const barLight = isLightBg(accent)
  const asideNameClass = barLight ? 'text-[#0f172a]' : 'text-white'
  const asideSubClass = barLight ? 'text-[#1e293b]' : 'text-white/90'
  const asideTextClass = barLight ? 'text-[#1e293b]' : 'text-white/95'
  const asideLinkClass = barLight ? 'text-[#0f172a] underline' : 'text-white underline'
  const asidePhotoBorder = barLight ? 'border-[#0f172a]/20' : 'border-white/50'
  const asidePlaceholder = barLight ? 'text-[#0f172a]/50' : 'text-white/50'

  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const showExperience = experience.some(hasContent)
  const showEducation = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const hasSummary = !!(summary?.trim())
  const hasSkills = skills.filter(Boolean).length > 0
  const ph = (s: string) => <span className={asidePlaceholder}>{s}</span>

  const rootStyle = {
    background: `linear-gradient(to right, ${accent} 0%, ${accent} 28%, #ffffff 28%, #ffffff 100%)`,
  }

  const SectionH = ({ title }: { title: string }) => (
    <h2 className="text-[10.5px] font-bold uppercase tracking-[0.18em] mb-2 pb-1.5 border-b border-[#e5e7eb]" style={{ color: safeAccent }}>
      {title}
    </h2>
  )

  return (
    <div
      className="vivid-template text-[#0f172a] min-h-[297mm] max-w-[210mm] mx-auto font-sans text-[13px] leading-[1.55] flex items-stretch overflow-hidden"
      style={rootStyle}
    >
      <aside
        className={`w-[28%] max-w-[58mm] bg-transparent px-5 pt-8 pb-6 shrink-0 flex flex-col items-center self-stretch min-h-full ${barLight ? 'text-[#1e293b]' : 'text-white'}`}
      >
        <div className="flex flex-col items-center gap-4 w-full text-center">
          {contact.photo && (
            <img src={contact.photo} alt="" className={`w-24 h-24 rounded-full object-cover border-2 flex-shrink-0 ${asidePhotoBorder}`} />
          )}
          <h1 className={`text-[18px] font-bold tracking-tight uppercase w-full leading-tight ${asideNameClass}`}>
            {name || ph('Your name')}
          </h1>
          <p className={`text-[11px] w-full ${asideSubClass}`}>{jobTarget?.trim() || ph('Job title')}</p>
          <div className={`text-[11px] space-y-2 w-full ${asideTextClass}`}>
            {contact.email || contact.phone || contact.address?.trim() || contact.location || contact.website || contact.linkedin ? (
              <>
                {contact.email && <div className="break-all">{contact.email}</div>}
                {contact.phone && <div>{contact.phone}</div>}
                {(contact.address?.trim() || contact.location) && <div>{(contact.address?.trim() || contact.location)}</div>}
                {contact.website && (
                  <a href={contact.website} className={`underline block truncate ${asideLinkClass}`}>{contact.website.replace(/^https?:\/\//, '')}</a>
                )}
                {contact.linkedin && (
                  <a href={contact.linkedin} className={`underline block ${asideLinkClass}`}>LinkedIn</a>
                )}
              </>
            ) : (
              <div>{ph('Contact')}</div>
            )}
          </div>
        </div>
      </aside>

      <div className="flex-1 px-6 pt-6 pb-6 min-w-0">
        {hasSummary && (
          <section className={resumeSpacing.section}>
            <SectionH title="Profile" />
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

        {showExperience && (
          <section className={resumeSpacing.section}>
            <SectionH title="Employment History" />
            <div className={resumeSpacing.expWrapper}>
              {experience.filter(hasContent).map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline gap-2 flex-nowrap">
                    <span className="font-semibold text-[#0f172a] min-w-0 truncate text-[12.5px]">{exp.jobTitle}</span>
                    <span className="text-[10.5px] text-[#475569] whitespace-nowrap shrink-0">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className={resumeSpacing.companyLine}>
                    {exp.company}
                    {exp.location && ` · ${exp.location}`}
                  </div>
                  {exp.description && (
                    <ul className={`${resumeSpacing.bulletList} exp-desc`}>
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
            <SectionH title="Education" />
            {education.filter(hasEduContent).map((edu) => (
              <div key={edu.id} className={resumeSpacing.eduEntry} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-[#0f172a] text-[12.5px]">{edu.degree}</div>
                <div className="flex justify-between items-baseline gap-x-2 mt-0.5">
                  <span className="text-[12.5px] text-[#475569] font-medium">
                    {edu.school}
                    {edu.location && ` · ${edu.location}`}
                  </span>
                  {edu.startDate && (
                    <span className="text-[10.5px] text-[#64748b] whitespace-nowrap shrink-0 ml-auto">
                      {edu.startDate} – {edu.endDate}
                    </span>
                  )}
                </div>
                {edu.description && (
                  <ul className="list-disc ml-4 mt-1 text-[12.5px] text-[#374151] space-y-0.5 edu-desc leading-[1.6]">
                    {edu.description.split('\n').filter(Boolean).map((line, j) => (
                      <li key={j}>{line}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {hasSkills && (
          <section className={resumeSpacing.section}>
            <SectionH title="Skills" />
            <div className="flex flex-wrap gap-2">
              {skills.filter(Boolean).map((s, i) => (
                <span key={i} className="px-2.5 py-1 rounded-md text-[11px] font-semibold border border-[#d1d5db] bg-[#f9fafb] text-[#1e293b]">
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {hasRefs && (
          <section>
            <SectionH title="References" />
            <div className={resumeSpacing.refBlock}>
              {references!.map((ref, i) => (
                <div key={i}>
                  <span className="font-semibold text-[#0f172a]">{ref.name}</span>
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
