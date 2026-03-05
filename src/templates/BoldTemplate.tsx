import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing } from './resumeSpacing'

function isLightBg(hex: string): boolean {
  const h = String(hex).replace(/^#/, '').trim()
  if (h.length !== 6) return false
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b
  return luminance > 0.5
}

function hasContent(exp: { jobTitle?: string; company?: string; description?: string }) {
  return !!(exp.jobTitle?.trim() || exp.company?.trim() || exp.description?.trim())
}
function hasEduContent(edu: { degree?: string; school?: string; description?: string }) {
  return !!(edu.degree?.trim() || edu.school?.trim() || edu.description?.trim())
}

const DEFAULT_HEADER_COLOR = '#003366'

/** Bold style: full-width dark header, name centered, contact right, photo overlapping into body */
export function BoldTemplate({ data, accentColor }: { data: ResumeData; accentColor?: string }) {
  const { jobTarget, contact, summary, experience, education, skills, references } = data
  const headerBg = accentColor ?? DEFAULT_HEADER_COLOR
  const headerLight = isLightBg(headerBg)
  const headerTextStyle = headerLight ? { color: '#1c1917' } : undefined
  const headerMutedStyle = headerLight ? { color: '#374151' } : undefined
  const headerNameClass = headerLight ? '' : 'text-white'
  const headerSubClass = headerLight ? '' : 'text-[#e5e7eb]'

  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const showExperience = experience.some(hasContent)
  const showEducation = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const hasSummary = !!(summary?.trim())
  const hasSkills = skills.filter(Boolean).length > 0
  const ph = (s: string) => <span className="text-[#9ca3af]">{s}</span>

  return (
    <div className="bold-template bg-white text-[#1a1a1a] min-h-0 max-w-[210mm] mx-auto font-sans text-sm overflow-visible">
      {/* Full-width dark header */}
      <header
        className="relative px-8 py-5 flex items-center justify-between gap-4 rounded-t-lg"
        style={{
          backgroundColor: headerBg,
          ...(headerLight ? { color: '#1c1917' } : {}),
        }}
      >
        <div className="flex-1 text-center min-w-0 flex flex-col items-center justify-center">
          <h1
            className={`text-2xl font-bold tracking-tight ${headerNameClass}`}
            style={headerLight ? headerTextStyle : undefined}
          >
            {name || <span style={headerTextStyle}>Your name</span>}
          </h1>
          <p
            className={`text-[12px] uppercase tracking-wider mt-1 ${headerSubClass}`}
            style={headerLight ? headerMutedStyle : undefined}
          >
            {jobTarget?.trim() || <span style={headerMutedStyle}>Job title</span>}
          </p>
        </div>
        <div
          className={`text-right text-[12px] space-y-0.5 shrink-0 flex flex-col justify-center ${headerSubClass}`}
          style={headerLight ? headerMutedStyle : undefined}
        >
          {contact.phone || contact.email || contact.location ? (
            <>
              {contact.phone && <div>{contact.phone}</div>}
              {contact.email && <div>{contact.email}</div>}
              {contact.location && <div>{contact.location}</div>}
            </>
          ) : (
            <div><span style={headerMutedStyle}>Contact</span></div>
          )}
        </div>
      </header>

      <div className="pt-8 px-8 pb-6">
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
                        <li key={i}>
                          {bullet.replace(/^[•\-]\s*/, '')}
                        </li>
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
              </div>
            ))}
          </section>
        )}

        {hasSkills && (
          <section className={resumeSpacing.section}>
            <h2 className={resumeSpacing.sectionHeading}>Skills</h2>
            <p className={resumeSpacing.skills}>{skills.filter(Boolean).join(' · ')}</p>
          </section>
        )}

        {hasRefs && (
          <section>
            <h2 className={resumeSpacing.sectionHeading}>References</h2>
            <div className={resumeSpacing.refBlock}>
              {references!.map((ref, i) => (
                <div key={i}>
                  {ref.name}
                  {ref.affiliation && `, ${ref.affiliation}`}
                  {ref.email && ` · ${ref.email}`}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
