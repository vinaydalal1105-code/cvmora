import type { ResumeData } from '../types/resume'
import { displayName } from '../utils/resume'
import { resumeSpacing } from './resumeSpacing'

function hasContent(exp: { jobTitle?: string; company?: string; description?: string }) {
  return !!(exp.jobTitle?.trim() || exp.company?.trim() || exp.description?.trim())
}
function hasEduContent(edu: { degree?: string; school?: string; description?: string }) {
  return !!(edu.degree?.trim() || edu.school?.trim() || edu.description?.trim())
}

const NUMS = ['01', '02', '03', '04', '05'] as const
const TITLES = ['Profile', 'Skills', 'Experience', 'Education', 'References'] as const

export function StoryTemplate({ data, accentColor }: { data: ResumeData; accentColor?: string }) {
  const { contact, summary, experience, education, skills, references, jobTarget } = data
  const line = (s: string) => s.split('\n').filter(Boolean)
  const name = displayName(contact)
  const showExp = experience.some(hasContent)
  const showEdu = education.some(hasEduContent)
  const hasRefs = references && references.length > 0
  const accent = accentColor ?? '#2563eb'
  const intro = name || jobTarget
    ? `Hello! I'm ${name || 'your name'}.${jobTarget ? ` I'm a ${jobTarget}.` : ''} This is my resume.`
    : 'This is my resume.'

  const Badge = ({ n, t }: { n: string; t: string }) => (
    <h2 className="flex items-baseline gap-2 mb-1.5">
      <span className="text-[11px] font-bold text-white rounded px-1.5 py-0.5" style={{ backgroundColor: accent }}>{n}</span>
      <span className="text-[11px] font-bold uppercase tracking-widest text-[#1c1c1c]">{t}</span>
    </h2>
  )

  return (
    <div className="story-template bg-white text-[#1c1c1c] pt-10 px-8 pb-6 min-h-0 max-w-[210mm] mx-auto font-sans text-sm">
      <p className="text-[15px] text-[#1c1917] leading-relaxed mb-1">{intro}</p>
      <div className="flex flex-wrap gap-x-4 text-[12px] text-[#6b7280] mb-6 pb-4 border-b border-[#e5e7eb]">
        {contact.email && <span>{contact.email}</span>}
        {contact.phone && <span>{contact.phone}</span>}
        {contact.location && <span>{contact.location}</span>}
      </div>
      {summary && (
        <section className={resumeSpacing.section}>
          <Badge n={NUMS[0]} t={TITLES[0]} />
          <p className={resumeSpacing.summary}>{summary}</p>
        </section>
      )}
      {skills.filter(Boolean).length > 0 && (
        <section className={resumeSpacing.section}>
          <Badge n={NUMS[1]} t={TITLES[1]} />
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-1 text-[13px] text-[#333]">
            {skills.filter(Boolean).map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: accent }} aria-hidden />
                {s}
              </div>
            ))}
          </div>
        </section>
      )}
      {showExp && (
        <section className={resumeSpacing.section}>
          <Badge n={NUMS[2]} t={TITLES[2]} />
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
      {showEdu && (
        <section className={resumeSpacing.section}>
          <Badge n={NUMS[3]} t={TITLES[3]} />
          {education.filter(hasEduContent).map((edu) => (
            <div key={edu.id} className={resumeSpacing.eduEntry}>
              <div className="font-semibold text-[#1c1c1c]">{edu.degree}</div>
              <div className="text-[12px] text-[#4b5563] mt-0.5">{edu.school}{edu.location && ` · ${edu.location}`}{edu.startDate && ` · ${edu.startDate} – ${edu.endDate}`}</div>
              {edu.description && <p className={resumeSpacing.eduDescriptionSm}>{edu.description}</p>}
            </div>
          ))}
        </section>
      )}
      {hasRefs && (
        <section>
          <Badge n={NUMS[4]} t={TITLES[4]} />
          <div className={resumeSpacing.refBlock}>
            {references!.map((ref, i) => (
              <div key={i}>
                <span className="font-medium text-[#1c1c1c]">{ref.name}</span>
                {ref.affiliation && <span className="text-[#4b5563]">, {ref.affiliation}</span>}
                {ref.email && <span className="text-[#6b7280]"> · {ref.email}</span>}
                {ref.phone && <span className="text-[#6b7280]"> · {ref.phone}</span>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
