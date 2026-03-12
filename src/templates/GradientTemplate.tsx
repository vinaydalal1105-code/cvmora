import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing, textSafeAccent } from './resumeSpacing'

function hasContent(exp: { jobTitle?: string; company?: string; description?: string }) {
  return !!(exp.jobTitle?.trim() || exp.company?.trim() || exp.description?.trim())
}
function hasEduContent(edu: { degree?: string; school?: string; description?: string }) {
  return !!(edu.degree?.trim() || edu.school?.trim() || edu.description?.trim())
}

function isLightColor(hex: string): boolean {
  const h = hex.replace(/^#/, '')
  if (h.length !== 6) return false
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255
  return 0.299 * r + 0.587 * g + 0.114 * b > 0.55
}

function darkenHex(hex: string, factor = 0.2): string {
  const h = hex.replace(/^#/, '')
  if (h.length !== 6) return hex
  const r = Math.max(0, Math.round(parseInt(h.slice(0, 2), 16) * (1 - factor)))
  const g = Math.max(0, Math.round(parseInt(h.slice(2, 4), 16) * (1 - factor)))
  const b = Math.max(0, Math.round(parseInt(h.slice(4, 6), 16) * (1 - factor)))
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

export function GradientTemplate({ data, accentColor }: { data: ResumeData; accentColor?: string }) {
  const { contact, summary, experience, education, skills, references, jobTarget } = data
  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const accent = accentColor ?? '#6366f1'
  const safeAccent = textSafeAccent(accent)
  const lightAccent = isLightColor(accent)

  const headerBg = lightAccent
    ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
    : `linear-gradient(135deg, ${accent} 0%, ${darkenHex(accent, 0.25)} 100%)`
  const headerAccentLine = lightAccent ? accent : accent

  const showExperience = experience.some(hasContent)
  const showEducation = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const hasSummary = !!(summary?.trim())
  const hasSkills = skills.filter(Boolean).length > 0

  const SectionH = ({ title }: { title: string }) => (
    <h2 className="text-[10.5px] font-bold uppercase tracking-wide mb-2" style={{ color: safeAccent }}>
      {title}
      <span className="block w-6 h-0.5 mt-1 rounded-full" style={{ backgroundColor: accent }} />
    </h2>
  )

  return (
    <div className="gradient-template bg-white text-[#0f172a] min-h-[842px] max-w-[210mm] mx-auto font-sans text-[13px] leading-[1.55] overflow-visible">
      <header
        className="w-full px-8 pt-7 pb-5 text-white"
        style={{ background: headerBg }}
      >
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0 flex-1">
            <h1 className="text-[26px] font-extrabold tracking-tight text-white leading-none">
              {name || <span className="text-white/50">Your name</span>}
            </h1>
            {jobTarget?.trim() && (
              <p className="text-white/80 mt-1.5 font-medium text-[13px]">{jobTarget.trim()}</p>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5 text-[11px] text-white/70">
              {contact.email || contact.phone || contact.address?.trim() || contact.location ? (
                <>
                  {contact.email && <span>{contact.email}</span>}
                  {contact.phone && <span>{contact.phone}</span>}
                  {(contact.address?.trim() || contact.location) && (
                    <span>{contact.address?.trim() || contact.location}</span>
                  )}
                  {contact.website && <span>{contact.website.replace(/^https?:\/\//, '')}</span>}
                  {contact.linkedin && <span>LinkedIn</span>}
                </>
              ) : (
                <span className="text-white/40">Email · Phone · Location</span>
              )}
            </div>
          </div>
          {contact.photo && (
            <img
              src={contact.photo}
              alt=""
              className="w-14 h-14 rounded-lg object-cover border-2 border-white/30 shrink-0"
            />
          )}
        </div>
      </header>

      <div className="h-[3px] w-full shrink-0" style={{ backgroundColor: headerAccentLine }} />

      <div className="px-8 pt-5 pb-8">
        {hasSummary && (
          <section className={resumeSpacing.section}>
            <SectionH title="Summary" />
            {data.descriptionFormat === 'bullets' && summary.includes('\n') ? (
              <ul className="list-disc ml-4 text-[12.5px] text-[#374151] space-y-1 summary-desc leading-[1.6]">
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
            <SectionH title="Experience" />
            <div className={resumeSpacing.expWrapper}>
              {experience.filter(hasContent).map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline gap-2 flex-nowrap">
                    <span className="font-bold text-[#0f172a] min-w-0 truncate">{exp.jobTitle}</span>
                    <span className="text-[10.5px] text-[#94a3b8] whitespace-nowrap shrink-0">
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
            <SectionH title="Education" />
            {education.filter(hasEduContent).map((edu) => (
              <div key={edu.id} className={resumeSpacing.eduEntry} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <div className="font-bold text-[#0f172a]">{edu.degree}</div>
                <div className="flex justify-between items-baseline gap-x-2 mt-0.5">
                  <span className={resumeSpacing.companyLine}>
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
                    {edu.description.split('\n').filter(Boolean).map((eduLine, j) => (
                      <li key={j}>{eduLine}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {hasSkills && (
          <section className={resumeSpacing.section}>
            <SectionH title="Skills" />
            <div className="flex flex-wrap gap-1.5">
              {skills.filter(Boolean).map((s, i) => (
                <span
                  key={i}
                  className="px-2.5 py-[3px] rounded-md text-[11px] font-medium border border-[#e2e8f0] bg-[#f8fafc] text-[#1e293b]"
                >
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {hasRefs && (
          <section>
            <SectionH title="References" />
            <div className={resumeSpacing.refBlock}>
              {references!.map((ref, i) => (
                <div key={i}>
                  <span className="font-semibold text-[#0f172a]">{ref.name}</span>
                  {ref.affiliation && <span className="text-[#64748b]">, {ref.affiliation}</span>}
                  {ref.email && <span className="text-[#94a3b8]"> · {ref.email}</span>}
                  {ref.phone && <span className="text-[#94a3b8]"> · {ref.phone}</span>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
