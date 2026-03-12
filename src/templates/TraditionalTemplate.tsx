import type React from 'react'
import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing, truncateForPreview } from './resumeSpacing'

function hasContent(exp: { jobTitle?: string; company?: string; description?: string }) {
  return !!(exp.jobTitle?.trim() || exp.company?.trim() || exp.description?.trim())
}
function hasEduContent(edu: { degree?: string; school?: string; description?: string }) {
  return !!(edu.degree?.trim() || edu.school?.trim() || edu.description?.trim())
}

/** Section with full-width gray bar and thin accent line below (traditional formal style) */
function SectionBlock({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className={resumeSpacing.section}>
      <div className="bg-[#f8f9fa] -mx-8 px-8 py-2 mb-0 border-b border-[#e2e8f0]">
        <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0f172a] text-center">
          {title}
        </h2>
      </div>
      <div className="text-[#374151] leading-relaxed mt-2">{children}</div>
    </section>
  )
}

export function TraditionalTemplate({ data }: { data: ResumeData }) {
  const { jobTarget, contact, summary, experience, education, skills, references } = data

  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const showExperience = experience.some(hasContent)
  const showEducation = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const hasSummary = !!(summary?.trim())
  const hasSkills = skills.filter(Boolean).length > 0

  return (
    <div className="traditional-template bg-white text-[#0f172a] pt-10 px-8 pb-8 max-w-[210mm] mx-auto font-sans overflow-visible rounded-t-lg">
      <header className="text-center pb-6 mb-2">
        {contact.photo && (
          <img
            src={contact.photo}
            alt=""
            className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border border-[#e5e7eb] shadow-sm"
          />
        )}
        <h1
          className="text-[28px] font-light tracking-tight text-[#0f172a]"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          {name || <span className="text-[#94a3b8] font-normal">Your name</span>}
        </h1>
        <p className="text-[11px] text-[#64748b] uppercase tracking-[0.15em] mt-1.5 [font-variant:small-caps]">
          {jobTarget?.trim() || <span className="text-[#94a3b8] normal-case">Job title</span>}
        </p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-0 text-[12.5px] text-[#64748b] mt-2">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {contact.address?.trim() && <span>{contact.address.trim()}</span>}
          {contact.location && <span>{contact.location}</span>}
          {contact.website && (
            <a href={contact.website} className="text-[#0f172a] hover:underline">
              {contact.website.replace(/^https?:\/\//, '')}
            </a>
          )}
          {contact.linkedin && (
            <a href={contact.linkedin} className="text-[#0f172a] hover:underline">
              LinkedIn
            </a>
          )}
        </div>
      </header>

      {hasSummary && (
        <SectionBlock title="Profile">
          {data.descriptionFormat === 'bullets' && summary.includes('\n') ? (
            <ul className="list-disc ml-4 text-[12.5px] text-[#374151] space-y-0.5 summary-desc">
              {summary.split('\n').filter((l) => l.trim()).map((l, i) => (
                <li key={i}>{l.replace(/^[•\-]\s*/, '').trim()}</li>
              ))}
            </ul>
          ) : (
            <p className={resumeSpacing.summary}>{truncateForPreview(summary)}</p>
          )}
        </SectionBlock>
      )}

      {showExperience && (
        <SectionBlock title="Experience">
          {experience.filter(hasContent).map((exp) => (
            <div key={exp.id} className={resumeSpacing.expEntry}>
              <div className="flex justify-between items-baseline gap-2 flex-nowrap">
                <span className="font-semibold text-[#0f172a] min-w-0 truncate">{exp.jobTitle}</span>
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
        </SectionBlock>
      )}

      {showEducation && (
        <SectionBlock title="Education">
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
        </SectionBlock>
      )}

      {hasSkills && (
        <SectionBlock title="Skills">
          <p className={resumeSpacing.skills}>{skills.filter(Boolean).join(' · ')}</p>
        </SectionBlock>
      )}

      {hasRefs && (
        <SectionBlock title="References">
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
        </SectionBlock>
      )}
    </div>
  )
}
