import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing, textSafeAccent } from './resumeSpacing'

function hasContent(exp: { jobTitle?: string; company?: string; description?: string }) {
  return !!(exp.jobTitle?.trim() || exp.company?.trim() || exp.description?.trim())
}
function hasEduContent(edu: { degree?: string; school?: string; description?: string }) {
  return !!(edu.degree?.trim() || edu.school?.trim() || edu.description?.trim())
}

export function SerifTemplate({ data, accentColor }: { data: ResumeData; accentColor?: string }) {
  const { contact, summary, experience, education, skills, references, jobTarget } = data
  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const showExp = experience.some(hasContent)
  const showEdu = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const accent = accentColor ?? '#1e3a5f'
  const safeAccent = textSafeAccent(accent)
  const serif = 'Georgia, "Times New Roman", serif'

  const H = ({ title }: { title: string }) => (
    <h2 className="text-[12px] font-normal uppercase tracking-[0.22em] mb-2.5 pb-1 border-b border-[#e5e7eb]" style={{ fontFamily: serif, color: safeAccent }}>
      {title}
    </h2>
  )

  return (
    <div className="serif-template bg-white text-[#1a1a1a] pt-10 px-10 pb-8 min-h-[842px] max-w-[210mm] mx-auto text-[13px] leading-[1.55] overflow-visible">
      <header className="border-b-2 pb-5 mb-6" style={{ borderColor: accent }}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {name && (
              <h1 className="text-[28px] font-normal text-[#0f172a] tracking-[0.02em] leading-none" style={{ fontFamily: serif }}>
                {name}
              </h1>
            )}
            {jobTarget?.trim() && (
              <p className="text-[12px] font-medium mt-1.5 font-sans" style={{ color: safeAccent }}>
                {jobTarget.trim()}
              </p>
            )}
          </div>
          {contact.photo && (
            <img src={contact.photo} alt="" className="w-14 h-14 rounded-full object-cover border-2 shrink-0" style={{ borderColor: accent }} />
          )}
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-0.5 text-[11px] text-[#64748b] mt-3 font-sans">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {(contact.address?.trim() || contact.location) && <span>{(contact.address?.trim() || contact.location)}</span>}
          {contact.website && <a href={contact.website} style={{ color: safeAccent }} className="hover:underline">{contact.website.replace(/^https?:\/\//, '')}</a>}
          {contact.linkedin && <a href={contact.linkedin} style={{ color: safeAccent }} className="hover:underline">LinkedIn</a>}
        </div>
      </header>

      {summary && (
        <section className={resumeSpacing.section}>
          <H title="Summary" />
          {data.descriptionFormat === 'bullets' && summary.includes('\n') ? (
            <ul className="list-disc ml-4 text-[12.5px] text-[#374151] space-y-1 summary-desc leading-[1.65] font-sans">
              {summary.split('\n').filter((l) => l.trim()).map((l, i) => (
                <li key={i}>{l.replace(/^[•\-]\s*/, '').trim()}</li>
              ))}
            </ul>
          ) : (
            <p className="text-[12.5px] text-[#475569] leading-[1.7] font-sans">{summary}</p>
          )}
        </section>
      )}

      {skills.filter(Boolean).length > 0 && (
        <section className={resumeSpacing.section}>
          <H title="Skills" />
          <p className="font-sans text-[12.5px] text-[#475569] leading-[1.8]">{skills.filter(Boolean).join('  ·  ')}</p>
        </section>
      )}

      {showExp && (
        <section className={resumeSpacing.section}>
          <H title="Experience" />
          <div className={resumeSpacing.expWrapper}>
            {experience.filter(hasContent).map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline gap-2 flex-nowrap">
                  <span className="font-semibold text-[#0f172a] font-sans min-w-0 truncate">{exp.jobTitle}</span>
                  <span className="text-[10.5px] text-[#94a3b8] font-sans whitespace-nowrap shrink-0 italic">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div className="text-[11.5px] text-[#64748b] mt-0.5 font-sans font-medium">{exp.company}{exp.location && ` · ${exp.location}`}</div>
                {exp.description && (
                  <ul className={`${resumeSpacing.bulletList} exp-desc`}>
                    {line(exp.description).map((b, i) => <li key={i} className="font-sans">{b.replace(/^[•\-]\s*/, '')}</li>)}
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
            <div key={edu.id} className={resumeSpacing.eduEntry} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-[#0f172a] font-sans">{edu.degree}</div>
              <div className="flex justify-between items-baseline gap-x-2 mt-0.5">
                <span className="text-[11.5px] text-[#64748b] font-medium font-sans">
                  {edu.school}
                  {edu.location && ` · ${edu.location}`}
                </span>
                {edu.startDate && (
                  <span className="text-[10.5px] text-[#94a3b8] whitespace-nowrap shrink-0 ml-auto font-sans italic">{edu.startDate} – {edu.endDate}</span>
                )}
              </div>
              {edu.description && (
                <ul className="list-disc ml-4 mt-1 text-[12px] text-[#374151] space-y-0.5 font-sans edu-desc leading-[1.6]">
                  {edu.description.split('\n').filter(Boolean).map((line, j) => (
                    <li key={j}>{line}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {hasRefs && (
        <section>
          <H title="References" />
          <div className={`${resumeSpacing.refBlock} font-sans`}>
            {references!.map((ref, i) => (
              <div key={i}>
                <span className="font-medium text-[#0f172a]">{ref.name}</span>
                {ref.affiliation && <span className="text-[#64748b]">, {ref.affiliation}</span>}
                {ref.email && <span className="text-[#94a3b8]"> · {ref.email}</span>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
