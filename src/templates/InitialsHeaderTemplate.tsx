import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing, truncateForPreview } from './resumeSpacing'

function hasContent(exp: { jobTitle?: string; company?: string; description?: string }) {
  return !!(exp.jobTitle?.trim() || exp.company?.trim() || exp.description?.trim())
}
function hasEduContent(edu: { degree?: string; school?: string; description?: string }) {
  return !!(edu.degree?.trim() || edu.school?.trim() || edu.description?.trim())
}

/** Header: 48×48 initials box (accent bg, white text, rounded-lg), name extrabold, job title, contact right.
 * Thick accent bottom border. Section headings with 3px accent left border. Personal branding feel. */
export function InitialsHeaderTemplate({ data, accentColor }: { data: ResumeData; accentColor?: string }) {
  const { jobTarget, contact, summary, experience, education, skills, references } = data
  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const showExperience = experience.some(hasContent)
  const showEducation = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const hasSummary = !!(summary?.trim())
  const hasSkills = skills.filter(Boolean).length > 0
  const accent = accentColor ?? '#0ea5e9'
  const initials = name ? name.split(/\s+/).map((n) => n[0]).join('').slice(0, 2).toUpperCase() : '—'
  const ph = (s: string) => <span className="text-[#94a3b8]">{s}</span>

  return (
    <div className="initials-header-template bg-white text-[#374151] pt-8 px-8 pb-8 min-h-[842px] max-w-[210mm] mx-auto font-sans text-[13px] leading-[1.55] overflow-visible">
      <header
        className="flex items-center gap-5 pb-5 mb-6 border-b-[4px]"
        style={{ borderBottomColor: accent }}
      >
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center text-base font-bold text-white shrink-0 shadow-sm"
            style={{ backgroundColor: accent }}
            aria-hidden
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-[24px] font-extrabold text-[#0f172a] tracking-tight truncate">
              {name || ph('Your name')}
            </h1>
            {jobTarget?.trim() && (
              <p className="text-[11px] font-medium text-[#64748b] mt-0.5 truncate">
                {jobTarget.trim()}
              </p>
            )}
          </div>
        </div>
        <div className="text-right shrink-0">
          {contact.photo && (
            <img
              src={contact.photo}
              alt=""
              className="w-14 h-14 rounded-lg object-cover border-2 ml-auto mb-2"
              style={{ borderColor: accent }}
            />
          )}
          <div className="text-[12px] text-[#64748b] space-y-0.5">
            {contact.email || contact.phone || (contact.address?.trim() || contact.location) ? (
              <>
                {contact.email && <div className="break-all">{contact.email}</div>}
                {contact.phone && <div>{contact.phone}</div>}
                {(contact.address?.trim() || contact.location) && (
                  <div>{(contact.address?.trim() || contact.location)}</div>
                )}
              </>
            ) : (
              <div>{ph('Email · Phone · Location')}</div>
            )}
          </div>
        </div>
      </header>

      {hasSummary && (
        <section className={resumeSpacing.section}>
          <h2
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f172a] mb-2 pl-3 border-l-[3px]"
            style={{ borderLeftColor: accent }}
          >
            Professional Summary
          </h2>
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

      {hasSkills && (
        <section className={resumeSpacing.section}>
          <h2
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f172a] mb-2 pl-3 border-l-[3px]"
            style={{ borderLeftColor: accent }}
          >
            Skills
          </h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-1 text-[12.5px] text-[#374151]">
            {skills.filter(Boolean).map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: accent }}
                  aria-hidden
                />
                {s}
              </div>
            ))}
          </div>
        </section>
      )}

      {showExperience && (
        <section className={resumeSpacing.section}>
          <h2
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f172a] mb-2 pl-3 border-l-[3px]"
            style={{ borderLeftColor: accent }}
          >
            Work History
          </h2>
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

      {showEducation && (
        <section className={resumeSpacing.section}>
          <h2
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f172a] mb-2 pl-3 border-l-[3px]"
            style={{ borderLeftColor: accent }}
          >
            Education
          </h2>
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

      {hasRefs && (
        <section>
          <h2
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f172a] mb-2 pl-3 border-l-[3px]"
            style={{ borderLeftColor: accent }}
          >
            References
          </h2>
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
  )
}
