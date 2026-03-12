import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing, textSafeAccent } from './resumeSpacing'

function hasContent(exp: { jobTitle?: string; company?: string; description?: string }) {
  return !!(exp.jobTitle?.trim() || exp.company?.trim() || exp.description?.trim())
}
function hasEduContent(edu: { degree?: string; school?: string; description?: string }) {
  return !!(edu.degree?.trim() || edu.school?.trim() || edu.description?.trim())
}

export function PillarTemplate({ data, accentColor }: { data: ResumeData; accentColor?: string }) {
  const { contact, summary, experience, education, skills, references, jobTarget } = data
  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const showExp = experience.some(hasContent)
  const showEdu = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const accent = accentColor ?? '#0f766e'
  const safeAccent = textSafeAccent(accent)

  return (
    <div className="pillar-template relative bg-white text-[#1a1a1a] h-full min-h-[842px] max-w-[210mm] mx-auto font-sans text-[13px] leading-[1.55] overflow-visible">
      <div
        className="absolute inset-y-0 left-0 w-[14px]"
        style={{ backgroundColor: accent }}
        aria-hidden
      />
      <div className="min-w-0 pt-10 px-10 pb-8" style={{ marginLeft: '14px' }}>
        <header className="mb-7">
          <div className="flex items-start gap-4">
            {contact.photo && (
              <img src={contact.photo} alt="" className="w-14 h-14 rounded-lg object-cover border-2 shrink-0" style={{ borderColor: accent }} />
            )}
            <div className="min-w-0">
              {name && (
                <h1 className="text-[24px] font-extrabold text-[#0f172a] tracking-tight pl-3" style={{ borderLeft: `4px solid ${accent}` }}>
                  {name}
                </h1>
              )}
              {jobTarget?.trim() && (
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] mt-1 pl-3" style={{ color: safeAccent }}>
                  {jobTarget.trim()}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[11px] text-[#64748b] mt-3 pl-3">
            {contact.email && <span>{contact.email}</span>}
            {contact.phone && <span>{contact.phone}</span>}
            {(contact.address?.trim() || contact.location) && <span>{(contact.address?.trim() || contact.location)}</span>}
            {contact.website && <a href={contact.website} style={{ color: safeAccent }} className="hover:underline">{contact.website.replace(/^https?:\/\//, '')}</a>}
          </div>
        </header>

        {summary && (
          <section className={resumeSpacing.section}>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.22em] mb-2" style={{ color: safeAccent }}>Summary</h2>
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
            <h2 className="text-[10px] font-bold uppercase tracking-[0.22em] mb-2" style={{ color: safeAccent }}>Skills</h2>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {skills.filter(Boolean).map((s, i) => (
                <span key={i} className="text-[11px] px-2.5 py-[3px] rounded-md border border-[#d1d5db] bg-[#f8fafc] text-[#1e293b] font-medium">{s}</span>
              ))}
            </div>
          </section>
        )}

        {showExp && (
          <section className={resumeSpacing.section}>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.22em] mb-2" style={{ color: safeAccent }}>Experience</h2>
            <div className={resumeSpacing.expWrapper}>
              {experience.filter(hasContent).map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline gap-2 flex-nowrap">
                    <span className="font-bold text-[#0f172a] min-w-0 truncate">{exp.jobTitle}</span>
                    <span className="text-[10.5px] text-[#94a3b8] whitespace-nowrap shrink-0 font-medium">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <div className="text-[11.5px] text-[#64748b] mt-0.5 font-medium">{exp.company}{exp.location && ` · ${exp.location}`}</div>
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
            <h2 className="text-[10px] font-bold uppercase tracking-[0.22em] mb-2" style={{ color: safeAccent }}>Education</h2>
            {education.filter(hasEduContent).map((edu) => (
              <div key={edu.id} className={resumeSpacing.eduEntry} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <div className="font-bold text-[#0f172a]">{edu.degree}</div>
                <div className="flex justify-between items-baseline gap-x-2 mt-0.5">
                  <span className="text-[11.5px] text-[#64748b] font-medium">
                    {edu.school}
                    {edu.location && ` · ${edu.location}`}
                  </span>
                  {edu.startDate && (
                    <span className="text-[10.5px] text-[#94a3b8] whitespace-nowrap shrink-0 ml-auto">{edu.startDate} – {edu.endDate}</span>
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
          </section>
        )}

        {hasRefs && (
          <section>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.22em] mb-2" style={{ color: safeAccent }}>References</h2>
            <div className={resumeSpacing.refBlock}>
              {references!.map((ref, i) => (
                <div key={i}>
                  <span className="font-semibold text-[#0f172a]">{ref.name}</span>
                  {ref.affiliation && <span className="text-[#64748b]">, {ref.affiliation}</span>}
                  {ref.email && <span className="text-[#94a3b8]"> · {ref.email}</span>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
