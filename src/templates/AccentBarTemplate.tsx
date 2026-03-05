import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing } from './resumeSpacing'

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

/** MyPerfectResume-style: full-width accent bar at top with name; two columns: left = summary + work, right = contact + skills + education. */
export function AccentBarTemplate({ data, accentColor }: { data: ResumeData; accentColor?: string }) {
  const { jobTarget, contact, summary, experience, education, skills, references } = data
  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const showExperience = experience.some(hasContent)
  const showEducation = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const hasSummary = !!(summary?.trim())
  const hasSkills = skills.filter(Boolean).length > 0
  const barColor = accentColor ?? '#1e3a5f'
  const barLight = isLightBg(barColor)
  const barText = barLight ? 'text-[#1c1917]' : 'text-white'
  const barMuted = barLight ? 'text-[#4b5563]' : 'text-white/90'
  const ph = (s: string) => <span className="text-[#9ca3af]">{s}</span>

  return (
    <div className="accent-bar-template bg-white text-[#1c1c1c] min-h-full max-w-[210mm] mx-auto font-sans text-sm">
      {/* Full-width top bar */}
      <header
        className={`px-8 py-4 flex items-center justify-between gap-4 ${barText}`}
        style={{ backgroundColor: barColor }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded bg-white/20 flex items-center justify-center text-sm font-bold shrink-0" aria-hidden>
            {name ? name.split(/\s+/).map((n) => n[0]).join('').slice(0, 2) : '—'}
          </div>
          <div>
            <h1 className={`text-xl font-bold tracking-tight uppercase truncate ${barText}`}>
              {name || <span className={barText}>Your name</span>}
            </h1>
            <p className={`text-[11px] ${barMuted}`}>
              {jobTarget?.trim() || <span className={barMuted}>Job title</span>}
            </p>
          </div>
        </div>
        <div className={`text-[11px] text-right shrink-0 ${barMuted}`}>
          {contact.email || contact.phone || contact.location ? (
            <>
              {contact.email && <div>{contact.email}</div>}
              {contact.phone && <div>{contact.phone}</div>}
              {contact.location && <div>{contact.location}</div>}
            </>
          ) : (
            <div><span className={barMuted}>Contact</span></div>
          )}
        </div>
      </header>

      {/* Two columns */}
      <div className="flex px-0">
        <div className="w-[58%] min-w-0 pt-6 pl-8 pr-5 pb-6">
          {hasSummary && (
            <section className={resumeSpacing.section}>
              <h2 className={resumeSpacing.sectionHeading}>Professional Summary</h2>
              <p className={resumeSpacing.summary}>{summary}</p>
            </section>
          )}

          {showExperience && (
            <section className={resumeSpacing.section}>
              <h2 className={resumeSpacing.sectionHeading}>Work History</h2>
              <div className={resumeSpacing.expWrapper}>
                {experience.filter(hasContent).map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline gap-2 flex-wrap">
                      <span className="font-semibold text-[#1c1c1c]">{exp.jobTitle}</span>
                      <span className="text-[11px] text-[#6b7280]">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div className="text-[12px] text-[#4b5563] mt-0.5">
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

          {hasRefs && (
            <section>
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

        <div className="w-[42%] shrink-0 pt-6 pl-5 pr-8 pb-6 border-l border-[#e5e7eb]">
          {(contact.address?.trim() || contact.phone || contact.email || contact.location || contact.website || contact.linkedin) && (
            <section className={resumeSpacing.section}>
              <h2 className={resumeSpacing.sectionHeading}>Contact</h2>
              <div className="text-[12px] text-[#4b5563] space-y-1 mt-1">
                {contact.address?.trim() && <div>{contact.address.trim()}</div>}
                {contact.phone && <div>{contact.phone}</div>}
                {contact.email && <div className="break-all">{contact.email}</div>}
                {contact.location && <div>{contact.location}</div>}
                {contact.website && (
                  <a href={contact.website} className="text-[#2563eb] underline block truncate">
                    {contact.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
                {contact.linkedin && (
                  <a href={contact.linkedin} className="text-[#2563eb] underline block">LinkedIn</a>
                )}
              </div>
            </section>
          )}

          {hasSkills && (
            <section className={resumeSpacing.section}>
              <h2 className={resumeSpacing.sectionHeading}>Skills</h2>
              <ul className="text-[13px] text-[#333] space-y-1 mt-1 list-disc pl-4">
                {skills.filter(Boolean).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </section>
          )}

          {showEducation && (
            <section className={resumeSpacing.section}>
              <h2 className={resumeSpacing.sectionHeading}>Education</h2>
              {education.filter(hasEduContent).map((edu) => (
                <div key={edu.id} className={resumeSpacing.eduEntry}>
                  <div className="font-semibold text-[#1c1c1c]">{edu.degree}</div>
                  <div className="text-[12px] text-[#4b5563] mt-0.5">
                    {edu.school}
                    {edu.location && ` · ${edu.location}`}
                    {edu.startDate && ` · ${edu.startDate} – ${edu.endDate}`}
                  </div>
                  {edu.description && (
                    <p className={resumeSpacing.eduDescriptionSm}>{edu.description}</p>
                  )}
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
