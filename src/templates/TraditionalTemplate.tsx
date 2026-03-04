import type React from 'react'
import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing } from './resumeSpacing'

function hasContent(exp: { jobTitle?: string; company?: string; description?: string }) {
  return !!(exp.jobTitle?.trim() || exp.company?.trim() || exp.description?.trim())
}
function hasEduContent(edu: { degree?: string; school?: string; description?: string }) {
  return !!(edu.degree?.trim() || edu.school?.trim() || edu.description?.trim())
}

/** Section with full-width grey header bar (traditional formal style) */
function SectionBlock({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className={resumeSpacing.section}>
      <div className="bg-[#f3f4f6] -mx-6 px-6 py-1.5 mb-1.5">
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#1c1c1c] text-center">
          {title}
        </h2>
      </div>
      <div className="text-[#333] leading-relaxed mt-1">{children}</div>
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

  return (
    <div className="traditional-template bg-white text-[#1c1c1c] pt-10 px-8 pb-6 min-h-0 max-w-[210mm] mx-auto font-sans text-sm min-h-full">
      <header className="text-center border-b border-[#e5e7eb] pb-3 mb-4">
        {contact.photo ? (
          <img src={contact.photo} alt="" className="w-20 h-20 rounded-full object-cover mx-auto mb-1 border border-[#e5e7eb]" />
        ) : (
          <div className="w-20 h-20 rounded-full border border-dashed border-[#e5e7eb] bg-[#f9fafb] mx-auto mb-1 flex items-center justify-center text-[10px] text-[#9ca3af]" aria-hidden>Photo</div>
        )}
        <h1 className="text-2xl font-bold text-[#1c1c1c] tracking-tight">
          {name || <span className="text-[#9ca3af] font-normal">Your name</span>}
        </h1>
        <p className="text-[12px] text-[#6b7280] uppercase tracking-wider mt-0.5">
          {jobTarget?.trim() || <span className="text-[#9ca3af] normal-case">Job title</span>}
        </p>
        {contact.address?.trim() ? (
          <p className="text-[13px] text-[#4b5563] mt-0.5">{contact.address.trim()}</p>
        ) : (
          <p className="text-[13px] text-[#9ca3af] mt-0.5">Address</p>
        )}
        <div className="flex justify-between items-center mt-1 px-4 text-[12px] text-[#6b7280] border-t border-[#e5e7eb] pt-1.5">
          <span>{contact.phone || <span className="text-[#9ca3af]">Phone</span>}</span>
          <span>{contact.email || <span className="text-[#9ca3af]">Email</span>}</span>
        </div>
      </header>

      <SectionBlock title="Profile">
        <p className={resumeSpacing.summary}>
          {summary ? summary : <span className="text-[#9ca3af] italic">Add a short summary of your experience and goals.</span>}
        </p>
      </SectionBlock>

      <SectionBlock title="Experience">
        {showExperience ? (
          experience.filter(hasContent).map((exp) => (
            <div key={exp.id} className={resumeSpacing.expEntry}>
              <div className="flex justify-between items-baseline gap-2 flex-wrap">
                <span className="font-semibold text-[#1c1c1c]">{exp.jobTitle}</span>
                <span className="text-[11px] text-[#6b7280]">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <div className={resumeSpacing.companyLine}>
                {exp.company}
                {exp.location && ` · ${exp.location}`}
              </div>
              {exp.description && (
                <ul className={resumeSpacing.bulletList}>
                  {line(exp.description).map((bullet, i) => (
                    <li key={i}>{bullet.replace(/^[•\-]\s*/, '')}</li>
                  ))}
                </ul>
              )}
            </div>
          ))
        ) : (
          <p className="text-[13px] text-[#9ca3af] italic">Add your work history and achievements.</p>
        )}
      </SectionBlock>

      <SectionBlock title="Education">
        {showEducation ? (
          education.filter(hasEduContent).map((edu) => (
            <div key={edu.id} className={resumeSpacing.eduEntry}>
              <div className="font-semibold text-[#1c1c1c]">{edu.degree}</div>
              <div className="text-[13px] text-[#4b5563] mt-0.5">
                {edu.school}
                {edu.location && ` · ${edu.location}`}
                {edu.startDate && ` · ${edu.startDate} – ${edu.endDate}`}
              </div>
              {edu.description && (
                <p className={resumeSpacing.eduDescription}>{edu.description}</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-[13px] text-[#9ca3af] italic">Add degrees and certifications.</p>
        )}
      </SectionBlock>

      <SectionBlock title="Skills">
        <p className={resumeSpacing.skills}>
          {skills.filter(Boolean).length > 0
            ? skills.filter(Boolean).join(' · ')
            : <span className="text-[#9ca3af] italic">Add your key skills.</span>}
        </p>
      </SectionBlock>

      <SectionBlock title="References">
        {hasRefs ? (
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
        ) : (
          <p className="text-[13px] text-[#9ca3af] italic">References available upon request.</p>
        )}
      </SectionBlock>
    </div>
  )
}
