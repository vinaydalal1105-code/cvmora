import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing, textSafeAccent, truncateForPreview } from './resumeSpacing'

function hasContent(exp: { jobTitle?: string; company?: string; description?: string }) {
  return !!(exp.jobTitle?.trim() || exp.company?.trim() || exp.description?.trim())
}
function hasEduContent(edu: { degree?: string; school?: string; description?: string }) {
  return !!(edu.degree?.trim() || edu.school?.trim() || edu.description?.trim())
}

/** Two-column layout. Left sidebar (30%) with accent-tinted background, initials circle, contact, skills with horizontal bars. Right column (70%) with name, job title, summary, experience, education. Professional skill-focused. */
export function ProficiencyTemplate({ data, accentColor }: { data: ResumeData; accentColor?: string }) {
  const { contact, summary, experience, education, skills, references, jobTarget } = data
  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const showExperience = experience.some(hasContent)
  const showEducation = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const hasSummary = !!(summary?.trim())
  const hasSkills = skills.filter(Boolean).length > 0
  const accent = accentColor ?? '#1e40af'
  const safeAccent = textSafeAccent(accent)
  const initials = name ? name.split(/\s+/).map((n) => n[0]).join('').slice(0, 2).toUpperCase() : '—'
  const accentBg = '#f1f5f9'

  return (
    <div className="proficiency-template bg-white text-[#374151] min-h-[842px] max-w-[210mm] mx-auto font-sans text-[12.5px] flex">
      <aside
        className="w-[30%] shrink-0 self-stretch min-h-full pt-10 px-5 pb-8 flex flex-col border-l-4"
        style={{ backgroundColor: accentBg, borderLeftColor: accent }}
      >
        {contact.photo ? (
          <img
            src={contact.photo}
            alt=""
            className="w-16 h-16 rounded-full object-cover mx-auto mb-4 border-2 shrink-0"
            style={{ borderColor: accent }}
          />
        ) : (
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold text-white shrink-0 mx-auto mb-4"
            style={{ backgroundColor: accent }}
            aria-hidden
          >
            {initials}
          </div>
        )}
        <div className="space-y-2 text-[12px] text-[#64748b]">
          {contact.email && <div className="break-all">{contact.email}</div>}
          {contact.phone && <div>{contact.phone}</div>}
          {(contact.address?.trim() || contact.location) && (
            <div>{contact.address?.trim() || contact.location}</div>
          )}
        </div>
        {hasSkills && (
          <>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f172a] mt-6 mb-3">
              Skills
            </h2>
            <div className="space-y-2.5">
              {skills.filter(Boolean).map((s, i) => (
                <div key={i} className="space-y-0.5">
                  <span className="text-[11px] text-[#374151] block">{s}</span>
                  <div className="h-1.5 rounded-full bg-[#e2e8f0] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: '85%',
                        backgroundColor: accent,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </aside>

      <main className="flex-1 min-w-0 pt-10 px-8 pb-8">
        <h1 className="text-[24px] font-bold text-[#0f172a] tracking-tight leading-tight">
          {name || 'Your name'}
        </h1>
        {jobTarget?.trim() && (
          <p className="text-[12.5px] mt-0.5 font-medium" style={{ color: safeAccent }}>
            {jobTarget.trim()}
          </p>
        )}

        {hasSummary && (
          <section className={resumeSpacing.section}>
            <h2 className={resumeSpacing.sectionHeading}>Profile</h2>
            {data.descriptionFormat === 'bullets' && summary.includes('\n') ? (
              <ul className="list-disc pl-4 text-[12.5px] text-[#374151] space-y-1 summary-desc">
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
            <h2 className={resumeSpacing.sectionHeading}>Employment History</h2>
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
            <h2 className={resumeSpacing.sectionHeading}>Education</h2>
            {education.filter(hasEduContent).map((edu) => (
              <div
                key={edu.id}
                className={resumeSpacing.eduEntry}
                style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
              >
                <div className="font-semibold text-[#0f172a] text-[12.5px]">{edu.degree}</div>
                <div className="flex justify-between items-baseline gap-x-2 mt-0.5">
                  <span className="text-[12.5px] text-[#64748b] font-medium">
                    {edu.school}
                    {edu.location && ` · ${edu.location}`}
                  </span>
                  {edu.startDate && (
                    <span className="text-[10.5px] text-[#64748b] whitespace-nowrap shrink-0 ml-auto">
                      {edu.startDate} – {edu.endDate}
                    </span>
                  )}
                </div>
                {edu.description && (
                  <ul className="list-disc pl-4 mt-1 text-[12.5px] text-[#374151] space-y-0.5 edu-desc">
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
      </main>
    </div>
  )
}
