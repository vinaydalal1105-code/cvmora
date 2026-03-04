import { useResume } from '../context/ResumeContext'
import type { TemplateId } from '../types/resume'

const templates: { id: TemplateId; name: string; desc: string }[] = [
  { id: 'professional', name: 'Professional', desc: 'Job-winning, recruiter-friendly' },
  { id: 'classic', name: 'Classic', desc: 'Traditional one-column' },
  { id: 'modern', name: 'Modern', desc: 'Clean with accent highlights' },
  { id: 'corporate', name: 'Corporate', desc: 'Two-column with sidebar' },
  { id: 'clean', name: 'Clean', desc: 'Bold, minimal layout' },
  { id: 'minimal', name: 'Minimal', desc: 'Simple and timeless' },
  { id: 'sidebar-right', name: 'Sidebar', desc: 'Contact & skills in right sidebar' },
  { id: 'centered-clean', name: 'Centered', desc: 'Centered name, single column' },
  { id: 'accent-bar', name: 'Accent Bar', desc: 'Accent header, two-column body' },
  { id: 'vertical-line', name: 'Vertical Line', desc: 'Thin left accent bar, clean sections' },
  { id: 'initials-header', name: 'Initials Header', desc: 'Initials box + name + contact' },
  { id: 'divided', name: 'Divided', desc: 'Horizontal divider, bold sections' },
  { id: 'story', name: 'Story', desc: 'Hello intro + numbered sections' },
  { id: 'deco', name: 'Deco', desc: 'Decorative header, accent underlines' },
  { id: 'proficiency', name: 'Proficiency', desc: 'Sidebar with contact & skills' },
  { id: 'header-profile', name: 'Header Profile', desc: 'Band with name + profile summary' },
  { id: 'elegant', name: 'Elegant', desc: 'Centered, short underlines' },
  { id: 'pillar', name: 'Pillar', desc: 'Accent strip, editorial' },
  { id: 'spotlight', name: 'Spotlight', desc: 'Name highlight, dot sections' },
  { id: 'card', name: 'Card', desc: 'Section cards, scannable' },
  { id: 'serif', name: 'Serif', desc: 'Serif headings, elegant' },
  { id: 'bold-block', name: 'Bold Block', desc: 'Dark header block, high-impact' },
  { id: 'timeline', name: 'Timeline', desc: 'Vertical timeline with dates' },
  { id: 'luxe', name: 'Luxe', desc: 'Refined, premium spacing' },
]

export function TemplatePicker() {
  const { template, setTemplate } = useResume()

  return (
    <div className="flex flex-wrap gap-2">
      {templates.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => setTemplate(t.id)}
          className={`px-4 py-2.5 rounded-[980px] text-[17px] font-normal transition-all duration-150 ${
            template === t.id
              ? 'bg-[#f97316] text-white'
              : 'bg-white border border-[#e7e5e4] text-[#1c1917] hover:border-[#f97316]/40 hover:text-[#f97316]'
          }`}
        >
          {t.name}
        </button>
      ))}
    </div>
  )
}
