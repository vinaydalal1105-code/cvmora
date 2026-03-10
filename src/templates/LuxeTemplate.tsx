import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing } from './resumeSpacing'

function hasContent(exp: { jobTitle?: string; company?: string; description?: string }) {
  return !!(exp.jobTitle?.trim() || exp.company?.trim() || exp.description?.trim())
}
function hasEduContent(edu: { degree?: string; school?: string; description?: string }) {
  return !!(edu.degree?.trim() || edu.school?.trim() || edu.description?.trim())
}

/** Refined layout: thin accent rule, generous spacing, premium feel. */
export function LuxeTemplate({ data, accentColor }: { data: ResumeData; accentColor?: string }) {
  const { contact, summary, experience, education, skills, references, jobTarget } = data
  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const showExp = experience.some(hasContent)
  const showEdu = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const accent = accentColor ?? '#b45309'

  return (
    <div className="luxe-template bg-white text-[#1c1c1c] pt-10 px-10 pb-8 min-h-[842px] max-w-[210mm] mx-auto text-sm overflow-visible">
      <header className="text-center mb-5">
        <div className="h-px w-16 mx-auto mb-3" style={{ backgroundColor: accent }} aria-hidden />
        {name && <h1 className="text-[28px] font-light text-[#0f172a] tracking-[0.02em]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>{name}</h1>}
        {jobTarget?.trim() && <p className="text-[13px] text-[#64748b] mt-2 font-sans">{jobTarget.trim()}</p>}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-0.5 text-[12px] text-[#94a3b8] mt-3 font-sans">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {contact.location && <span>{contact.location}</span>}
        </div>
        <div className="h-px w-24 mx-auto mt-3" style={{ backgroundColor: accent }} aria-hidden />
      </header>

      {summary && (
        <section className="mb-4">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#94a3b8] mb-2 font-sans">Summary</h2>
          <p className={`${resumeSpacing.summary} font-sans text-[#475569] max-w-[90%]`}>{summary}</p>
        </section>
      )}

      {skills.filter(Boolean).length > 0 && (
        <section className="mb-5">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#94a3b8] mb-2 font-sans">Skills</h2>
          <p className="font-sans text-[13px] text-[#475569] leading-loose">{skills.filter(Boolean).join('  ·  ')}</p>
        </section>
      )}

      {showExp && (
        <section className="mb-4">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#94a3b8] mb-2 font-sans">Experience</h2>
          <div className={resumeSpacing.expWrapper}>
            {experience.filter(hasContent).map((exp) => (
              <div key={exp.id} className="pb-3 border-b border-[#f1f5f9] last:border-0 last:pb-0">
                <div className="flex justify-between items-baseline gap-2 flex-wrap">
                  <span className="font-semibold text-[#0f172a] font-sans">{exp.jobTitle}</span>
                  <span className="text-[11px] text-[#94a3b8] font-sans">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div className="text-[12px] text-[#64748b] mt-0.5 font-sans">{exp.company}{exp.location && ` · ${exp.location}`}</div>
                {exp.description && (
                  <ul className={resumeSpacing.bulletList}>
                    {line(exp.description).map((b, i) => <li key={i} className="font-sans">{b.replace(/^[•\-]\s*/, '')}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {showEdu && (
        <section className="mb-4">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#94a3b8] mb-2 font-sans">Education</h2>
          {education.filter(hasEduContent).map((edu) => (
            <div key={edu.id} className={`${resumeSpacing.eduEntry} font-sans`}>
              <div className="font-semibold text-[#0f172a]">{edu.degree}</div>
              <div className="text-[12px] text-[#64748b] mt-0.5">{edu.school}{edu.location && ` · ${edu.location}`}</div>
              {edu.description && <p className={resumeSpacing.eduDescriptionSm}>{edu.description}</p>}
            </div>
          ))}
        </section>
      )}

      {hasRefs && (
        <section>
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#94a3b8] mb-2 font-sans">References</h2>
          <div className={`${resumeSpacing.refBlock} font-sans text-[#475569]`}>
            {references!.map((ref, i) => (
              <div key={i} className="break-words min-w-0">
                <span className="font-medium text-[#0f172a]">{ref.name}</span>
                {ref.affiliation && <span>, {ref.affiliation}</span>}
                {ref.email && <span className="text-[#94a3b8] break-all"> · {ref.email}</span>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
