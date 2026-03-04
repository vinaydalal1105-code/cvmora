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

/** Vivid style: full-height colored left bar (amber/orange) with name, photo, contact; content on right */
export function VividTemplate({ data, accentColor }: { data: ResumeData; accentColor?: string }) {
  const { jobTarget, contact, summary, experience, education, skills, references } = data

  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const showExperience = experience.some(hasContent)
  const showEducation = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const barColor = accentColor ?? '#f59e0b'
  const barLight = isLightBg(barColor)
  const rootStyle = {
    background: `linear-gradient(to right, ${barColor} 0%, ${barColor} 26%, #ffffff 26%, #ffffff 100%)`,
  }

  const asideNameClass = barLight ? 'text-[#1c1917]' : 'text-white'
  const asideSubClass = barLight ? 'text-[#4b5563]' : 'text-amber-100'
  const asideTextClass = barLight ? 'text-[#374151]' : 'text-amber-50'
  const asideLinkClass = barLight ? 'text-[#1d4ed8] underline' : 'text-white underline'
  const asidePhotoBorder = barLight ? 'border-[#1c1917]/25' : 'border-white/50'
  const ph = (s: string) => <span className="text-[#9ca3af]">{s}</span>

  return (
    <div
      className="vivid-template text-[#1a1a1a] min-h-full h-full max-w-[210mm] mx-auto font-sans text-sm flex items-stretch"
      style={rootStyle}
    >
      {/* Full-height left bar: single block centered in the stripe */}
      <aside className={`w-[26%] max-w-[55mm] bg-transparent p-3 shrink-0 h-full flex items-center justify-center min-h-0 ${barLight ? 'text-[#1c1917]' : 'text-white'}`}>
        <div className="flex flex-col items-center gap-4 w-full text-center">
          {contact.photo ? (
            <img
              src={contact.photo}
              alt=""
              className={`w-20 h-20 rounded-full object-cover border-2 ${asidePhotoBorder}`}
            />
          ) : (
            <div className={`w-20 h-20 rounded-full border-2 ${asidePhotoBorder}`} style={{ backgroundColor: barColor }} />
          )}
          <h1 className={`text-xl font-bold tracking-tight uppercase w-full ${asideNameClass}`}>
            {name || ph('Your name')}
          </h1>
          <p className={`text-[12px] w-full ${asideSubClass}`}>{jobTarget?.trim() || ph('Job title')}</p>
          <div className={`text-[12px] space-y-1.5 w-full ${asideTextClass}`}>
            {contact.email || contact.phone || contact.address?.trim() || contact.location || contact.website || contact.linkedin ? (
              <>
                {contact.email && <div>{contact.email}</div>}
                {contact.phone && <div>{contact.phone}</div>}
                {contact.address?.trim() && <div>{contact.address.trim()}</div>}
                {contact.location && <div>{contact.location}</div>}
                {contact.website && (
                  <a href={contact.website} className={`underline block truncate ${asideLinkClass}`}>
                    {contact.website.replace(/^https?:\/\//, '')}
                  </a>
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
        <section className={resumeSpacing.section}>
          <h2 className={resumeSpacing.sectionHeading}>Profile</h2>
          <p className={resumeSpacing.summary}>{summary || ph('Add a short summary.')}</p>
        </section>

        <section className={resumeSpacing.section}>
          <h2 className={resumeSpacing.sectionHeading}>Employment History</h2>
          {showExperience ? (
            <div className={resumeSpacing.expWrapper}>
              {experience.filter(hasContent).map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline gap-2 flex-wrap">
                    <span className="font-semibold text-[#1c1c1c]">{exp.jobTitle}</span>
                    <span className="text-[11px] text-[#6b7280]">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className={resumeSpacing.companyLine}>
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
          ) : (
            <p className="text-[13px] text-[#9ca3af] italic">Add your work history.</p>
          )}
        </section>

        <section className={resumeSpacing.section}>
          <h2 className={resumeSpacing.sectionHeading}>Education</h2>
          {showEducation ? (
            education.filter(hasEduContent).map((edu) => (
              <div key={edu.id} className={resumeSpacing.eduEntry}>
                <span className="font-semibold text-[#1c1c1c]">{edu.degree}</span>
                <span className="text-[#4b5563]"> — {edu.school}</span>
                {(edu.location || edu.startDate) && (
                  <span className="text-[12px] text-[#6b7280]">
                    {' '}
                    · {[edu.location, `${edu.startDate} – ${edu.endDate}`].filter(Boolean).join(' · ')}
                  </span>
                )}
              </div>
            ))
          ) : (
            <p className="text-[13px] text-[#9ca3af] italic">Add your education.</p>
          )}
        </section>

        <section className={resumeSpacing.section}>
          <h2 className={resumeSpacing.sectionHeading}>Skills</h2>
          <div className="flex flex-wrap gap-1.5">
            {skills.filter(Boolean).length > 0 ? skills.filter(Boolean).map((s, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded bg-amber-50 text-[#92400e] text-[11px] border border-amber-200"
              >
                {s}
              </span>
            )) : (
              <span className="text-[13px] text-[#9ca3af] italic">Add your skills</span>
            )}
          </div>
        </section>

        <section>
          <h2 className={resumeSpacing.sectionHeading}>References</h2>
          <div className={resumeSpacing.refBlock}>
            {hasRefs ? references!.map((ref, i) => (
              <div key={i}>
                {ref.name}
                {ref.affiliation && `, ${ref.affiliation}`}
                {ref.email && ` · ${ref.email}`}
              </div>
            )) : (
              <p className="text-[13px] text-[#9ca3af] italic">Add references if needed.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
