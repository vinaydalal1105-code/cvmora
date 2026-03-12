import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing, textSafeAccent } from './resumeSpacing'

function hasContent(exp: { jobTitle?: string; company?: string; description?: string }) {
  return !!(exp.jobTitle?.trim() || exp.company?.trim() || exp.description?.trim())
}
function hasEduContent(edu: { degree?: string; school?: string; description?: string }) {
  return !!(edu.degree?.trim() || edu.school?.trim() || edu.description?.trim())
}

export function AuraTemplate({ data, accentColor }: { data: ResumeData; accentColor?: string }) {
  const { contact, summary, experience, education, skills, references, jobTarget } = data
  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const accent = accentColor ?? '#ec4899'
  const safeAccent = textSafeAccent(accent)

  const showExperience = experience.some(hasContent)
  const showEducation = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const hasSummary = !!(summary?.trim())
  const hasSkills = skills.filter(Boolean).length > 0

  const contactItems: string[] = []
  if (contact.email) contactItems.push(contact.email)
  if (contact.phone) contactItems.push(contact.phone)
  if (contact.address?.trim()) contactItems.push(contact.address.trim())
  else if (contact.location) contactItems.push(contact.location)

  const SectionH = ({ title }: { title: string }) => (
    <h2 className="text-[11px] font-semibold text-[#0f172a] tracking-[0.15em] uppercase text-center mb-2">
      {title}
      <span
        className="block w-6 h-[2px] mx-auto mt-1 rounded-full"
        style={{ backgroundColor: accent }}
        aria-hidden
      />
    </h2>
  )

  return (
    <div className="aura-template bg-white text-[#0f172a] min-h-[842px] max-w-[210mm] mx-auto font-sans text-[13px] leading-[1.55] overflow-visible">
      <header className="text-center pt-7 pb-3 px-8">
        {contact.photo && (
          <img
            src={contact.photo}
            alt=""
            className="w-14 h-14 rounded-full object-cover mx-auto mb-3 shadow-sm border border-[#e2e8f0]"
          />
        )}
        <h1 className="text-[24px] font-bold text-[#0f172a] tracking-tight">
          {name || <span className="text-[#94a3b8]">Your name</span>}
        </h1>
        {jobTarget?.trim() && (
          <p className="text-[12px] text-[#64748b] mt-0.5">{jobTarget.trim()}</p>
        )}
        {contactItems.length > 0 && (
          <div className="inline-flex items-center justify-center bg-[#f8fafc] border border-[#e2e8f0] px-4 py-1.5 rounded-2xl mt-2">
            <span className="text-[11px] text-[#64748b]">{contactItems.join('  ·  ')}</span>
          </div>
        )}
        <div
          className="w-10 h-[2px] mx-auto mt-3 rounded-full"
          style={{ backgroundColor: accent }}
          aria-hidden
        />
      </header>

      <div className="px-8 pt-3 pb-8">
        {hasSummary && (
          <section className={resumeSpacing.section}>
            <SectionH title="Summary" />
            {data.descriptionFormat === 'bullets' && summary.includes('\n') ? (
              <ul className="list-disc pl-5 text-[12.5px] text-[#374151] space-y-1 leading-[1.65] summary-desc">
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
                    <span className="font-bold text-[#0f172a] min-w-0 truncate text-[12.5px]">{exp.jobTitle}</span>
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
            <SectionH title="Education" />
            {education.filter(hasEduContent).map((edu) => (
              <div key={edu.id} className={resumeSpacing.eduEntry} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
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
                  <ul className="list-disc pl-5 mt-1 text-[12.5px] text-[#374151] space-y-0.5 edu-desc leading-[1.6]">
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
            <div className="flex flex-wrap justify-center gap-1.5">
              {skills.filter(Boolean).map((s, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-medium border border-[#e2e8f0] bg-[#fafafa] text-[#374151]"
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
    </div>
  )
}
