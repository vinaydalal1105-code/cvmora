import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing, textSafeAccent, truncateForPreview } from './resumeSpacing'

function hasContent(exp: { jobTitle?: string; company?: string; description?: string }) {
  return !!(exp.jobTitle?.trim() || exp.company?.trim() || exp.description?.trim())
}
function hasEduContent(edu: { degree?: string; school?: string; description?: string }) {
  return !!(edu.degree?.trim() || edu.school?.trim() || edu.description?.trim())
}

const NUMS = ['01', '02', '03', '04', '05', '06'] as const
const TITLES = ['Profile', 'Skills', 'Experience', 'Education', 'References'] as const

/** Narrative numbered sections. Name at top, job title in accent. Section numbers large and accent-colored. Skills as horizontal pills. Friendly, approachable, modern. */
export function StoryTemplate({ data, accentColor }: { data: ResumeData; accentColor?: string }) {
  const { contact, summary, experience, education, skills, references, jobTarget } = data
  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const showExp = experience.some(hasContent)
  const showEdu = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const hasSummary = !!(summary?.trim())
  const hasSkills = skills.filter(Boolean).length > 0
  const accent = accentColor ?? '#8b5cf6'
  const safeAccent = textSafeAccent(accent)

  const SectionHeader = ({ n, t }: { n: string; t: string }) => (
    <h2 className="flex items-baseline gap-3 mb-3">
      <span
        className="text-[18px] font-light tabular-nums"
        style={{ color: safeAccent }}
      >
        {n}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f172a]">{t}</span>
    </h2>
  )

  const ContactDot = () => (
    <span
      className="w-1 h-1 rounded-full shrink-0"
      style={{ backgroundColor: accent }}
      aria-hidden
    />
  )

  return (
    <div className="story-template bg-white text-[#374151] pt-10 px-8 pb-8 min-h-0 max-w-[210mm] mx-auto font-sans">
      <header className="mb-8 pb-6 border-b border-[#e2e8f0]">
        <div className="flex items-start gap-4">
          {contact.photo && (
            <img
              src={contact.photo}
              alt=""
              className="w-14 h-14 rounded-full object-cover shrink-0 border-2"
              style={{ borderColor: accent }}
            />
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-[26px] font-semibold text-[#0f172a] tracking-tight leading-tight">
              {name || 'Your name'}
            </h1>
            {jobTarget?.trim() && (
              <p className="text-[12.5px] mt-0.5 font-medium" style={{ color: safeAccent }}>
                {jobTarget.trim()}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-[12.5px] text-[#64748b]">
              {contact.email && (
                <>
                  <ContactDot />
                  <span>{contact.email}</span>
                </>
              )}
              {contact.phone && (
                <>
                  <ContactDot />
                  <span>{contact.phone}</span>
                </>
              )}
              {(contact.address?.trim() || contact.location) && (
                <>
                  <ContactDot />
                  <span>{contact.address?.trim() || contact.location}</span>
                </>
              )}
              {!contact.email && !contact.phone && !(contact.address?.trim() || contact.location) && (
                <span className="text-[#94a3b8]">Email · Phone · Location</span>
              )}
            </div>
          </div>
        </div>
      </header>

      {hasSummary && (
        <section className={resumeSpacing.section}>
          <SectionHeader n={NUMS[0]} t={TITLES[0]} />
          {data.descriptionFormat === 'bullets' && summary.includes('\n') ? (
            <ul className="list-disc pl-4 text-[12.5px] text-[#374151] space-y-1 summary-desc">
              {summary.split('\n').filter((l) => l.trim()).map((l, i) => (
                <li key={i}>{l.replace(/^[•\-]\s*/, '').trim()}</li>
              ))}
            </ul>
          ) : (
            <p className={resumeSpacing.summary}>{truncateForPreview(summary)}</p>
          )}
        </section>
      )}

      {hasSkills && (
        <section className={resumeSpacing.section}>
          <SectionHeader n={NUMS[1]} t={TITLES[1]} />
          <div className="flex flex-wrap gap-2 mt-1">
            {skills.filter(Boolean).map((s, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-[12px] font-medium text-[#1e293b] border border-[#d1d5db] bg-[#f8fafc]"
              >
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {showExp && (
        <section className={resumeSpacing.section}>
          <SectionHeader n={NUMS[2]} t={TITLES[2]} />
          <div className={resumeSpacing.expWrapper}>
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
                    {line(exp.description).map((b, i) => (
                      <li key={i}>{b.replace(/^[•\-]\s*/, '')}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {showEdu && (
        <section className={resumeSpacing.section}>
          <SectionHeader n={NUMS[3]} t={TITLES[3]} />
          {education.filter(hasEduContent).map((edu) => (
            <div
              key={edu.id}
              className={resumeSpacing.eduEntry}
              style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
            >
              <div className="font-semibold text-[#0f172a] text-[12.5px]">{edu.degree}</div>
              <div className="flex justify-between items-baseline gap-x-2 mt-0.5">
                <span className="text-[12.5px] text-[#64748b] font-medium">
                  {edu.school}
                  {edu.location && ` · ${edu.location}`}
                </span>
                {edu.startDate && (
                  <span className="text-[10.5px] text-[#64748b] whitespace-nowrap shrink-0 ml-auto">
                    {edu.startDate} – {edu.endDate}
                  </span>
                )}
              </div>
              {edu.description && (
                <ul className="list-disc pl-4 mt-1 text-[12.5px] text-[#374151] space-y-0.5 edu-desc">
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
          <SectionHeader n={NUMS[4]} t={TITLES[4]} />
          <div className={resumeSpacing.refBlock}>
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
