import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing } from './resumeSpacing'

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

const DEFAULT_HEADER_COLOR = '#047857'

/** Header band style: full-width colored top band (emerald) with name and contact in white; single column body */
export function HeaderBandTemplate({ data, accentColor }: { data: ResumeData; accentColor?: string }) {
  const { jobTarget, contact, summary, experience, education, skills, references } = data
  const headerBg = accentColor ?? DEFAULT_HEADER_COLOR
  const headerLight = isLightBg(headerBg)
  const headerNameClass = headerLight ? 'text-[#1c1917]' : 'text-white'
  const headerSubClass = headerLight ? 'text-[#4b5563]' : 'text-emerald-100'
  const headerContactClass = headerLight ? 'text-[#374151]' : 'text-[#d1fae5]'

  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const showExperience = experience.some(hasContent)
  const showEducation = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const ph = (s: string) => <span className="text-[#9ca3af]">{s}</span>

  return (
    <div className="header-band-template bg-white text-[#1a1a1a] min-h-0 max-w-[210mm] mx-auto font-sans text-sm">
      {/* Full-width colored header band */}
      <header className="px-8 py-4" style={{ backgroundColor: headerBg }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col justify-center">
            <h1 className={`text-2xl font-bold tracking-tight ${headerNameClass}`}>
              {name || ph('Your name')}
            </h1>
            <p className={`text-[12px] uppercase tracking-wider mt-0.5 ${headerSubClass}`}>{jobTarget?.trim() || ph('Job title')}</p>
          </div>
          <div className={`text-right text-[12px] space-y-0.5 flex flex-col justify-center ${headerContactClass}`}>
            {contact.email || contact.phone || contact.location ? (
              <>
                {contact.email && <div>{contact.email}</div>}
                {contact.phone && <div>{contact.phone}</div>}
                {contact.location && <div>{contact.location}</div>}
              </>
            ) : (
              <div>{ph('Contact')}</div>
            )}
          </div>
        </div>
      </header>

      <div className="px-8 pt-8 pb-6">
        <section className={resumeSpacing.section}>
          <h2 className={resumeSpacing.sectionHeading}>Profile</h2>
          <p className={resumeSpacing.summary}>{summary || ph('Add a short summary.')}</p>
        </section>

        <section className={resumeSpacing.section}>
          <h2 className={resumeSpacing.sectionHeading}>Career Experience</h2>
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
          <h2 className={resumeSpacing.sectionHeading}>Technical Proficiencies</h2>
          <p className={resumeSpacing.skills}>
            {skills.filter(Boolean).length > 0 ? skills.filter(Boolean).join(' · ') : ph('Add your skills')}
          </p>
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
