import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing, textSafeAccent, truncateForPreview } from './resumeSpacing'

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

const DEFAULT_ACCENT = '#1e293b'

export function BoldTemplate({ data, accentColor }: { data: ResumeData; accentColor?: string }) {
  const { jobTarget, contact, summary, experience, education, skills, references } = data
  const accent = accentColor ?? DEFAULT_ACCENT
  const safeAccent = textSafeAccent(accent)
  const headerLight = isLightBg(accent)
  const headerTextColor = headerLight ? '#0f172a' : '#ffffff'
  const headerMutedColor = headerLight ? '#1e293b' : 'rgba(255,255,255,0.85)'

  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const showExperience = experience.some(hasContent)
  const showEducation = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const hasSummary = !!(summary?.trim())
  const hasSkills = skills.filter(Boolean).length > 0

  const rightBg = '#f8fafc'

  return (
    <div className="bold-template bg-white text-[#0f172a] min-h-0 max-w-[210mm] mx-auto font-sans text-[12.5px] overflow-visible rounded-t-lg">
      {/* Full-width dark header band */}
      <header
        className="relative px-8 py-6 rounded-t-lg"
        style={{ backgroundColor: accent }}
      >
        <div className="text-center">
          {contact.photo && (
            <img
              src={contact.photo}
              alt=""
              className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-2 border-white/30 shadow-lg"
            />
          )}
          <h1
            className="text-[28px] font-extrabold tracking-tight"
            style={{ color: headerTextColor }}
          >
            {name || <span style={{ color: headerMutedColor }}>Your name</span>}
          </h1>
          <p
            className="text-[11px] uppercase tracking-[0.15em] mt-1"
            style={{ color: headerMutedColor }}
          >
            {jobTarget?.trim() || <span>Job title</span>}
          </p>
          <div
            className="flex flex-wrap justify-center gap-x-4 gap-y-0 text-[12px] mt-2"
            style={{ color: headerMutedColor }}
          >
            {contact.email && <span>{contact.email}</span>}
            {contact.phone && <span>{contact.phone}</span>}
            {contact.address?.trim() && <span>{contact.address.trim()}</span>}
            {contact.location && <span>{contact.location}</span>}
            {contact.website && (
              <a href={contact.website} className="underline hover:opacity-90" style={{ color: headerTextColor }}>
                {contact.website.replace(/^https?:\/\//, '')}
              </a>
            )}
            {contact.linkedin && (
              <a href={contact.linkedin} className="underline hover:opacity-90" style={{ color: headerTextColor }}>
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Two-column layout: left 65% (summary + experience), right 35% (skills + education + contact) */}
      <div className="flex">
        <div className="flex-[0_0_65%] px-8 py-6 pr-6">
          {hasSummary && (
            <section className={resumeSpacing.section}>
              <h2
                className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 pb-1.5 border-b"
                style={{ color: safeAccent, borderColor: '#d1d5db' }}
              >
                Summary
              </h2>
              {data.descriptionFormat === 'bullets' && summary.includes('\n') ? (
                <ul className="list-disc ml-4 text-[12.5px] text-[#374151] space-y-0.5 summary-desc">
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
              <h2
                className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 pb-1.5 border-b"
                style={{ color: safeAccent, borderColor: '#d1d5db' }}
              >
                Experience
              </h2>
              <div className={resumeSpacing.expWrapper}>
                {experience.filter(hasContent).map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline gap-2 flex-nowrap">
                      <span className="font-semibold text-[#0f172a] min-w-0 truncate">{exp.jobTitle}</span>
                      <span className="text-[10.5px] text-[#64748b] whitespace-nowrap shrink-0">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div className="text-[12.5px] text-[#374151] font-medium mt-0.5">
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
        </div>

        <div
          className="flex-[0_0_35%] px-6 py-6 pl-4"
          style={{ backgroundColor: rightBg }}
        >
          {hasSkills && (
            <section className={resumeSpacing.section}>
              <h2
                className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 pb-1.5 border-b"
                style={{ color: safeAccent, borderColor: '#d1d5db' }}
              >
                Skills
              </h2>
              <p className={resumeSpacing.skills}>{skills.filter(Boolean).join(' · ')}</p>
            </section>
          )}

          {showEducation && (
            <section className={resumeSpacing.section}>
              <h2
                className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 pb-1.5 border-b"
                style={{ color: safeAccent, borderColor: '#d1d5db' }}
              >
                Education
              </h2>
              {education.filter(hasEduContent).map((edu) => (
                <div
                  key={edu.id}
                  className={resumeSpacing.eduEntry}
                  style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
                >
                  <div className="font-semibold text-[#0f172a]">{edu.degree}</div>
                  <div className="flex flex-col gap-0.5 mt-0.5">
                    <span className="text-[12.5px] text-[#374151] font-medium">
                      {edu.school}
                      {edu.location && ` · ${edu.location}`}
                    </span>
                    {edu.startDate && (
                      <span className="text-[10.5px] text-[#64748b]">
                        {edu.startDate} – {edu.endDate}
                      </span>
                    )}
                  </div>
                  {edu.description && (
                    <ul className="list-disc ml-4 mt-1 text-[12.5px] text-[#374151] space-y-0.5 edu-desc">
                      {edu.description.split('\n').filter(Boolean).map((line, j) => (
                        <li key={j}>{line}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Contact details in right column */}
          <section className={resumeSpacing.section}>
            <h2
              className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 pb-1.5 border-b"
                style={{ color: safeAccent, borderColor: '#d1d5db' }}
              >
                Contact
            </h2>
            <div className="text-[12.5px] text-[#374151] space-y-1 leading-relaxed">
              {contact.email && <div>{contact.email}</div>}
              {contact.phone && <div>{contact.phone}</div>}
              {(contact.address?.trim() || contact.location) && (
                <div>{contact.address?.trim() || contact.location}</div>
              )}
              {contact.website && (
                <a href={contact.website} className="text-[#0f172a] hover:underline block truncate">
                  {contact.website.replace(/^https?:\/\//, '')}
                </a>
              )}
              {contact.linkedin && (
                <a href={contact.linkedin} className="text-[#0f172a] hover:underline block">
                  LinkedIn
                </a>
              )}
              {!contact.email && !contact.phone && !contact.address?.trim() && !contact.location && !contact.website && !contact.linkedin && (
                <span className="text-[#94a3b8]">Contact details</span>
              )}
            </div>
          </section>

          {hasRefs && (
            <section>
              <h2
                className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 pb-1.5 border-b"
                style={{ color: safeAccent, borderColor: '#d1d5db' }}
              >
                References
              </h2>
              <div className={resumeSpacing.refBlock}>
                {references!.map((ref, i) => (
                  <div key={i}>
                    <span className="font-medium text-[#0f172a]">{ref.name}</span>
                    {ref.affiliation && <span className="text-[#374151]">, {ref.affiliation}</span>}
                    {ref.email && <span className="text-[#64748b]"> · {ref.email}</span>}
                    {ref.phone && <span className="text-[#64748b]"> · {ref.phone}</span>}
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
