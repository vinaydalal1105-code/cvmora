import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing, textSafeAccent } from './resumeSpacing'

function hasContent(exp: { jobTitle?: string; company?: string; description?: string }) {
  return !!(exp.jobTitle?.trim() || exp.company?.trim() || exp.description?.trim())
}
function hasEduContent(edu: { degree?: string; school?: string; description?: string }) {
  return !!(edu.degree?.trim() || edu.school?.trim() || edu.description?.trim())
}

export function TimelineTemplate({ data, accentColor }: { data: ResumeData; accentColor?: string }) {
  const { contact, summary, experience, education, skills, references, jobTarget } = data
  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const showExp = experience.some(hasContent)
  const showEdu = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const accent = accentColor ?? '#0d9488'
  const safeAccent = textSafeAccent(accent)

  const H = ({ title }: { title: string }) => (
    <h2 className="text-[10.5px] font-bold uppercase tracking-[0.18em] mb-3 flex items-center gap-2" style={{ color: safeAccent }}>
      <span className="w-5 h-5 rounded-full border-2 flex items-center justify-center text-[8px] font-bold" style={{ borderColor: accent, color: safeAccent }}>&#10003;</span>
      {title}
    </h2>
  )

  return (
    <div className="timeline-template bg-white text-[#1a1a1a] pt-8 px-10 pb-8 min-h-[842px] max-w-[210mm] mx-auto font-sans text-[13px] leading-[1.55] overflow-visible">
      <header className="mb-7 pb-4" style={{ borderBottom: `3px solid ${accent}` }}>
        {name && <h1 className="text-[26px] font-extrabold text-[#0f172a] tracking-tight">{name}</h1>}
        {jobTarget?.trim() && <p className="text-[12px] font-bold mt-1" style={{ color: safeAccent }}>{jobTarget.trim()}</p>}
        <div className="flex flex-wrap gap-x-4 text-[11px] text-[#475569] mt-2.5">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {(contact.address?.trim() || contact.location) && <span>{(contact.address?.trim() || contact.location)}</span>}
        </div>
      </header>

      {summary && (
        <section className={resumeSpacing.section}>
          <H title="Summary" />
          {data.descriptionFormat === 'bullets' && summary.includes('\n') ? (
            <ul className="list-disc ml-4 text-[12.5px] text-[#374151] space-y-1 summary-desc leading-[1.65]">
              {summary.split('\n').filter((l) => l.trim()).map((l, i) => (
                <li key={i}>{l.replace(/^[•\-]\s*/, '').trim()}</li>
              ))}
            </ul>
          ) : (
            <p className={resumeSpacing.summary}>{summary}</p>
          )}
        </section>
      )}

      {skills.filter(Boolean).length > 0 && (
        <section className={resumeSpacing.section}>
          <H title="Skills" />
          <div className="flex flex-wrap gap-1.5">
            {skills.filter(Boolean).map((s, i) => (
              <span key={i} className="px-2.5 py-[3px] rounded-md text-[11px] font-semibold border border-[#d1d5db] bg-[#f8fafc] text-[#1e293b]">{s}</span>
            ))}
          </div>
        </section>
      )}

      {showExp && (
        <section className={resumeSpacing.section}>
          <H title="Experience" />
          <div className="relative pl-6 space-y-4" style={{ borderLeft: `2px solid ${accent}` }}>
            {experience.filter(hasContent).map((exp) => (
              <div key={exp.id} className="relative">
                <span className="absolute -left-[calc(0.75rem+1px)] top-1 w-2.5 h-2.5 rounded-full border-2 bg-white" style={{ borderColor: accent }} aria-hidden />
                <div className="text-[10.5px] font-bold whitespace-nowrap shrink-0 text-[#1e293b]">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </div>
                <div className="font-bold text-[#0f172a] mt-0.5 min-w-0 truncate">{exp.jobTitle}</div>
                <div className="text-[11.5px] text-[#475569] font-medium">{exp.company}{exp.location && ` · ${exp.location}`}</div>
                {exp.description && (
                  <ul className={`${resumeSpacing.bulletList} exp-desc`}>
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
          <div className="relative pl-6 space-y-3" style={{ borderLeft: `2px solid ${accent}` }}>
            {education.filter(hasEduContent).map((edu) => (
              <div key={edu.id} className="relative" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <span className="absolute -left-[calc(0.75rem+1px)] top-1 w-2.5 h-2.5 rounded-full border-2 bg-white" style={{ borderColor: accent }} aria-hidden />
                <div className="font-bold text-[#0f172a]">{edu.degree}</div>
                <div className="flex justify-between items-baseline gap-x-2 mt-0.5">
                  <span className="text-[11.5px] text-[#475569] font-medium">
                    {edu.school}
                    {edu.location && ` · ${edu.location}`}
                  </span>
                  {edu.startDate && (
                    <span className="text-[10.5px] text-[#475569] whitespace-nowrap shrink-0 ml-auto font-semibold">{edu.startDate} – {edu.endDate}</span>
                  )}
                </div>
                {edu.description && (
                  <ul className="list-disc ml-4 mt-1 text-[12px] text-[#374151] space-y-0.5 edu-desc leading-[1.6]">
                    {edu.description.split('\n').filter(Boolean).map((line, j) => (
                      <li key={j}>{line}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {hasRefs && (
        <section>
          <H title="References" />
          <div className={resumeSpacing.refBlock}>
            {references!.map((ref, i) => (
              <div key={i}>
                <span className="font-semibold text-[#0f172a]">{ref.name}</span>
                {ref.affiliation && <span className="text-[#475569]">, {ref.affiliation}</span>}
                {ref.email && <span className="text-[#64748b]"> · {ref.email}</span>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
