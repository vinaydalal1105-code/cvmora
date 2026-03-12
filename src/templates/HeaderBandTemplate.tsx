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

const DEFAULT_ACCENT = '#047857'

/** Header band style: wide colored top band with name, job badge, contact; single-column body with left-border accent headings */
export function HeaderBandTemplate({ data, accentColor }: { data: ResumeData; accentColor?: string }) {
  const { jobTarget, contact, summary, experience, education, skills, references } = data
  const accent = accentColor ?? DEFAULT_ACCENT
  const headerLight = isLightBg(accent)
  const headerNameClass = headerLight ? 'text-[#0f172a]' : 'text-white'
  const headerSubClass = headerLight ? 'text-[#1e293b]' : 'text-white/90'
  const headerContactClass = headerLight ? 'text-[#1e293b]' : 'text-white/95'
  const badgeBg = headerLight ? 'bg-[#0f172a]/10' : 'bg-white/20'
  const badgeText = headerLight ? 'text-[#0f172a]' : 'text-white'

  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const showExperience = experience.some(hasContent)
  const showEducation = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const hasSummary = !!(summary?.trim())
  const hasSkills = skills.filter(Boolean).length > 0
  const ph = (s: string) => <span className="text-[#94a3b8]">{s}</span>

  return (
    <div className="header-band-template bg-white text-[#0f172a] pt-0 px-0 pb-8 min-h-[842px] max-w-[210mm] mx-auto font-sans overflow-visible rounded-t-lg">
      {/* Wide colored header band */}
      <header
        className="px-6 py-5 rounded-t-lg"
        style={{ backgroundColor: accent }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {contact.photo && (
              <img
                src={contact.photo}
                alt=""
                className={`w-14 h-14 rounded-full object-cover flex-shrink-0 ${headerLight ? 'ring-2 ring-[#0f172a]/20' : 'ring-2 ring-white/40'}`}
              />
            )}
            <div className="flex flex-col gap-2">
              <h1 className={`text-[26px] font-bold tracking-tight ${headerNameClass}`}>
              {name || <span className={headerNameClass}>Your name</span>}
            </h1>
            {jobTarget?.trim() && (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider w-fit ${badgeBg} ${badgeText}`}>
                {jobTarget.trim()}
              </span>
            )}
            </div>
          </div>
          <div className={`text-right text-[11px] space-y-1 flex flex-col justify-center ${headerContactClass}`}>
            {contact.email || contact.phone || (contact.address?.trim() || contact.location) ? (
              <>
                {contact.email && <div>{contact.email}</div>}
                {contact.phone && <div>{contact.phone}</div>}
                {(contact.address?.trim() || contact.location) && (
                  <div>{(contact.address?.trim() || contact.location)}</div>
                )}
              </>
            ) : (
              <div className={headerSubClass}>Contact</div>
            )}
          </div>
        </div>
      </header>

      <div className="px-6 pt-6 pb-6">
        {hasSummary && (
          <section className={resumeSpacing.section}>
            <h2
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f172a] mb-2 pl-3 border-l-[3px]"
              style={{ borderLeftColor: accent }}
            >
              Profile
            </h2>
            {data.descriptionFormat === 'bullets' && summary.includes('\n') ? (
              <ul className="list-disc ml-4 text-[12.5px] text-[#374151] space-y-0.5 summary-desc leading-[1.65]">
                {summary.split('\n').filter((l) => l.trim()).map((l, i) => (
                  <li key={i}>{l.replace(/^[•\-]\s*/, '').trim()}</li>
                ))}
              </ul>
            ) : (
              <p className={resumeSpacing.summary}>{summary}</p>
            )}
          </section>
        )}

        {showExperience && (
          <section className={resumeSpacing.section}>
            <h2
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f172a] mb-2 pl-3 border-l-[3px]"
              style={{ borderLeftColor: accent }}
            >
              Career Experience
            </h2>
            <div className={resumeSpacing.expWrapper}>
              {experience.filter(hasContent).map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline gap-2 flex-nowrap">
                    <span className="font-semibold text-[#0f172a] min-w-0 truncate text-[12.5px]">{exp.jobTitle}</span>
                    <span className="text-[10.5px] text-[#64748b] whitespace-nowrap shrink-0">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className={resumeSpacing.companyLine}>
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
                  <ul className="list-disc ml-4 mt-1 text-[12.5px] text-[#374151] space-y-0.5 edu-desc leading-[1.6]">
                    {edu.description.split('\n').filter(Boolean).map((line, j) => (
                      <li key={j}>{line}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {hasSkills && (
          <section className={resumeSpacing.section}>
            <h2
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f172a] mb-2 pl-3 border-l-[3px]"
              style={{ borderLeftColor: accent }}
            >
              Technical Proficiencies
            </h2>
            <p className={resumeSpacing.skills}>{skills.filter(Boolean).join(' · ')}</p>
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
