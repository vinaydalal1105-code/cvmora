import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing, textSafeAccent } from './resumeSpacing'

function hasContent(exp: { jobTitle?: string; company?: string; description?: string }) {
  return !!(exp.jobTitle?.trim() || exp.company?.trim() || exp.description?.trim())
}
function hasEduContent(edu: { degree?: string; school?: string; description?: string }) {
  return !!(edu.degree?.trim() || edu.school?.trim() || edu.description?.trim())
}

export function NeonTemplate({ data, accentColor }: { data: ResumeData; accentColor?: string }) {
  const { contact, summary, experience, education, skills, references, jobTarget } = data
  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const accent = accentColor ?? '#10b981'
  const safeAccent = textSafeAccent(accent)

  const showExperience = experience.some(hasContent)
  const showEducation = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const hasSummary = !!(summary?.trim())
  const hasSkills = skills.filter(Boolean).length > 0

  const contactItems = [
    contact.email,
    contact.phone,
    contact.address?.trim(),
    contact.location,
    contact.website,
    contact.linkedin,
  ].filter(Boolean)

  return (
    <div className="neon-template bg-white text-[#0f172a] min-h-[842px] max-w-[210mm] mx-auto font-sans text-[13px] leading-[1.55] overflow-visible">
      <header
        className="px-8 pt-6 pb-5 bg-[#0f172a] flex items-start justify-between gap-6"
        style={{ borderBottom: `3px solid ${accent}` }}
      >
        <div className="min-w-0 flex-1">
          <h1 className="text-[26px] font-extrabold text-white leading-none">{name || 'Your name'}</h1>
          {jobTarget?.trim() && (
            <p className="text-[11px] uppercase tracking-wide mt-1.5 text-white/70">{jobTarget.trim()}</p>
          )}
          {contactItems.length > 0 && (
            <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-2 text-white/60 text-[12px]">
              {contact.email && <span>{contact.email}</span>}
              {contact.phone && <span>{contact.phone}</span>}
              {contact.address?.trim() && <span>{contact.address.trim()}</span>}
              {contact.location && <span>{contact.location}</span>}
              {contact.website && (
                <a href={contact.website} className="underline hover:text-white/80" target="_blank" rel="noopener noreferrer">
                  {contact.website.replace(/^https?:\/\//, '')}
                </a>
              )}
              {contact.linkedin && (
                <a href={contact.linkedin} className="underline hover:text-white/80" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              )}
            </div>
          )}
        </div>
        {contact.photo && (
          <img
            src={contact.photo}
            alt=""
            className="w-14 h-14 rounded-full object-cover shrink-0"
            style={{ border: `2px solid ${accent}` }}
          />
        )}
      </header>

      <div className="px-8 pt-6 pb-8">
        {hasSummary && (
          <section className={resumeSpacing.section}>
            <h2
              className="text-[10.5px] uppercase tracking-[0.2em] pl-3 mb-2 font-bold"
              style={{ color: safeAccent, borderLeft: `3px solid ${accent}` }}
            >
              Summary
            </h2>
            {data.descriptionFormat === 'bullets' && summary.includes('\n') ? (
              <ul className={`${resumeSpacing.bulletList} summary-desc`}>
                {line(summary).map((l, i) => (
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
              className="text-[10.5px] uppercase tracking-[0.2em] pl-3 mb-2 font-bold"
              style={{ color: safeAccent, borderLeft: `3px solid ${accent}` }}
            >
              Experience
            </h2>
            <div className={resumeSpacing.expWrapper}>
              {experience.filter(hasContent).map((exp) => (
                <div key={exp.id} className={resumeSpacing.expEntry}>
                  <div className="flex justify-between items-baseline gap-2 flex-nowrap">
                    <span className="font-bold text-[#0f172a] min-w-0 truncate">{exp.jobTitle}</span>
                    <span className="text-[10.5px] text-[#94a3b8] whitespace-nowrap shrink-0">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className={resumeSpacing.companyLine}>{exp.company}{exp.location && ` · ${exp.location}`}</div>
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
              className="text-[10.5px] uppercase tracking-[0.2em] pl-3 mb-2 font-bold"
              style={{ color: safeAccent, borderLeft: `3px solid ${accent}` }}
            >
              Education
            </h2>
            {education.filter(hasEduContent).map((edu) => (
              <div
                key={edu.id}
                className={resumeSpacing.eduEntry}
                style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
              >
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
                  <ul className={`${resumeSpacing.bulletList} edu-desc`}>
                    {line(edu.description).map((l, j) => (
                      <li key={j}>{l.replace(/^[•\-]\s*/, '')}</li>
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
              className="text-[10.5px] uppercase tracking-[0.2em] pl-3 mb-2 font-bold"
              style={{ color: safeAccent, borderLeft: `3px solid ${accent}` }}
            >
              Skills
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.filter(Boolean).map((s, i) => (
                <span
                  key={i}
                  className="px-2.5 py-[3px] rounded-full text-[11px] font-medium border border-[#e2e8f0] bg-[#f8fafc] text-[#1e293b]"
                >
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {hasRefs && (
          <section>
            <h2
              className="text-[10.5px] uppercase tracking-[0.2em] pl-3 mb-2 font-bold"
              style={{ color: safeAccent, borderLeft: `3px solid ${accent}` }}
            >
              References
            </h2>
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
