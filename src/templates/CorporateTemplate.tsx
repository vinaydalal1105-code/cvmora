import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing, truncateForPreview } from './resumeSpacing'

function isLightBg(hex: string): boolean {
  const h = hex.replace(/^#/, '')
  if (h.length !== 6) return false
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b
  return luminance > 0.55
}

function hasContent(exp: { jobTitle?: string; company?: string; description?: string }) {
  return !!(exp.jobTitle?.trim() || exp.company?.trim() || exp.description?.trim())
}
function hasEduContent(edu: { degree?: string; school?: string; description?: string }) {
  return !!(edu.degree?.trim() || edu.school?.trim() || edu.description?.trim())
}

export type CorporateVariant = 'default' | 'accent'

export function CorporateTemplate({
  data,
  variant = 'default',
  accentColor,
}: {
  data: ResumeData
  variant?: CorporateVariant
  accentColor?: string
}) {
  const { jobTarget, contact, summary, experience, education, skills, references } = data

  const line = (s: string) => {
    const rows = s.split('\n').map((row) => row.trim()).filter(Boolean)
    return rows.filter((row, i) => i === 0 || row !== rows[i - 1])
  }
  const name = displayName(contact)
  const showExperience = experience.some(hasContent)
  const showEducation = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const hasSummary = !!(summary?.trim())
  const hasSkills = skills.filter(Boolean).length > 0

  const isAccent = variant === 'accent'
  const sidebarHex = accentColor ?? (isAccent ? '#0f172a' : '#f8fafc')
  const useAccentStyles = isAccent || !!accentColor
  const sidebarLight = useAccentStyles && isLightBg(sidebarHex)

  const asideBorder = useAccentStyles ? (sidebarLight ? 'border-[#0f172a]/10' : 'border-white/10') : 'border-[#e2e8f0]'
  const asideTitle = useAccentStyles ? (sidebarLight ? 'text-[#0f172a]' : 'text-white') : 'text-[#0f172a]'
  const asideText = useAccentStyles ? (sidebarLight ? 'text-[#1e293b]' : 'text-white/85') : 'text-[#64748b]'
  const asideLink = useAccentStyles ? (sidebarLight ? 'text-[#0f172a] underline' : 'text-white/85 underline') : 'text-[#2563eb] underline'
  const nameClass = useAccentStyles ? (sidebarLight ? 'text-[#0f172a]' : 'text-white') : 'text-[#0f172a]'
  const jobClass = useAccentStyles ? (sidebarLight ? 'text-[#1e293b]' : 'text-white/80') : 'text-[#64748b]'
  const skillTag = useAccentStyles
    ? sidebarLight
      ? 'px-2 py-[2px] rounded text-[10.5px] text-[#0f172a] bg-[#0f172a]/8 border border-[#0f172a]/15 font-medium'
      : 'px-2 py-[2px] rounded text-[10.5px] text-white/90 bg-white/10 border border-white/15 font-medium'
    : 'px-2 py-[2px] rounded bg-white border border-[#e2e8f0] text-[10.5px] text-[#334155] font-medium'

  const rootStyle =
    isAccent || accentColor
      ? { background: `linear-gradient(to right, ${sidebarHex} 0%, ${sidebarHex} 28%, #ffffff 28%, #ffffff 100%)` }
      : undefined

  return (
    <div
      className="corporate-template text-[#1a1a1a] pt-6 px-0 pb-0 h-full min-h-[297mm] max-w-[210mm] mx-auto font-sans text-[13px] leading-[1.55] flex items-stretch overflow-hidden"
      style={rootStyle}
    >
      <aside className={`w-[28%] max-w-[60mm] border-r ${asideBorder} p-3 pt-6 shrink-0 min-h-full self-stretch ${useAccentStyles ? 'bg-transparent' : 'bg-[#f8fafc]'}`}>
        {contact.photo && (
          <img
            src={contact.photo}
            alt=""
            className={`w-[72px] h-[72px] rounded-full object-cover mx-auto mb-3 border-2 ${sidebarLight ? 'border-[#0f172a]/20' : 'border-white/30'}`}
          />
        )}
        <h1 className={`text-[18px] font-extrabold tracking-tight mb-0.5 ${nameClass}`}>
          {name || <span className="opacity-50 font-normal">Your name</span>}
        </h1>
        <p className={`text-[10.5px] uppercase tracking-[0.15em] mb-3 font-semibold ${jobClass}`}>
          {jobTarget?.trim() || <span className="normal-case opacity-50">Job title</span>}
        </p>

        {(contact.email || contact.phone || contact.address?.trim() || contact.location || contact.website || contact.linkedin) && (
          <div className="mb-4">
            <h2 className={`text-[9.5px] font-bold uppercase tracking-[0.2em] mb-1.5 ${asideTitle}`}>Contact</h2>
            <div className={`text-[11px] space-y-1.5 ${asideText}`}>
              {contact.email && <div className="break-all">{contact.email}</div>}
              {contact.phone && <div>{contact.phone}</div>}
              {contact.address?.trim() && <div>{contact.address.trim()}</div>}
              {contact.location && <div>{contact.location}</div>}
              {contact.website && (
                <a href={contact.website} className={`block truncate ${asideLink}`}>
                  {contact.website.replace(/^https?:\/\//, '')}
                </a>
              )}
              {contact.linkedin && (
                <a href={contact.linkedin} className={asideLink + ' block'}>LinkedIn</a>
              )}
            </div>
          </div>
        )}

        {hasSkills && (
          <div>
            <h2 className={`text-[9.5px] font-bold uppercase tracking-[0.2em] mb-1.5 ${asideTitle}`}>Skills</h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.filter(Boolean).map((s, i) => (
                <span key={i} className={skillTag}>{s}</span>
              ))}
            </div>
          </div>
        )}
      </aside>

      <div className="flex-1 px-6 pt-6 pb-8 min-w-0">
        {hasSummary && (
          <section className={resumeSpacing.section}>
            <h2 className={resumeSpacing.sectionHeading}>Profile</h2>
            {data.descriptionFormat === 'bullets' && summary.includes('\n') ? (
              <ul className="list-disc ml-4 text-[12.5px] text-[#374151] space-y-1 summary-desc leading-[1.65]">
                {summary.split('\n').filter((l) => l.trim()).map((l, i) => (
                  <li key={i}>{l.replace(/^[•\-]\s*/, '').trim()}</li>
                ))}
              </ul>
            ) : (
              <p className={resumeSpacing.summary}>{truncateForPreview(summary)}</p>
            )}
          </section>
        )}

        {showExperience && (
          <section className={resumeSpacing.section}>
            <h2 className={resumeSpacing.sectionHeading}>Experience</h2>
            <div className={resumeSpacing.expWrapper}>
              {experience.filter(hasContent).map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline gap-2 flex-nowrap">
                    <span className="font-bold text-[#0f172a] min-w-0 truncate">{exp.jobTitle}</span>
                    <span className="text-[10.5px] text-[#94a3b8] whitespace-nowrap shrink-0 font-medium">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-[11.5px] text-[#64748b] font-medium mt-0.5">
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
            <h2 className={resumeSpacing.sectionHeading}>Education</h2>
            {education.filter(hasEduContent).map((edu) => (
              <div key={edu.id} className={resumeSpacing.eduEntry} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <div className="font-bold text-[#0f172a]">{edu.degree}</div>
                <div className="flex justify-between items-baseline gap-x-2 mt-0.5">
                  <span className="text-[11.5px] text-[#64748b] font-medium">
                    {edu.school}
                    {edu.location && ` · ${edu.location}`}
                  </span>
                  {edu.startDate && (
                    <span className="text-[10.5px] text-[#94a3b8] whitespace-nowrap shrink-0 ml-auto">
                      {edu.startDate} – {edu.endDate}
                    </span>
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
          <section className={resumeSpacing.section}>
            <h2 className={resumeSpacing.sectionHeading}>References</h2>
            <div className={resumeSpacing.refBlock}>
              {references!.map((ref, i) => (
                <div key={i}>
                  <span className="font-semibold text-[#0f172a]">{ref.name}</span>
                  {ref.affiliation && <span className="text-[#64748b]">, {ref.affiliation}</span>}
                  {ref.email && <span className="text-[#94a3b8]"> · {ref.email}</span>}
                  {ref.phone && <span className="text-[#94a3b8]"> · {ref.phone}</span>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
