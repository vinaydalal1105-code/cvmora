import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing } from './resumeSpacing'

function isLightBg(hex: string): boolean {
  const h = hex.replace(/^#/, '')
  if (h.length !== 6) return false
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255
  return 0.299 * r + 0.587 * g + 0.114 * b > 0.55
}

function hasContent(exp: { jobTitle?: string; company?: string; description?: string }) {
  return !!(exp.jobTitle?.trim() || exp.company?.trim() || exp.description?.trim())
}
function hasEduContent(edu: { degree?: string; school?: string; description?: string }) {
  return !!(edu.degree?.trim() || edu.school?.trim() || edu.description?.trim())
}

/** Full-width band: name, title, profile summary inside; then two-column body. */
export function HeaderProfileTemplate({ data, accentColor }: { data: ResumeData; accentColor?: string }) {
  const { jobTarget, contact, summary, experience, education, skills, references } = data
  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const showExp = experience.some(hasContent)
  const showEdu = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const barColor = accentColor ?? '#1e3a5f'
  const light = isLightBg(barColor)
  const textCls = light ? 'text-[#1c1917]' : 'text-white'
  const mutedCls = light ? 'text-[#4b5563]' : 'text-white/90'

  return (
    <div className="header-profile-template bg-white text-[#1c1c1c] min-h-0 max-w-[210mm] mx-auto font-sans text-sm">
      <header className={`px-8 py-5 ${textCls}`} style={{ backgroundColor: barColor }}>
        {name && <h1 className="text-2xl font-bold tracking-tight uppercase">{name}</h1>}
        {jobTarget?.trim() && <p className={`text-sm ${mutedCls} mt-0.5`}>{jobTarget.trim()}</p>}
        {summary && (
          <p className={`text-[13px] ${mutedCls} mt-3 leading-relaxed max-w-[90%]`}>
            {summary.slice(0, 220)}{summary.length > 220 ? '…' : ''}
          </p>
        )}
        <div className={`flex flex-wrap gap-x-4 gap-y-0.5 text-[12px] ${mutedCls} mt-3`}>
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {contact.location && <span>{contact.location}</span>}
        </div>
      </header>
      <div className="flex">
        <div className="w-[60%] min-w-0 pt-6 pl-8 pr-5 pb-6">
          {experience.some(hasContent) && (
            <section className={resumeSpacing.section}>
              <h2 className={resumeSpacing.sectionHeading}>Employment History</h2>
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
          {education.some(hasEduContent) && (
            <section className={resumeSpacing.section}>
              <h2 className={resumeSpacing.sectionHeading}>Education</h2>
              {education.filter(hasEduContent).map((edu) => (
                <div key={edu.id} className={resumeSpacing.eduEntry}>
                  <div className="font-semibold text-[#1c1c1c]">{edu.degree}</div>
                  <div className="text-[12px] text-[#4b5563] mt-0.5">{edu.school}{edu.location && ` · ${edu.location}`}</div>
                  {edu.description && <p className={resumeSpacing.eduDescriptionSm}>{edu.description}</p>}
                </div>
              ))}
            </section>
          )}
        </div>
        <div className="w-[40%] min-w-0 pt-6 pl-5 pr-8 pb-6 border-l border-[#e5e7eb]">
          {skills.filter(Boolean).length > 0 && (
            <section className={resumeSpacing.section}>
              <h2 className={resumeSpacing.sectionHeading}>Skills</h2>
              <ul className="space-y-1 text-[13px] text-[#333] list-disc pl-4">
                {skills.filter(Boolean).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </section>
          )}
          {hasRefs && (
            <section>
              <h2 className={resumeSpacing.sectionHeading}>References</h2>
              <div className={resumeSpacing.refBlock}>
                {references!.map((ref, i) => (
                  <div key={i}>
                    <span className="font-medium text-[#1c1c1c]">{ref.name}</span>
                    {ref.affiliation && <span className="text-[#4b5563]">, {ref.affiliation}</span>}
                    {ref.phone && <span className="text-[#6b7280]"> · {ref.phone}</span>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
