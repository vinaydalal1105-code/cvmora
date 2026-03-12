import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing, textSafeAccent } from './resumeSpacing'

function hasContent(exp: { jobTitle?: string; company?: string; description?: string }) {
  return !!(exp.jobTitle?.trim() || exp.company?.trim() || exp.description?.trim())
}
function hasEduContent(edu: { degree?: string; school?: string; description?: string }) {
  return !!(edu.degree?.trim() || edu.school?.trim() || edu.description?.trim())
}

export function LuxeTemplate({ data, accentColor }: { data: ResumeData; accentColor?: string }) {
  const { contact, summary, experience, education, skills, references, jobTarget } = data
  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const showExp = experience.some(hasContent)
  const showEdu = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const accent = accentColor ?? '#92400e'
  const safeAccent = textSafeAccent(accent)

  const H = ({ title }: { title: string }) => (
    <h2 className="mb-2.5 flex items-center gap-3">
      <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#94a3b8]" style={{ fontFamily: 'sans-serif' }}>{title}</span>
      <span className="flex-1 h-px bg-[#e5e7eb]" />
    </h2>
  )

  return (
    <div className="luxe-template bg-white text-[#1a1a1a] pt-12 px-12 pb-10 min-h-[842px] max-w-[210mm] mx-auto text-[13px] leading-[1.55] overflow-visible">
      <header className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="flex-1 max-w-[60px] h-px" style={{ backgroundColor: accent }} />
          <span className="w-2 h-2 rotate-45" style={{ backgroundColor: accent }} />
          <span className="flex-1 max-w-[60px] h-px" style={{ backgroundColor: accent }} />
        </div>
        {name && (
          <h1 className="text-[32px] font-extralight text-[#0f172a] tracking-[0.06em] leading-none" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            {name.toUpperCase()}
          </h1>
        )}
        {jobTarget?.trim() && (
          <p className="text-[11px] tracking-[0.3em] uppercase mt-2 font-medium font-sans" style={{ color: safeAccent }}>
            {jobTarget.trim()}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-0.5 text-[11px] text-[#94a3b8] mt-4 font-sans">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {(contact.address?.trim() || contact.location) && <span>{(contact.address?.trim() || contact.location)}</span>}
        </div>
        <div className="flex items-center justify-center gap-3 mt-4">
          <span className="flex-1 max-w-[60px] h-px" style={{ backgroundColor: accent }} />
          <span className="w-2 h-2 rotate-45" style={{ backgroundColor: accent }} />
          <span className="flex-1 max-w-[60px] h-px" style={{ backgroundColor: accent }} />
        </div>
      </header>

      {summary && (
        <section className="mb-6">
          <H title="Summary" />
          {data.descriptionFormat === 'bullets' && summary.includes('\n') ? (
            <ul className="list-disc ml-4 text-[12.5px] text-[#475569] space-y-1 summary-desc leading-[1.65]">
              {summary.split('\n').filter((l) => l.trim()).map((l, i) => (
                <li key={i} style={{ fontFamily: 'Georgia, serif' }}>{l.replace(/^[•\-]\s*/, '').trim()}</li>
              ))}
            </ul>
          ) : (
            <p className="text-[12.5px] text-[#475569] leading-[1.7] max-w-[92%]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>{summary}</p>
          )}
        </section>
      )}

      {skills.filter(Boolean).length > 0 && (
        <section className="mb-6">
          <H title="Skills" />
          <p className="text-[12.5px] text-[#475569] leading-[1.8] tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
            {skills.filter(Boolean).join('  ·  ')}
          </p>
        </section>
      )}

      {showExp && (
        <section className="mb-6">
          <H title="Experience" />
          <div className={resumeSpacing.expWrapper}>
            {experience.filter(hasContent).map((exp) => (
              <div key={exp.id} className="pb-3.5 border-b border-[#f1f5f9] last:border-0 last:pb-0">
                <div className="flex justify-between items-baseline gap-2 flex-nowrap">
                  <span className="font-semibold text-[#0f172a] min-w-0 truncate" style={{ fontFamily: 'Georgia, serif' }}>{exp.jobTitle}</span>
                  <span className="text-[10.5px] text-[#94a3b8] font-sans whitespace-nowrap shrink-0">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div className="text-[11.5px] text-[#94a3b8] mt-0.5 font-sans font-medium tracking-wide">{exp.company}{exp.location && ` · ${exp.location}`}</div>
                {exp.description && (
                  <ul className={`${resumeSpacing.bulletList} exp-desc`}>
                    {line(exp.description).map((b, i) => <li key={i} style={{ fontFamily: 'Georgia, serif' }}>{b.replace(/^[•\-]\s*/, '')}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {showEdu && (
        <section className="mb-6">
          <H title="Education" />
          {education.filter(hasEduContent).map((edu) => (
            <div key={edu.id} className={resumeSpacing.eduEntry} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <div className="font-semibold text-[#0f172a]" style={{ fontFamily: 'Georgia, serif' }}>{edu.degree}</div>
              <div className="flex justify-between items-baseline gap-x-2 mt-0.5">
                <span className="text-[11.5px] text-[#94a3b8] font-sans font-medium">
                  {edu.school}
                  {edu.location && ` · ${edu.location}`}
                </span>
                {edu.startDate && (
                  <span className="text-[10.5px] text-[#94a3b8] whitespace-nowrap shrink-0 ml-auto font-sans">{edu.startDate} – {edu.endDate}</span>
                )}
              </div>
              {edu.description && (
                <ul className="list-disc ml-4 mt-1 text-[12px] text-[#475569] space-y-0.5 edu-desc leading-[1.6]">
                  {edu.description.split('\n').filter(Boolean).map((line, j) => (
                    <li key={j} style={{ fontFamily: 'Georgia, serif' }}>{line}</li>
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
          <div className={`${resumeSpacing.refBlock} text-[#475569]`}>
            {references!.map((ref, i) => (
              <div key={i} className="break-words min-w-0">
                <span className="font-medium text-[#0f172a]" style={{ fontFamily: 'Georgia, serif' }}>{ref.name}</span>
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
