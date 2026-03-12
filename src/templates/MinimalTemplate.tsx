import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing, truncateForPreview } from './resumeSpacing'

function hasContent(exp: { jobTitle?: string; company?: string; description?: string }) {
  return !!(exp.jobTitle?.trim() || exp.company?.trim() || exp.description?.trim())
}
function hasEduContent(edu: { degree?: string; school?: string; description?: string }) {
  return !!(edu.degree?.trim() || edu.school?.trim() || edu.description?.trim())
}

export function MinimalTemplate({ data }: { data: ResumeData }) {
  const { jobTarget, contact, summary, experience, education, skills, references } = data

  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const showExperience = experience.some(hasContent)
  const showEducation = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const hasSummary = !!(summary?.trim())
  const hasSkills = skills.filter(Boolean).length > 0
  const ph = (s: string) => <span className="text-[#d1d5db]">{s}</span>

  return (
    <div className="minimal-template bg-white text-[#1a1a1a] pt-12 px-10 pb-8 min-h-[842px] max-w-[210mm] mx-auto font-sans text-[13px] leading-[1.55] overflow-visible">
      <header className="mb-8">
        {contact.photo && (
          <img src={contact.photo} alt="" className="w-16 h-16 rounded-full object-cover mb-3 border border-[#f3f4f6]" />
        )}
        <h1 className="text-[30px] font-light tracking-tight text-[#0f172a] leading-none">
          {name || ph('Your name')}
        </h1>
        {jobTarget?.trim() && (
          <p className="text-[12px] text-[#94a3b8] mt-1.5 font-medium">{jobTarget.trim()}</p>
        )}
        <div className="flex flex-wrap gap-x-3 gap-y-0 text-[11px] text-[#94a3b8] mt-3">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {contact.address?.trim() && <span>{contact.address.trim()}</span>}
          {contact.location && <span>{contact.location}</span>}
          {contact.website && <a href={contact.website} className="text-[#6366f1] hover:underline">{contact.website.replace(/^https?:\/\//, '')}</a>}
          {contact.linkedin && <a href={contact.linkedin} className="text-[#6366f1] hover:underline">LinkedIn</a>}
        </div>
      </header>

      {hasSummary && (
        <section className="mb-6">
          <p className="text-[12.5px] text-[#475569] leading-[1.7]">{truncateForPreview(summary)}</p>
        </section>
      )}

      {showExperience && (
        <section className="mb-6">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#94a3b8] mb-3">Experience</h2>
          <div className="space-y-4">
            {experience.filter(hasContent).map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline gap-2 flex-nowrap">
                  <span className="font-semibold text-[#0f172a] text-[13px] min-w-0 truncate">{exp.jobTitle}</span>
                  <span className="text-[10.5px] text-[#94a3b8] whitespace-nowrap shrink-0">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-[11px] text-[#94a3b8] mt-0.5">
                  {exp.company}
                  {exp.location && ` · ${exp.location}`}
                </div>
                {exp.description && (
                  <ul className="mt-1.5 list-none space-y-[3px] text-[#475569] text-[12.5px] leading-[1.6] exp-desc">
                    {line(exp.description).map((bullet, i) => (
                      <li key={i} className="pl-3 relative before:content-['–'] before:absolute before:left-0 before:text-[#d1d5db]">{bullet.replace(/^[•\-]\s*/, '')}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {showEducation && (
        <section className="mb-6">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#94a3b8] mb-3">Education</h2>
          {education.filter(hasEduContent).map((edu) => (
            <div key={edu.id} className={resumeSpacing.eduEntry} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-[#0f172a] text-[13px]">{edu.degree}</div>
              <div className="flex justify-between items-baseline gap-x-2 mt-0.5">
                <span className="text-[11px] text-[#94a3b8]">
                  {edu.school}
                  {edu.location && ` · ${edu.location}`}
                </span>
                {edu.startDate && (
                  <span className="text-[10.5px] text-[#94a3b8] whitespace-nowrap shrink-0 ml-auto">{edu.startDate} – {edu.endDate}</span>
                )}
              </div>
              {edu.description && (
                <ul className="list-none mt-1 text-[12px] text-[#475569] space-y-0.5 edu-desc leading-[1.6]">
                  {edu.description.split('\n').filter(Boolean).map((line, j) => (
                    <li key={j} className="pl-3 relative before:content-['–'] before:absolute before:left-0 before:text-[#d1d5db]">{line}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {hasSkills && (
        <section className="mb-6">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#94a3b8] mb-3">Skills</h2>
          <p className="text-[12.5px] text-[#475569] leading-[1.7]">{skills.filter(Boolean).join('  ·  ')}</p>
        </section>
      )}

      {hasRefs && (
        <section>
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#94a3b8] mb-3">References</h2>
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
