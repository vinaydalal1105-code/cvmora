import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing } from './resumeSpacing'

/** True if hex background is light, so we should use dark text for contrast. */
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

  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const showExperience = experience.some(hasContent)
  const showEducation = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const hasSummary = !!(summary?.trim())
  const hasSkills = skills.filter(Boolean).length > 0

  const contactItems = [
    contact.email,
    contact.phone,
    contact.address?.trim(),
    contact.location,
    contact.website,
    contact.linkedin,
  ].filter(Boolean)

  const isAccent = variant === 'accent'
  const sidebarHex = accentColor ?? (isAccent ? '#002244' : '#f8f9fa')
  const useAccentStyles = isAccent || !!accentColor
  const sidebarLight = useAccentStyles && isLightBg(sidebarHex)
  const asideBg = useAccentStyles ? 'bg-transparent' : 'bg-[#f8f9fa]'
  const asideStyle = useAccentStyles ? undefined : undefined
  const asideBorder = useAccentStyles ? (sidebarLight ? 'border-[#1c1917]/15' : 'border-white/20') : 'border-[#e5e7eb]'
  const asideTitle = useAccentStyles ? (sidebarLight ? 'text-[#1c1917]' : 'text-white') : 'text-[#374151]'
  const asideText = useAccentStyles ? (sidebarLight ? 'text-[#374151]' : 'text-white/90') : 'text-[#4b5563]'
  const asideLink = useAccentStyles ? (sidebarLight ? 'text-[#1d4ed8] underline' : 'text-white/90 underline') : 'text-[#2563eb] underline'
  const nameClass = useAccentStyles ? (sidebarLight ? 'text-[#1c1917]' : 'text-white') : 'text-[#1c1c1c]'
  const jobClass = useAccentStyles ? (sidebarLight ? 'text-[#4b5563]' : 'text-white/90') : 'text-[#6b7280]'
  const skillTag = useAccentStyles
    ? sidebarLight
      ? 'px-2 py-1 rounded bg-[#1c1917]/10 text-[11px] text-[#1c1917] border border-[#1c1917]/20'
      : 'px-2 py-1 rounded bg-white/10 text-[11px] text-white border border-white/20'
    : 'px-2 py-0.5 rounded bg-white border border-[#e5e7eb] text-[11px] text-[#374151]'

  const rootStyle =
    isAccent || accentColor
      ? {
          background: `linear-gradient(to right, ${sidebarHex} 0%, ${sidebarHex} 28%, #ffffff 28%, #ffffff 100%)`,
        }
      : undefined

  return (
    <div
      className="corporate-template text-[#1c1c1c] pt-6 px-0 pb-0 h-full min-h-[297mm] max-w-[210mm] mx-auto font-sans text-sm flex items-stretch"
      style={rootStyle}
    >
      {/* Left sidebar – full height so color bar runs top to bottom */}
      <aside className={`w-[28%] max-w-[60mm] border-r ${asideBorder} p-2.5 pt-6 shrink-0 min-h-full self-stretch ${asideBg}`} style={asideStyle}>
        {contact.photo && (
          <img
            src={contact.photo}
            alt=""
            className={`w-20 h-20 rounded-full object-cover mx-auto mb-2 border-2 ${sidebarLight ? 'border-[#1c1917]/25' : 'border-white/40'}`}
          />
        )}
        <h1 className={`text-xl font-bold tracking-tight mb-0.5 ${nameClass}`}>
          {name || <span className="opacity-70 font-normal">Your name</span>}
        </h1>
        <p className={`text-[11px] uppercase tracking-wider mb-2 ${jobClass}`}>
          {jobTarget?.trim() || <span className="normal-case opacity-70">Job title</span>}
        </p>
        {contactItems.length > 0 && (
          <div className="mb-2">
            <h2 className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${asideTitle}`}>Details</h2>
            <div className={`text-[12px] space-y-1 ${asideText}`}>
              {contact.email && <div>{contact.email}</div>}
              {contact.phone && <div>{contact.phone}</div>}
              {contact.address?.trim() && <div>{contact.address.trim()}</div>}
              {contact.location && <div>{contact.location}</div>}
              {contact.website && (
                <a href={contact.website} className={`block truncate ${asideLink}`}>
                  {contact.website.replace(/^https?:\/\//, '')}
                </a>
              )}
              {contact.linkedin && (
                <a href={contact.linkedin} className={asideLink + ' block'}>
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        )}
        {hasSkills && (
          <div>
            <h2 className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${asideTitle}`}>Skills</h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.filter(Boolean).map((s, i) => (
                <span key={i} className={skillTag}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <div className="flex-1 px-6 pt-6 pb-6 min-w-0">
        {hasSummary && (
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
                  <div className="text-[12px] text-[#4b5563] font-medium mt-0.5">
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
                <span className="font-semibold text-[#1c1c1c]">{edu.degree}</span>
                <span className="text-[#4b5563]"> — {edu.school}</span>
                {(edu.location || edu.startDate) && (
                  <span className="text-[12px] text-[#6b7280]">
                    {' '}
                    · {[edu.location, `${edu.startDate} – ${edu.endDate}`].filter(Boolean).join(' · ')}
                  </span>
                )}
                {edu.description && (
                  <p className={resumeSpacing.eduDescriptionSm}>{edu.description}</p>
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
                  <span className="font-medium text-[#1c1c1c]">{ref.name}</span>
                  {ref.affiliation && <span className="text-[#4b5563]">, {ref.affiliation}</span>}
                  {ref.email && <span className="text-[#6b7280]"> · {ref.email}</span>}
                  {ref.phone && <span className="text-[#6b7280]"> · {ref.phone}</span>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
