import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing, truncateForPreview } from './resumeSpacing'

function hasContent(exp: { jobTitle?: string; company?: string; description?: string }) {
  return !!(exp.jobTitle?.trim() || exp.company?.trim() || exp.description?.trim())
}
function hasEduContent(edu: { degree?: string; school?: string; description?: string }) {
  return !!(edu.degree?.trim() || edu.school?.trim() || edu.description?.trim())
}

export function CleanTemplate({ data }: { data: ResumeData }) {
  const { jobTarget, contact, summary, experience, education, skills, references } = data

  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const showExperience = experience.some(hasContent)
  const showEducation = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const hasSummary = !!(summary?.trim())
  const hasSkills = skills.filter(Boolean).length > 0

  const contactParts: string[] = []
  if (contact.email) contactParts.push(contact.email)
  if (contact.phone) contactParts.push(contact.phone)
  if (contact.address?.trim()) contactParts.push(contact.address.trim())
  if (contact.location) contactParts.push(contact.location)
  if (contact.website) contactParts.push(contact.website.replace(/^https?:\/\//, ''))
  if (contact.linkedin) contactParts.push('LinkedIn')
  const contactLine = contactParts.length > 0 ? contactParts.join(' | ') : null

  const ph = (s: string) => <span className="text-[#94a3b8]">{s}</span>

  return (
    <div className="clean-template bg-white text-[#0f172a] pt-10 px-8 pb-8 min-h-[842px] max-w-[210mm] mx-auto font-sans text-[12.5px] overflow-visible">
      <header className="mb-5 flex gap-4 items-start">
        {contact.photo && (
          <img
            src={contact.photo}
            alt=""
            className="w-16 h-16 rounded-full object-cover shrink-0 border border-[#e5e7eb]"
          />
        )}
        <div className="min-w-0 flex-1">
          <h1 className="text-[26px] font-extrabold tracking-tight text-[#0f172a] mb-0.5">
            {name || ph('Your name')}
          </h1>
          <p className="text-[12.5px] text-[#64748b] mb-1">
            {jobTarget?.trim() || ph('Job title')}
          </p>
          <p className="text-[12px] text-[#64748b] leading-relaxed">
            {contactLine ? (
              contactParts.map((part, i) => (
                <span key={i}>
                  {i > 0 && <span className="text-[#e5e7eb] mx-1.5">|</span>}
                  {part === contact.email ? (
                    <a href={`mailto:${contact.email}`} className="text-[#0f172a] hover:underline">{part}</a>
                  ) : part === contact.website?.replace(/^https?:\/\//, '') ? (
                    <a href={contact.website} className="text-[#0f172a] hover:underline">{part}</a>
                  ) : part === 'LinkedIn' ? (
                    <a href={contact.linkedin} className="text-[#0f172a] hover:underline">{part}</a>
                  ) : (
                    <span>{part}</span>
                  )}
                </span>
              ))
            ) : (
              ph('Email | Phone | Location')
            )}
          </p>
        </div>
      </header>

      {hasSummary && (
        <section className={resumeSpacing.section}>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f172a] mb-2 pb-1.5 border-b border-[#e5e7eb]">
            Summary
          </h2>
          {data.descriptionFormat === 'bullets' && summary.includes('\n') ? (
            <ul className="list-disc ml-4 text-[12.5px] text-[#374151] space-y-0.5 summary-desc">
              {summary.split('\n').filter((l) => l.trim()).map((l, i) => (
                <li key={i}>{l.replace(/^[•\-]\s*/, '').trim()}</li>
              ))}
            </ul>
          ) : (
            <p className={resumeSpacing.summaryPlain}>{truncateForPreview(summary)}</p>
          )}
        </section>
      )}

      {showExperience && (
        <section className={resumeSpacing.section}>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f172a] mb-2 pb-1.5 border-b border-[#e5e7eb]">
            Experience
          </h2>
          <div className={resumeSpacing.expWrapper}>
            {experience.filter(hasContent).map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline gap-2 flex-nowrap">
                  <span className="font-semibold text-[#0f172a] min-w-0 truncate">{exp.jobTitle}</span>
                  <span className="text-[10.5px] text-[#64748b] whitespace-nowrap shrink-0">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-[12.5px] text-[#374151] font-medium mt-0.5">
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
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f172a] mb-2 pb-1.5 border-b border-[#e5e7eb]">
            Education
          </h2>
          {education.filter(hasEduContent).map((edu) => (
            <div
              key={edu.id}
              className={resumeSpacing.eduEntry}
              style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
            >
              <div className="font-semibold text-[#0f172a]">{edu.degree}</div>
              <div className="flex justify-between items-baseline gap-x-2 mt-0.5">
                <span className="text-[12.5px] text-[#374151] font-medium">
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
                <ul className="list-disc ml-4 mt-1 text-[12.5px] text-[#374151] space-y-0.5 edu-desc">
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
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f172a] mb-2 pb-1.5 border-b border-[#e5e7eb]">
            Skills
          </h2>
          <p className={resumeSpacing.skillsPlain}>{skills.filter(Boolean).join(' · ')}</p>
        </section>
      )}

      {hasRefs && (
        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f172a] mb-2 pb-1.5 border-b border-[#e5e7eb]">
            References
          </h2>
          <div className={resumeSpacing.refBlock}>
            {references!.map((ref, i) => (
              <div key={i}>
                <span className="font-medium text-[#0f172a]">{ref.name}</span>
                {ref.affiliation && <span className="text-[#374151]">, {ref.affiliation}</span>}
                {ref.email && <span className="text-[#64748b]"> · {ref.email}</span>}
                {ref.phone && <span className="text-[#64748b]"> · {ref.phone}</span>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
