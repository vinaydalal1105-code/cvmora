import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing } from './resumeSpacing'

function hasContent(exp: { jobTitle?: string; company?: string; description?: string }) {
  return !!(exp.jobTitle?.trim() || exp.company?.trim() || exp.description?.trim())
}
function hasEduContent(edu: { degree?: string; school?: string; description?: string }) {
  return !!(edu.degree?.trim() || edu.school?.trim() || edu.description?.trim())
}

export function SpotlightTemplate({ data, accentColor }: { data: ResumeData; accentColor?: string }) {
  const { contact, summary, experience, education, skills, references, jobTarget } = data
  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const showExp = experience.some(hasContent)
  const showEdu = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const accent = accentColor ?? '#7c3aed'

  const H = ({ title }: { title: string }) => (
    <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#1c1c1c] mb-1.5 flex items-center gap-2">
      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: accent }} aria-hidden />
      {title}
    </h2>
  )

  return (
    <div className="spotlight-template bg-white text-[#1c1c1c] pt-8 px-8 pb-6 min-h-0 max-w-[210mm] mx-auto font-sans text-sm">
      <header className="mb-8">
        <div className="inline-block px-4 py-2 rounded-lg mb-3" style={{ backgroundColor: `${accent}14` }}>
          {name && <h1 className="text-2xl font-bold text-[#1e1b4b] tracking-tight">{name}</h1>}
        </div>
        {jobTarget?.trim() && <p className="text-[13px] font-medium text-[#4b5563]">{jobTarget.trim()}</p>}
        <div className="flex flex-wrap gap-x-4 text-[12px] text-[#6b7280] mt-2">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {contact.location && <span>{contact.location}</span>}
        </div>
      </header>
      {summary && (
        <section className={resumeSpacing.section}>
          <H title="Summary" />
          <p className={resumeSpacing.summary}>{summary}</p>
        </section>
      )}
      {skills.filter(Boolean).length > 0 && (
        <section className={resumeSpacing.section}>
          <H title="Skills" />
          <div className="flex flex-wrap gap-2 mt-1 text-[13px] text-[#374151]">
            {skills.filter(Boolean).map((s, i) => (
              <span key={i} className="px-2.5 py-0.5 rounded-full border border-[#e5e7eb] bg-[#f9fafb]">{s}</span>
            ))}
          </div>
        </section>
      )}
      {showExp && (
        <section className={resumeSpacing.section}>
          <H title="Experience" />
          <div className={resumeSpacing.expWrapper}>
            {experience.filter(hasContent).map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline gap-2 flex-wrap">
                  <span className="font-semibold text-[#1c1c1c]">{exp.jobTitle}</span>
                  <span className="text-[11px] text-[#6b7280]">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div className="text-[12px] text-[#4b5563] mt-0.5">{exp.company}{exp.location && ` · ${exp.location}`}</div>
                {exp.description && (
                  <ul className={resumeSpacing.bulletList}>
                    {line(exp.description).map((b, i) => <li key={i}>{b.replace(/^[•\-]\s*/, '')}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      {showEdu && (
        <section className={resumeSpacing.section}>
          <H title="Education" />
          {education.filter(hasEduContent).map((edu) => (
            <div key={edu.id} className={resumeSpacing.eduEntry}>
              <div className="font-semibold text-[#1c1c1c]">{edu.degree}</div>
              <div className="text-[12px] text-[#4b5563] mt-0.5">{edu.school}{edu.location && ` · ${edu.location}`}</div>
              {edu.description && <p className={resumeSpacing.eduDescriptionSm}>{edu.description}</p>}
            </div>
          ))}
        </section>
      )}
      {hasRefs && (
        <section>
          <H title="References" />
          <div className={resumeSpacing.refBlock}>
            {references!.map((ref, i) => (
              <div key={i}>
                <span className="font-medium text-[#1c1c1c]">{ref.name}</span>
                {ref.affiliation && <span className="text-[#4b5563]">, {ref.affiliation}</span>}
                {ref.email && <span className="text-[#6b7280]"> · {ref.email}</span>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
