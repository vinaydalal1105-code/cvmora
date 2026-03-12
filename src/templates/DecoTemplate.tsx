import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing, textSafeAccent, truncateForPreview } from './resumeSpacing'

function hasContent(exp: { jobTitle?: string; company?: string; description?: string }) {
  return !!(exp.jobTitle?.trim() || exp.company?.trim() || exp.description?.trim())
}
function hasEduContent(edu: { degree?: string; school?: string; description?: string }) {
  return !!(edu.degree?.trim() || edu.school?.trim() || edu.description?.trim())
}

function SectionTitle({ title, accent }: { title: string; accent: string }) {
  return (
    <h2 className="flex items-center gap-2.5 mb-2 pb-1.5 border-b border-[#e2e8f0]">
      <span
        className="w-[3px] h-4 shrink-0 rounded-full"
        style={{ backgroundColor: accent }}
        aria-hidden
      />
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f172a]">
        {title}
      </span>
    </h2>
  )
}

/** Decorative elegant template. Centered header with diamond icon above name. Name in Georgia serif. Section headings with left accent bar and underline. Refined and artistic. */
export function DecoTemplate({ data, accentColor }: { data: ResumeData; accentColor?: string }) {
  const { contact, summary, experience, education, skills, references } = data
  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const showExperience = experience.some(hasContent)
  const showEducation = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const hasSummary = !!(summary?.trim())
  const hasSkills = skills.filter(Boolean).length > 0
  const accent = accentColor ?? '#b45309'
  const safeAccent = textSafeAccent(accent)

  return (
    <div className="deco-template bg-white text-[#374151] pt-12 px-10 pb-10 min-h-0 max-w-[210mm] mx-auto font-sans">
      <header className="text-center mb-10">
        <div
          className="text-[14px] mb-2 font-serif"
          style={{ color: safeAccent }}
          aria-hidden
        >
          ◆
        </div>
        <h1
          className="text-[28px] font-normal text-[#0f172a] tracking-tight leading-tight pb-2 border-b"
          style={{ fontFamily: 'Georgia, serif', borderBottomColor: accent, borderBottomWidth: '1px' }}
        >
          {name || 'Your name'}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-0.5 mt-4 text-[12.5px] text-[#64748b]">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {(contact.address?.trim() || contact.location) && (
            <span>{contact.address?.trim() || contact.location}</span>
          )}
        </div>
        {contact.photo && (
          <div className="mt-4 flex justify-center">
            <img
              src={contact.photo}
              alt=""
              className="w-20 h-20 rounded-full object-cover border-2"
              style={{ borderColor: accent }}
            />
          </div>
        )}
      </header>

      {hasSummary && (
        <section className={resumeSpacing.section}>
          <SectionTitle title="Professional Summary" accent={accent} />
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

      {hasSkills && (
        <section className={resumeSpacing.section}>
          <SectionTitle title="Skills" accent={accent} />
          <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 mt-1 text-[12.5px] text-[#374151]">
            {skills.filter(Boolean).map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <span
                  className="w-1.5 h-1.5 rotate-45 shrink-0"
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
          <SectionTitle title="Work History" accent={accent} />
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
          <SectionTitle title="Education" accent={accent} />
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
          <SectionTitle title="References" accent={accent} />
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
