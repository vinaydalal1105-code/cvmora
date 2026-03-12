import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing, textSafeAccent } from './resumeSpacing'

function hasContent(exp: { jobTitle?: string; company?: string; description?: string }) {
  return !!(exp.jobTitle?.trim() || exp.company?.trim() || exp.description?.trim())
}
function hasEduContent(edu: { degree?: string; school?: string; description?: string }) {
  return !!(edu.degree?.trim() || edu.school?.trim() || edu.description?.trim())
}

export function GeometricTemplate({ data, accentColor }: { data: ResumeData; accentColor?: string }) {
  const { contact, summary, experience, education, skills, references, jobTarget } = data
  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const accent = accentColor ?? '#0891b2'
  const safeAccent = textSafeAccent(accent)

  const showExperience = experience.some(hasContent)
  const showEducation = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const hasSummary = !!(summary?.trim())
  const hasSkills = skills.filter(Boolean).length > 0

  const contactItems: (string | React.ReactNode)[] = []
  if (contact.email) contactItems.push(contact.email)
  if (contact.phone) contactItems.push(contact.phone)
  if (contact.location?.trim()) contactItems.push(contact.location)
  if (contact.address?.trim()) contactItems.push(contact.address.trim())
  if (contact.website) contactItems.push(
    <a key="web" href={contact.website} style={{ color: safeAccent }} className="underline">
      {contact.website.replace(/^https?:\/\//, '')}
    </a>
  )
  if (contact.linkedin) contactItems.push(
    <a key="li" href={contact.linkedin} style={{ color: safeAccent }} className="underline">
      LinkedIn
    </a>
  )

  const SectionHeading = ({ children }: { children: React.ReactNode }) => (
    <h2 className="flex items-center gap-2 mb-2 text-[10px] uppercase tracking-[0.2em] font-bold text-[#0f172a]">
      <span className="w-2 h-2 rounded-none shrink-0" style={{ backgroundColor: accent }} aria-hidden />
      {children}
    </h2>
  )

  return (
    <div className="geometric-template bg-white text-[#0f172a] min-h-[842px] max-w-[210mm] mx-auto font-sans text-[13px] leading-[1.55] overflow-visible">
      <header className="px-8 pt-6 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="flex items-center text-[26px] font-extrabold text-[#0f172a] leading-tight">
              <span className="w-3 h-3 rounded-sm shrink-0 mr-3" style={{ backgroundColor: accent }} aria-hidden />
              {name || <span className="text-[#94a3b8]">Your name</span>}
            </h1>
            {jobTarget?.trim() && (
              <p className="text-[12px] font-medium text-[#64748b] mt-1">{jobTarget.trim()}</p>
            )}
            {contactItems.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2 text-[11px] text-[#64748b]">
                {contactItems.map((item, i) => (
                  <span key={i} className="flex items-center gap-2">
                    {i > 0 && (
                      <span className="w-1 h-1 shrink-0" style={{ backgroundColor: accent }} aria-hidden />
                    )}
                    {typeof item === 'string' ? item : item}
                  </span>
                ))}
              </div>
            )}
          </div>
          {contact.photo && (
            <img
              src={contact.photo}
              alt=""
              className="w-12 h-12 rounded-sm object-cover shrink-0 border-2"
              style={{ borderColor: accent }}
            />
          )}
        </div>
        <div className="w-full h-0.5 mt-4" style={{ backgroundColor: accent }} aria-hidden />
      </header>

      <div className="px-8 pt-4 pb-6 flex gap-6">
        <div className="w-[62%] min-w-0">
          {hasSummary && (
            <section className={resumeSpacing.section}>
              <SectionHeading>Summary</SectionHeading>
              {data.descriptionFormat === 'bullets' && summary.includes('\n') ? (
                <ul className={`${resumeSpacing.bulletList} summary-desc`}>
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
              <SectionHeading>Experience</SectionHeading>
              <div className={resumeSpacing.expWrapper}>
                {experience.filter(hasContent).map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline gap-2 flex-nowrap">
                      <span className="font-bold text-[#0f172a] min-w-0 truncate">{exp.jobTitle}</span>
                      <span className="text-[10.5px] text-[#94a3b8] whitespace-nowrap shrink-0 font-medium">
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
        </div>

        <div className="w-[38%] min-w-0 shrink-0">
          {hasSkills && (
            <section className={resumeSpacing.section}>
              <SectionHeading>Skills</SectionHeading>
              <ul className="space-y-1 text-[12px] text-[#374151]">
                {skills.filter(Boolean).map((s, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1 h-1 shrink-0" style={{ backgroundColor: accent }} aria-hidden />
                    {s}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {showEducation && (
            <section className={resumeSpacing.section}>
              <SectionHeading>Education</SectionHeading>
              {education.filter(hasEduContent).map((edu) => (
                <div key={edu.id} className={resumeSpacing.eduEntry} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                  <div className="font-bold text-[#0f172a]">{edu.degree}</div>
                  <div className="flex justify-between items-baseline gap-x-2 mt-0.5">
                    <span className="text-[11.5px] text-[#64748b] font-medium">
                      {edu.school}
                      {edu.location && ` · ${edu.location}`}
                    </span>
                    {(edu.startDate || edu.endDate) && (
                      <span className="text-[10px] text-[#94a3b8] whitespace-nowrap shrink-0 ml-auto">
                        {edu.startDate} – {edu.endDate}
                      </span>
                    )}
                  </div>
                  {edu.description && (
                    <ul className="list-disc ml-4 mt-1 text-[12px] text-[#374151] space-y-0.5 edu-desc leading-[1.6]">
                      {edu.description.split('\n').filter(Boolean).map((ln, j) => (
                        <li key={j}>{ln}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}

          {hasRefs && (
            <section>
              <SectionHeading>References</SectionHeading>
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
    </div>
  )
}
