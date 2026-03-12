import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing, truncateForPreview } from './resumeSpacing'

function hasContent(exp: { jobTitle?: string; company?: string; description?: string }) {
  return !!(exp.jobTitle?.trim() || exp.company?.trim() || exp.description?.trim())
}
function hasEduContent(edu: { degree?: string; school?: string; description?: string }) {
  return !!(edu.degree?.trim() || edu.school?.trim() || edu.description?.trim())
}

/** Single column, perfectly centered. Name centered (28px light), thin accent line below (40px wide).
 * Job title small caps. Section headings centered with accent underline. Skills as centered pills. */
export function CenteredCleanTemplate({ data, accentColor }: { data: ResumeData; accentColor?: string }) {
  const { jobTarget, contact, summary, experience, education, skills, references } = data
  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const showExperience = experience.some(hasContent)
  const showEducation = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const hasSummary = !!(summary?.trim())
  const hasSkills = skills.filter(Boolean).length > 0
  const accent = accentColor ?? '#334155'
  const ph = (s: string) => <span className="text-[#94a3b8]">{s}</span>

  return (
    <div className="centered-clean-template bg-white text-[#374151] pt-12 px-10 pb-8 min-h-0 max-w-[210mm] mx-auto font-sans">
      <header className="text-center mb-10">
        {contact.photo && (
          <img
            src={contact.photo}
            alt=""
            className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-2 border-[#e2e8f0] shadow-sm"
          />
        )}
        <h1 className="text-[28px] font-light text-[#0f172a] tracking-tight">
          {name || ph('Your name')}
        </h1>
        <div
          className="h-[2px] w-10 mx-auto mt-3 mb-4 rounded-full"
          style={{ backgroundColor: accent }}
          aria-hidden
        />
        {jobTarget?.trim() && (
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#64748b]">
            {jobTarget.trim()}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-0.5 text-[12.5px] text-[#64748b] mt-4">
          {(contact.address?.trim() || contact.location) || contact.phone || contact.email ? (
            <>
              {(contact.address?.trim() || contact.location) && (
                <span>{(contact.address?.trim() || contact.location)}</span>
              )}
              {contact.phone && <span>{contact.phone}</span>}
              {contact.email && <span>{contact.email}</span>}
            </>
          ) : (
            ph('Email · Phone · Location')
          )}
        </div>
      </header>

      {hasSummary && (
        <section className={resumeSpacing.section}>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f172a] text-center mb-2 pb-1.5 border-b border-[#e2e8f0] w-fit mx-auto" style={{ borderBottomColor: accent }}>
            Professional Summary
          </h2>
          {data.descriptionFormat === 'bullets' && summary.includes('\n') ? (
            <ul className="list-disc pl-5 text-[12.5px] text-[#374151] space-y-1 leading-[1.65] summary-desc max-w-[85%] mx-auto">
              {summary.split('\n').filter((l) => l.trim()).map((l, i) => (
                <li key={i}>{l.replace(/^[•\-]\s*/, '').trim()}</li>
              ))}
            </ul>
          ) : (
            <p className="text-[12.5px] text-[#374151] leading-[1.65] text-center max-w-[90%] mx-auto">
              {truncateForPreview(summary)}
            </p>
          )}
        </section>
      )}

      {hasSkills && (
        <section className={resumeSpacing.section}>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f172a] text-center mb-3 pb-1.5 border-b border-[#e2e8f0] w-fit mx-auto" style={{ borderBottomColor: accent }}>
            Skills
          </h2>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {skills.filter(Boolean).map((s, i) => (
              <span
                key={i}
                className="px-3 py-1 text-[11px] font-medium text-[#374151] bg-[#f8fafc] rounded-full border border-[#e2e8f0]"
              >
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {showExperience && (
        <section className={resumeSpacing.section}>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f172a] text-center mb-3 pb-1.5 border-b border-[#e2e8f0] w-fit mx-auto" style={{ borderBottomColor: accent }}>
            Work History
          </h2>
          <div className={resumeSpacing.expWrapper} style={{ maxWidth: '92%', margin: '0 auto' }}>
            {experience.filter(hasContent).map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline gap-2 flex-nowrap">
                  <span className="font-semibold text-[#0f172a] min-w-0 truncate text-[12.5px]">
                    {exp.jobTitle}
                  </span>
                  <span className="text-[10.5px] text-[#64748b] whitespace-nowrap shrink-0">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-[12.5px] text-[#64748b] mt-0.5">
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
          </div>
        </section>
      )}

      {showEducation && (
        <section className={resumeSpacing.section}>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f172a] text-center mb-3 pb-1.5 border-b border-[#e2e8f0] w-fit mx-auto" style={{ borderBottomColor: accent }}>
            Education
          </h2>
          <div style={{ maxWidth: '92%', margin: '0 auto' }}>
            {education.filter(hasEduContent).map((edu) => (
              <div key={edu.id} className={resumeSpacing.eduEntry} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <div className="font-semibold text-[#0f172a] text-[12.5px]">{edu.degree}</div>
                <div className="flex justify-between items-baseline gap-x-2 mt-0.5">
                  <span className="text-[12.5px] text-[#64748b] font-medium">
                    {edu.school}
                    {edu.location && ` · ${edu.location}`}
                  </span>
                  {edu.startDate && (
                    <span className="text-[10.5px] text-[#94a3b8] whitespace-nowrap shrink-0 ml-auto">
                      {edu.startDate} – {edu.endDate}
                    </span>
                  )}
                </div>
                {edu.description && (
                  <ul className="list-disc pl-5 mt-1 text-[12.5px] text-[#374151] space-y-0.5 edu-desc">
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
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f172a] text-center mb-3 pb-1.5 border-b border-[#e2e8f0] w-fit mx-auto" style={{ borderBottomColor: accent }}>
            References
          </h2>
          <div className={`${resumeSpacing.refBlock} text-center`} style={{ maxWidth: '92%', margin: '0 auto' }}>
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
