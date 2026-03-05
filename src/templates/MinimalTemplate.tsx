import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing } from './resumeSpacing'

function hasExpContent(exp: { jobTitle?: string; company?: string; description?: string }) {
  return !!(exp.jobTitle?.trim() || exp.company?.trim() || exp.description?.trim())
}
function hasEduContent(edu: { degree?: string; school?: string; description?: string }) {
  return !!(edu.degree?.trim() || edu.school?.trim() || edu.description?.trim())
}

export function MinimalTemplate({ data }: { data: ResumeData }) {
  const { jobTarget, contact, summary, experience, education, skills, references } = data

  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const showExperience = experience.some(hasExpContent)
  const showEducation = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const hasSummary = !!(summary?.trim())
  const hasSkills = skills.filter(Boolean).length > 0
  const ph = (s: string) => <span className="text-[#9ca3af]">{s}</span>

  return (
    <div className="minimal-template bg-white text-[#1c1c1c] pt-10 px-8 pb-6 min-h-0 max-w-[210mm] mx-auto font-sans text-[13px]">
      <header className="mb-4 pb-3 border-b border-[#e5e7eb] flex gap-4 items-start">
        {contact.photo && (
          <img src={contact.photo} alt="" className="w-14 h-14 rounded-full object-cover shrink-0 border border-[#e5e7eb]" />
        )}
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-[#1c1c1c] mb-1">
            {name || ph('Your name')}
          </h1>
          <p className="text-[12px] text-[#6b7280] uppercase tracking-wider mb-1">{jobTarget?.trim() || ph('Job title')}</p>
          <div className="flex flex-wrap gap-x-3 gap-y-0 text-[12px] text-[#6b7280]">
            {contact.email || contact.phone || contact.address?.trim() || contact.location || contact.website || contact.linkedin ? (
              <>
                {contact.email && <span>{contact.email}</span>}
                {contact.phone && <span>{contact.phone}</span>}
                {contact.address?.trim() && <span>{contact.address.trim()}</span>}
                {contact.location && <span>{contact.location}</span>}
                {contact.website && (
                  <a href={contact.website} className="text-[#2563eb] underline">Website</a>
                )}
                {contact.linkedin && (
                  <a href={contact.linkedin} className="text-[#2563eb] underline">LinkedIn</a>
                )}
              </>
            ) : (
              ph('Email · Phone · Location')
            )}
          </div>
        </div>
      </header>

      {hasSummary && (
        <section className={resumeSpacing.section}>
          <p className={resumeSpacing.summaryPlain}>{summary}</p>
        </section>
      )}

      {showExperience && (
        <section className={resumeSpacing.section}>
          <h2 className={resumeSpacing.sectionHeading}>Experience</h2>
          <div className={resumeSpacing.expWrapper}>
            {experience.filter(hasExpContent).map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline gap-2 flex-wrap">
                  <span className="font-semibold text-[#1c1c1c]">{exp.jobTitle}</span>
                  <span className="text-[11px] text-[#6b7280]">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className={resumeSpacing.companyLine}>
                  {exp.company}
                  {exp.location && `, ${exp.location}`}
                </div>
                {exp.description && (
                  <ul className={resumeSpacing.bulletList}>
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
            <div key={edu.id} className={resumeSpacing.eduEntry}>
              <span className="font-semibold text-[#1c1c1c]">{edu.degree}</span>
              <span className="text-[#4b5563]">, {edu.school}</span>
              {(edu.location || edu.startDate) && (
                <span className="text-[11px] text-[#6b7280]">
                  {' '}
                  — {[edu.location, `${edu.startDate}–${edu.endDate}`].filter(Boolean).join(' · ')}
                </span>
              )}
              {edu.description && (
                <p className={resumeSpacing.eduDescriptionSm}>{edu.description}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {hasSkills && (
        <section className={resumeSpacing.section}>
          <h2 className={resumeSpacing.sectionHeading}>Skills</h2>
          <p className={resumeSpacing.skillsPlain}>{skills.filter(Boolean).join(', ')}</p>
        </section>
      )}

      {hasRefs && (
        <section>
          <h2 className={resumeSpacing.sectionHeading}>References</h2>
          <div className={resumeSpacing.refBlock}>
            {references!.map((ref, i) => (
              <div key={i}>
                <span className="font-medium text-[#1c1c1c]">{ref.name}</span>
                {ref.affiliation && <span className="text-[#4b5563]">, {ref.affiliation}</span>}
                {ref.email && <span className="text-[#6b7280]"> · {ref.email}</span>}
                {ref.phone && <span className="text-[#6b7280]"> · {ref.phone}</span>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
