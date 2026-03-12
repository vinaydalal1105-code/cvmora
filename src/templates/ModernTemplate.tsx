import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing, textSafeAccent, truncateForPreview } from './resumeSpacing'

function hasExpContent(exp: { jobTitle?: string; company?: string; description?: string }) {
  return !!(exp.jobTitle?.trim() || exp.company?.trim() || exp.description?.trim())
}
function hasEduContent(edu: { degree?: string; school?: string; description?: string }) {
  return !!(edu.degree?.trim() || edu.school?.trim() || edu.description?.trim())
}

const DEFAULT_ACCENT = '#2563eb'

export function ModernTemplate({ data, accentColor }: { data: ResumeData; accentColor?: string }) {
  const { jobTarget, contact, summary, experience, education, skills, references } = data
  const accent = accentColor ?? DEFAULT_ACCENT
  const safeAccent = textSafeAccent(accent)

  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const showExperience = experience.some(hasExpContent)
  const showEducation = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const hasSummary = !!(summary?.trim())
  const hasSkills = skills.filter(Boolean).length > 0
  const ph = (s: string) => <span className="text-[#9ca3af]">{s}</span>

  return (
    <div className="modern-template bg-white text-[#1a1a1a] min-h-[842px] max-w-[210mm] mx-auto font-sans text-[13px] leading-[1.55] overflow-visible">
      <header className="px-10 pt-8 pb-5" style={{ borderBottom: `3px solid ${accent}` }}>
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0 flex-1">
            <h1 className="text-[28px] font-extrabold tracking-tight text-[#0f172a] leading-none">{name || ph('Your name')}</h1>
            <p className="text-[12px] font-semibold uppercase tracking-[0.15em] mt-1.5" style={{ color: safeAccent }}>
              {jobTarget?.trim() || ph('Job title')}
            </p>
          </div>
          <div className="flex items-start gap-4 shrink-0">
            <div className="text-right text-[11px] text-[#64748b] space-y-1">
              {contact.email || contact.phone || contact.address?.trim() || contact.location || contact.website || contact.linkedin ? (
                <>
                  {contact.email && <div className="font-medium">{contact.email}</div>}
                  {contact.phone && <div>{contact.phone}</div>}
                  {contact.address?.trim() && <div>{contact.address.trim()}</div>}
                  {contact.location && <div>{contact.location}</div>}
                  {contact.website && (
                    <a href={contact.website} style={{ color: safeAccent }} className="underline block">{contact.website.replace(/^https?:\/\//, '')}</a>
                  )}
                  {contact.linkedin && (
                    <a href={contact.linkedin} style={{ color: safeAccent }} className="underline block">LinkedIn</a>
                  )}
                </>
              ) : (
                <div>{ph('Email · Phone · Location')}</div>
              )}
            </div>
            {contact.photo && (
              <img src={contact.photo} alt="" className="w-14 h-14 rounded-lg object-cover border-2" style={{ borderColor: accent }} />
            )}
          </div>
        </div>
      </header>

      <div className="px-10 pt-5 pb-8">
        {hasSummary && (
          <section className={resumeSpacing.section}>
            <h2 className="text-[10.5px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: safeAccent }}>Summary</h2>
            {data.descriptionFormat === 'bullets' && summary.includes('\n') ? (
              <ul className="list-disc ml-4 text-[12.5px] text-[#374151] space-y-1 summary-desc leading-[1.6]">
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
            <h2 className="text-[10.5px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: safeAccent }}>Experience</h2>
            <div className={resumeSpacing.expWrapper}>
              {experience.filter(hasExpContent).map((exp) => (
                <div key={exp.id} className="pl-3" style={{ borderLeft: '2px solid #d1d5db' }}>
                  <div className="flex justify-between items-baseline gap-2 flex-nowrap">
                    <span className="font-bold text-[#0f172a] min-w-0 truncate">{exp.jobTitle}</span>
                    <span className="text-[10.5px] text-[#94a3b8] whitespace-nowrap shrink-0 font-medium">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-[11.5px] text-[#64748b] font-medium mt-0.5">
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
            <h2 className="text-[10.5px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: safeAccent }}>Education</h2>
            {education.filter(hasEduContent).map((edu) => (
              <div key={edu.id} className={resumeSpacing.eduEntry} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <div className="font-bold text-[#0f172a]">{edu.degree}</div>
                <div className="flex justify-between items-baseline gap-x-2 mt-0.5">
                  <span className="text-[11.5px] text-[#64748b] font-medium">
                    {edu.school}
                    {edu.location && ` · ${edu.location}`}
                  </span>
                  {edu.startDate && (
                    <span className="text-[10.5px] text-[#94a3b8] whitespace-nowrap shrink-0 ml-auto">{edu.startDate} – {edu.endDate}</span>
                  )}
                </div>
                {edu.description && (
                  <ul className="list-disc ml-4 mt-1 text-[12px] text-[#374151] space-y-0.5 edu-desc leading-[1.6]">
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
            <h2 className="text-[10.5px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: safeAccent }}>Skills</h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.filter(Boolean).map((s, i) => (
                <span
                  key={i}
                  className="px-2.5 py-[3px] rounded-md text-[11px] font-medium border border-[#d1d5db] bg-[#f8fafc] text-[#1e293b]"
                >
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {hasRefs && (
          <section>
            <h2 className="text-[10.5px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: safeAccent }}>References</h2>
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
