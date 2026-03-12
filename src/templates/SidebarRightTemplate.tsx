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

const DEFAULT_ACCENT = '#1e3a5f'

/** Main content left (72%), dark sidebar right (28%); premium feel with initials badge, contact, skills */
export function SidebarRightTemplate({ data, accentColor }: { data: ResumeData; accentColor?: string }) {
  const { jobTarget, contact, summary, experience, education, skills, references } = data
  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const showExperience = experience.some(hasContent)
  const showEducation = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const hasSummary = !!(summary?.trim())
  const hasSkills = skills.filter(Boolean).length > 0
  const hasContactDetails = !!((contact.address?.trim() || contact.location) || contact.phone || contact.email || contact.website || contact.linkedin)
  const accent = accentColor ?? DEFAULT_ACCENT
  const barLight = isLightBg(accent)
  const sidebarText = barLight ? 'text-[#0f172a]' : 'text-white'
  const sidebarMuted = barLight ? 'text-[#1e293b]' : 'text-white/85'
  const sidebarFaint = barLight ? 'text-[#374151]' : 'text-white/70'
  const ph = (s: string) => <span className="text-[#94a3b8]">{s}</span>

  const initials = name
    ? name.split(/\s+/).map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '—'

  return (
    <div className="sidebar-right-template relative bg-white text-[#0f172a] min-h-[842px] max-w-[210mm] mx-auto font-sans flex rounded-t-lg overflow-hidden">
      {/* Left: main content */}
      <div className="w-[72%] min-w-0 pt-10 px-8 pb-8 relative z-10">
        <h1 className="text-[26px] font-bold text-[#0f172a] tracking-tight uppercase leading-tight">
          {name || ph('Your name')}
        </h1>
        <p className="text-[11px] text-[#64748b] uppercase tracking-[0.15em] mt-1 mb-5">
          {jobTarget?.trim() || ph('Job title')}
        </p>

        {hasSummary && (
          <section className={resumeSpacing.section}>
            <h2
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f172a] mb-2 pb-1.5 border-b-2"
              style={{ borderBottomColor: accent }}
            >
              Professional Summary
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
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f172a] mb-2 pb-1.5 border-b-2"
              style={{ borderBottomColor: accent }}
            >
              Work History
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
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f172a] mb-2 pb-1.5 border-b-2"
              style={{ borderBottomColor: accent }}
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

        {hasRefs && (
          <section>
            <h2
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f172a] mb-2 pb-1.5 border-b-2"
              style={{ borderBottomColor: accent }}
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

      {/* Right: premium dark sidebar */}
      <aside
        className={`w-[28%] shrink-0 p-6 pt-10 flex flex-col justify-start min-h-[842px] relative z-10 ${sidebarText}`}
        style={{ backgroundColor: accent }}
      >
        {contact.photo ? (
          <img
            src={contact.photo}
            alt=""
            className={`w-14 h-14 rounded-full object-cover mb-6 flex-shrink-0 ${barLight ? 'ring-2 ring-[#0f172a]/20' : 'ring-2 ring-white/30'}`}
          />
        ) : (
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-[14px] font-bold mb-6 flex-shrink-0"
            style={{ backgroundColor: barLight ? 'rgba(15,23,42,0.15)' : 'rgba(255,255,255,0.2)' }}
            aria-hidden
          >
            {initials}
          </div>
        )}
        {hasContactDetails && (
          <div className="space-y-2.5 mb-6">
            <h3 className={`text-[10px] font-bold uppercase tracking-[0.2em] ${sidebarFaint}`}>Contact</h3>
            <div className={`text-[11px] space-y-2 ${sidebarMuted}`}>
              {(contact.address?.trim() || contact.location) && (
                <div>{(contact.address?.trim() || contact.location)}</div>
              )}
              {contact.phone && <div>{contact.phone}</div>}
              {contact.email && <div className="break-all">{contact.email}</div>}
              {contact.website && (
                <a href={contact.website} className="underline opacity-90 hover:opacity-100 block truncate">
                  {contact.website.replace(/^https?:\/\//, '')}
                </a>
              )}
              {contact.linkedin && (
                <a href={contact.linkedin} className="underline opacity-90 hover:opacity-100 block">LinkedIn</a>
              )}
            </div>
          </div>
        )}
        {hasSkills && (
          <div className="flex-1 min-h-0">
            <h3 className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-3 ${sidebarFaint}`}>Skills</h3>
            <ul className={`text-[11px] space-y-2 ${sidebarMuted}`}>
              {skills.filter(Boolean).map((s, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: barLight ? 'rgba(15,23,42,0.5)' : 'rgba(255,255,255,0.7)' }}
                    aria-hidden
                  />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </div>
  )
}
