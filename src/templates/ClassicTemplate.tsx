import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing, truncateForPreview } from './resumeSpacing'

function hasContent(exp: { jobTitle?: string; company?: string; description?: string }) {
  return !!(exp.jobTitle?.trim() || exp.company?.trim() || exp.description?.trim())
}
function hasEduContent(edu: { degree?: string; school?: string; description?: string }) {
  return !!(edu.degree?.trim() || edu.school?.trim() || edu.description?.trim())
}

export function ClassicTemplate({ data }: { data: ResumeData }) {
  const { jobTarget, contact, summary, experience, education, skills, references } = data

  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const showExperience = experience.some(hasContent)
  const showEducation = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const hasContact = !!(contact.email || contact.phone || contact.address?.trim() || contact.location || contact.website || contact.linkedin)
  const hasSummary = !!(summary?.trim())
  const hasSkills = skills.filter(Boolean).length > 0

  return (
    <div className="classic-template bg-white text-[#1a1a1a] pt-10 px-10 pb-8 min-h-[842px] max-w-[210mm] mx-auto text-[13px] leading-[1.55] overflow-visible" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
      <header className="text-center mb-6">
        {contact.photo && (
          <img src={contact.photo} alt="" className="w-[72px] h-[72px] rounded-full object-cover mx-auto mb-3 border-2 border-[#e5e7eb]" />
        )}
        <h1 className="text-[26px] font-normal tracking-[0.03em] text-[#111827]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
          {name || <span className="text-[#9ca3af] font-normal">Your Name</span>}
        </h1>
        {jobTarget?.trim() && (
          <p className="text-[11px] text-[#6b7280] uppercase tracking-[0.2em] mt-1 font-sans font-medium">
            {jobTarget.trim()}
          </p>
        )}
        <div className="flex items-center justify-center gap-1.5 mt-2">
          <span className="w-12 h-px bg-[#d1d5db]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#9ca3af]" />
          <span className="w-12 h-px bg-[#d1d5db]" />
        </div>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-0 text-[11px] text-[#6b7280] mt-2 font-sans">
          {hasContact ? (
            <>
              {contact.email && <span>{contact.email}</span>}
              {contact.phone && <span>{contact.phone}</span>}
              {contact.address?.trim() && <span>{contact.address.trim()}</span>}
              {contact.location && <span>{contact.location}</span>}
              {contact.website && (
                <a href={contact.website} className="text-[#4338ca] hover:underline">
                  {contact.website.replace(/^https?:\/\//, '')}
                </a>
              )}
              {contact.linkedin && (
                <a href={contact.linkedin} className="text-[#4338ca] hover:underline">
                  LinkedIn
                </a>
              )}
            </>
          ) : (
            <span className="text-[#9ca3af]">Email &middot; Phone &middot; Address</span>
          )}
        </div>
      </header>

      {hasSummary && (
        <section className={resumeSpacing.section}>
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#374151] mb-1.5 pb-1 border-b border-[#e5e7eb] font-sans">Profile</h2>
          {data.descriptionFormat === 'bullets' && summary.includes('\n') ? (
            <ul className="list-disc ml-5 text-[12.5px] text-[#374151] space-y-1 summary-desc leading-[1.6]">
              {summary.split('\n').filter((l) => l.trim()).map((l, i) => (
                <li key={i}>{l.replace(/^[•\-]\s*/, '').trim()}</li>
              ))}
            </ul>
          ) : (
            <p className="text-[12.5px] text-[#374151] leading-[1.7] mt-1 italic">{truncateForPreview(summary)}</p>
          )}
        </section>
      )}

      {showExperience && (
        <section className={resumeSpacing.section}>
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#374151] mb-1.5 pb-1 border-b border-[#e5e7eb] font-sans">Experience</h2>
          {experience.filter(hasContent).map((exp) => (
            <div key={exp.id} className={resumeSpacing.expEntry}>
              <div className="flex justify-between items-baseline gap-2 flex-nowrap">
                <span className="font-semibold text-[#111827] text-[13px] min-w-0 truncate" style={{ fontFamily: 'Georgia, serif' }}>{exp.jobTitle}</span>
                <span className="text-[10.5px] text-[#9ca3af] whitespace-nowrap shrink-0 font-sans italic">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <div className="text-[11.5px] text-[#6b7280] mt-0.5 font-sans font-medium">
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
        </section>
      )}

      {showEducation && (
        <section className={resumeSpacing.section}>
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#374151] mb-1.5 pb-1 border-b border-[#e5e7eb] font-sans">Education</h2>
          {education.filter(hasEduContent).map((edu) => (
            <div key={edu.id} className={resumeSpacing.eduEntry} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-[#111827] text-[13px]" style={{ fontFamily: 'Georgia, serif' }}>{edu.degree}</div>
              <div className="flex justify-between items-baseline gap-x-2 mt-0.5">
                <span className="text-[11.5px] text-[#6b7280] font-sans font-medium">
                  {edu.school}
                  {edu.location && ` · ${edu.location}`}
                </span>
                {edu.startDate && (
                  <span className="text-[10.5px] text-[#9ca3af] whitespace-nowrap shrink-0 ml-auto font-sans italic">{edu.startDate} – {edu.endDate}</span>
                )}
              </div>
              {edu.description && (
                <ul className="list-disc ml-5 mt-1 text-[12px] text-[#374151] space-y-0.5 edu-desc leading-[1.6]">
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
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#374151] mb-1.5 pb-1 border-b border-[#e5e7eb] font-sans">Skills</h2>
          <p className="text-[12.5px] text-[#374151] leading-[1.7] mt-1">{skills.filter(Boolean).join('  ·  ')}</p>
        </section>
      )}

      {hasRefs && (
        <section className={resumeSpacing.section}>
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#374151] mb-1.5 pb-1 border-b border-[#e5e7eb] font-sans">References</h2>
          <div className={resumeSpacing.refBlock}>
            {references!.map((ref, i) => (
              <div key={i}>
                <span className="font-semibold text-[#111827]">{ref.name}</span>
                {ref.affiliation && <span className="text-[#6b7280]">, {ref.affiliation}</span>}
                {ref.email && <span className="text-[#9ca3af]"> · {ref.email}</span>}
                {ref.phone && <span className="text-[#9ca3af]"> · {ref.phone}</span>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
