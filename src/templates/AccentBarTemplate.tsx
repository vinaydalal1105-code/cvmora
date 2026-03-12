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

/** Full-width colored header bar with initials badge, name + job title, contact on right.
 * Two columns: left 60% (summary + experience + references), right 40% (contact + skills + education). */
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
  const barText = barLight ? 'text-[#0f172a]' : 'text-white'
  const barMuted = barLight ? 'text-[#1e293b]' : 'text-white/90'
  const initials = name ? name.split(/\s+/).map((n) => n[0]).join('').slice(0, 2).toUpperCase() : '—'
  const ph = (s: string) => <span className="text-[#94a3b8]">{s}</span>

  return (
    <div className="accent-bar-template bg-white text-[#374151] min-h-full max-w-[210mm] mx-auto font-sans">
      {/* Full-width top bar */}
      <header
        className={`px-8 py-5 flex items-center justify-between gap-6 ${barText}`}
        style={{ backgroundColor: barColor }}
      >
        <div className="flex items-center gap-4 min-w-0">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center text-base font-bold shrink-0 shadow-inner"
            style={{ backgroundColor: barLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.2)' }}
            aria-hidden
          >
            {initials}
          </div>
          <div className="min-w-0">
            <h1 className={`text-[26px] font-bold tracking-tight truncate ${barText}`}>
              {name || ph('Your name')}
            </h1>
            <p className={`text-[11px] font-medium uppercase tracking-wider mt-0.5 ${barMuted}`}>
              {jobTarget?.trim() || ph('Job title')}
            </p>
          </div>
        </div>
        <div className={`text-[11px] text-right shrink-0 space-y-0.5 ${barMuted}`}>
          {contact.email || contact.phone || contact.location ? (
            <>
              {contact.email && <div className="break-all">{contact.email}</div>}
              {contact.phone && <div>{contact.phone}</div>}
              {contact.location && <div>{contact.location}</div>}
            </>
          ) : (
            <div>{ph('Contact')}</div>
          )}
        </div>
      </header>

      {/* Two columns */}
      <div className="flex">
        <div className="w-[60%] min-w-0 pt-7 pl-8 pr-6 pb-8">
          {hasSummary && (
            <section className={resumeSpacing.section}>
              <h2 className={resumeSpacing.sectionHeading}>Professional Summary</h2>
              {data.descriptionFormat === 'bullets' && summary.includes('\n') ? (
                <ul className="list-disc pl-5 text-[12.5px] text-[#374151] space-y-1 leading-[1.65] summary-desc">
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
              <h2 className={resumeSpacing.sectionHeading}>Work History</h2>
              <div className={resumeSpacing.expWrapper}>
                {experience.filter(hasContent).map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline gap-2 flex-nowrap">
                      <span className="font-semibold text-[#0f172a] min-w-0 truncate text-[12.5px]">
                        {exp.jobTitle}
                      </span>
                      <span className="text-[10.5px] text-[#64748b] whitespace-nowrap shrink-0">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div className="text-[12.5px] text-[#64748b] mt-0.5">
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

          {hasRefs && (
            <section>
              <h2 className={resumeSpacing.sectionHeading}>References</h2>
              <div className={resumeSpacing.refBlock}>
                {references!.map((ref, i) => (
                  <div key={i}>
                    <span className="font-medium text-[#0f172a]">{ref.name}</span>
                    {ref.affiliation && <span className="text-[#64748b]">, {ref.affiliation}</span>}
                    {ref.email && <span className="text-[#94a3b8]"> · {ref.email}</span>}
                    {ref.phone && <span className="text-[#94a3b8]"> · {ref.phone}</span>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="w-[40%] shrink-0 pt-7 pl-6 pr-8 pb-8 border-l border-[#e2e8f0]">
          {(contact.address?.trim() || contact.phone || contact.email || contact.location || contact.website || contact.linkedin || contact.photo) && (
            <section className={resumeSpacing.section}>
              <h2 className={resumeSpacing.sectionHeading}>Contact</h2>
              <div className="space-y-2 mt-1">
                {contact.photo && (
                  <img
                    src={contact.photo}
                    alt=""
                    className="w-16 h-16 rounded-lg object-cover border border-[#e2e8f0]"
                  />
                )}
                <div className="text-[12.5px] text-[#374151] space-y-1">
                  {contact.address?.trim() && <div>{contact.address.trim()}</div>}
                  {contact.phone && <div>{contact.phone}</div>}
                  {contact.email && <div className="break-all">{contact.email}</div>}
                  {contact.location && <div>{contact.location}</div>}
                  {contact.website && (
                    <a href={contact.website} className="text-[#1e3a5f] underline block truncate hover:opacity-80">
                      {contact.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                  {contact.linkedin && (
                    <a href={contact.linkedin} className="text-[#1e3a5f] underline block">LinkedIn</a>
                  )}
                </div>
              </div>
            </section>
          )}

          {hasSkills && (
            <section className={resumeSpacing.section}>
              <h2 className={resumeSpacing.sectionHeading}>Skills</h2>
              <ul className="text-[12.5px] text-[#374151] space-y-1.5 mt-1 list-disc pl-5 leading-[1.5]">
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
                <div key={edu.id} className={resumeSpacing.eduEntry} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                  <div className="font-semibold text-[#0f172a] text-[12.5px]">{edu.degree}</div>
                  <div className="flex justify-between items-baseline gap-x-2 mt-0.5">
                    <span className="text-[12.5px] text-[#64748b] font-medium">
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
                    <ul className="list-disc pl-5 mt-1 text-[12.5px] text-[#374151] space-y-0.5 edu-desc">
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
      </div>
    </div>
  )
}
