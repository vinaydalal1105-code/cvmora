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

/** MyPerfectResume-style: left main content (name, summary, work, education), right dark sidebar (contact, skills). */
export function SidebarRightTemplate({ data, accentColor }: { data: ResumeData; accentColor?: string }) {
  const { jobTarget, contact, summary, experience, education, skills, references } = data
  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const showExperience = experience.some(hasContent)
  const showEducation = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const hasSummary = !!(summary?.trim())
  const hasSkills = skills.filter(Boolean).length > 0
  const hasContactDetails = !!(contact.location || contact.phone || contact.email)
  const barColor = accentColor ?? '#1e3a5f'
  const barLight = isLightBg(barColor)
  const sidebarText = barLight ? 'text-[#1c1917]' : 'text-white'
  const sidebarMuted = barLight ? 'text-[#4b5563]' : 'text-white/90'
  const ph = (s: string) => <span className="text-[#9ca3af]">{s}</span>

  return (
    <div
      className="sidebar-right-template relative bg-white text-[#1c1c1c] h-[842px] min-h-[842px] max-w-[210mm] mx-auto font-sans text-sm flex"
    >
      {/* Left: main content */}
      <div className="w-[72%] min-w-0 pt-10 px-8 pb-6 relative z-10">
        <h1 className="text-2xl font-bold text-[#1c1917] tracking-tight uppercase mb-1">
          {name || ph('Your name')}
        </h1>
        <p className="text-[12px] text-[#6b7280] uppercase tracking-wider mb-4">{jobTarget?.trim() || ph('Job title')}</p>
        <div className="border-b border-[#e5e7eb] pb-2 mb-4" />

        {hasSummary && (
          <section className={resumeSpacing.section}>
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#1c1c1c] mb-1.5 pb-0.5 border-b-2" style={{ borderBottomColor: barColor }}>
              Professional Summary
            </h2>
            <p className={resumeSpacing.summary}>{summary}</p>
          </section>
        )}

        {showExperience && (
          <section className={resumeSpacing.section}>
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#1c1c1c] mb-1.5 pb-0.5 border-b-2" style={{ borderBottomColor: barColor }}>
              Work History
            </h2>
            <div className={resumeSpacing.expWrapper}>
              {experience.filter(hasContent).map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline gap-2 flex-wrap">
                    <span className="font-semibold text-[#1c1c1c]">{exp.jobTitle}</span>
                    <span className="text-[11px] text-[#6b7280]">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className={`text-[12px] text-[#4b5563] mt-0.5`}>
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
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#1c1c1c] mb-1.5 pb-0.5 border-b-2" style={{ borderBottomColor: barColor }}>
              Education
            </h2>
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

      {/* Right: dark sidebar - contact + skills */}
      <aside
        className={`w-[28%] shrink-0 p-3 pt-10 flex flex-col h-full min-h-[842px] relative z-10 ${sidebarText}`}
        style={{ backgroundColor: barColor }}
      >
        <div className="w-8 h-8 rounded bg-white/20 flex items-center justify-center text-[10px] font-bold mb-4" aria-hidden>
          {name ? name.split(/\s+/).map((n) => n[0]).join('').slice(0, 2) : '—'}
        </div>
        {hasContactDetails && (
          <div className="text-[11px] space-y-1 mb-6">
            {contact.location && <div>{contact.location}</div>}
            {contact.phone && <div>{contact.phone}</div>}
            {contact.email && <div className="break-all">{contact.email}</div>}
          </div>
        )}
        {hasSkills && (
          <>
            <h2 className="text-[10px] font-bold uppercase tracking-widest mb-2 opacity-90">Skills</h2>
            <ul className={`text-[11px] space-y-1 ${sidebarMuted}`}>
              {skills.filter(Boolean).map((s, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-current opacity-80" aria-hidden />
                  {s}
                </li>
              ))}
            </ul>
          </>
        )}
      </aside>
    </div>
  )
}
