import { useResume } from '../context/ResumeContext'
import type { TemplateId } from '../types/resume'

type LayoutStyle = 'single' | 'header' | 'twoColumn' | 'sidebar'

const templates: { id: TemplateId; name: string; layout: LayoutStyle }[] = [
  { id: 'professional', name: 'Professional', layout: 'sidebar' },
  { id: 'classic', name: 'Classic', layout: 'single' },
  { id: 'traditional', name: 'Traditional', layout: 'single' },
  { id: 'modern', name: 'Modern', layout: 'header' },
  { id: 'corporate', name: 'Corporate', layout: 'sidebar' },
  { id: 'clean', name: 'Clean', layout: 'single' },
  { id: 'minimal', name: 'Minimal', layout: 'single' },
  { id: 'balanced', name: 'Balanced', layout: 'header' },
  { id: 'header-ats', name: 'Header ATS', layout: 'header' },
  { id: 'sidebar-right', name: 'Sidebar', layout: 'sidebar' },
  { id: 'centered-clean', name: 'Centered', layout: 'single' },
  { id: 'accent-bar', name: 'Accent Bar', layout: 'header' },
  { id: 'vertical-line', name: 'Vertical Line', layout: 'single' },
  { id: 'initials-header', name: 'Initials', layout: 'header' },
  { id: 'divided', name: 'Divided', layout: 'single' },
  { id: 'story', name: 'Story', layout: 'single' },
  { id: 'deco', name: 'Deco', layout: 'header' },
  { id: 'proficiency', name: 'Proficiency', layout: 'sidebar' },
  { id: 'header-profile', name: 'Profile', layout: 'header' },
  { id: 'elegant', name: 'Elegant', layout: 'single' },
  { id: 'pillar', name: 'Pillar', layout: 'sidebar' },
  { id: 'spotlight', name: 'Spotlight', layout: 'single' },
  { id: 'card', name: 'Card', layout: 'single' },
  { id: 'serif', name: 'Serif', layout: 'single' },
  { id: 'bold-block', name: 'Bold Block', layout: 'header' },
  { id: 'timeline', name: 'Timeline', layout: 'single' },
  { id: 'luxe', name: 'Luxe', layout: 'single' },
  { id: 'gradient', name: 'Gradient', layout: 'header' },
  { id: 'neon', name: 'Neon', layout: 'header' },
  { id: 'geometric', name: 'Geometric', layout: 'twoColumn' },
  { id: 'aura', name: 'Aura', layout: 'single' },
  { id: 'vivid', name: 'Vivid', layout: 'sidebar' },
]

function MiniPreview({ layout, active }: { layout: LayoutStyle; active: boolean }) {
  const accent = active ? '#f97316' : '#d6d3d1'
  const line = active ? '#a8a29e' : '#e7e5e4'
  const lineDark = active ? '#78716c' : '#d6d3d1'

  if (layout === 'header') {
    return (
      <svg viewBox="0 0 40 52" className="w-full h-full" fill="none">
        <rect x="0" y="0" width="40" height="11" rx="1" fill={accent} opacity={active ? 1 : 0.5} />
        <rect x="3" y="3" width="14" height="2" rx="0.5" fill="white" opacity="0.9" />
        <rect x="3" y="6.5" width="10" height="1" rx="0.5" fill="white" opacity="0.5" />
        <rect x="3" y="14" width="34" height="1.5" rx="0.5" fill={lineDark} />
        <rect x="3" y="18" width="34" height="1" rx="0.5" fill={line} />
        <rect x="3" y="20.5" width="30" height="1" rx="0.5" fill={line} />
        <rect x="3" y="23" width="32" height="1" rx="0.5" fill={line} />
        <rect x="3" y="27" width="20" height="1.5" rx="0.5" fill={lineDark} />
        <rect x="3" y="31" width="34" height="1" rx="0.5" fill={line} />
        <rect x="3" y="33.5" width="28" height="1" rx="0.5" fill={line} />
        <rect x="3" y="36" width="32" height="1" rx="0.5" fill={line} />
        <rect x="3" y="40" width="16" height="1.5" rx="0.5" fill={lineDark} />
        <rect x="3" y="44" width="34" height="1" rx="0.5" fill={line} />
        <rect x="3" y="46.5" width="26" height="1" rx="0.5" fill={line} />
      </svg>
    )
  }

  if (layout === 'sidebar') {
    return (
      <svg viewBox="0 0 40 52" className="w-full h-full" fill="none">
        <rect x="0" y="0" width="13" height="52" fill={accent} opacity={active ? 0.85 : 0.3} />
        <rect x="2" y="3" width="9" height="2" rx="0.5" fill="white" opacity="0.9" />
        <rect x="2" y="7" width="9" height="1" rx="0.5" fill="white" opacity="0.5" />
        <rect x="2" y="9.5" width="7" height="1" rx="0.5" fill="white" opacity="0.5" />
        <rect x="2" y="14" width="8" height="1.5" rx="0.5" fill="white" opacity="0.7" />
        <rect x="2" y="17" width="9" height="1" rx="0.5" fill="white" opacity="0.4" />
        <rect x="2" y="19.5" width="7" height="1" rx="0.5" fill="white" opacity="0.4" />
        <rect x="2" y="22" width="9" height="1" rx="0.5" fill="white" opacity="0.4" />
        <rect x="16" y="3" width="16" height="2" rx="0.5" fill={lineDark} />
        <rect x="16" y="6.5" width="12" height="1" rx="0.5" fill={line} />
        <rect x="16" y="10" width="20" height="1.5" rx="0.5" fill={lineDark} />
        <rect x="16" y="14" width="21" height="1" rx="0.5" fill={line} />
        <rect x="16" y="16.5" width="18" height="1" rx="0.5" fill={line} />
        <rect x="16" y="19" width="20" height="1" rx="0.5" fill={line} />
        <rect x="16" y="23" width="14" height="1.5" rx="0.5" fill={lineDark} />
        <rect x="16" y="27" width="21" height="1" rx="0.5" fill={line} />
        <rect x="16" y="29.5" width="17" height="1" rx="0.5" fill={line} />
        <rect x="16" y="34" width="14" height="1.5" rx="0.5" fill={lineDark} />
        <rect x="16" y="38" width="21" height="1" rx="0.5" fill={line} />
        <rect x="16" y="40.5" width="18" height="1" rx="0.5" fill={line} />
      </svg>
    )
  }

  if (layout === 'twoColumn') {
    return (
      <svg viewBox="0 0 40 52" className="w-full h-full" fill="none">
        <rect x="3" y="3" width="20" height="2.5" rx="0.5" fill={lineDark} />
        <rect x="3" y="7" width="14" height="1" rx="0.5" fill={line} />
        <rect x="3" y="9.5" width="34" height="0.5" fill={accent} opacity={active ? 1 : 0.4} />
        <rect x="3" y="13" width="12" height="1.5" rx="0.5" fill={lineDark} />
        <rect x="3" y="17" width="16" height="1" rx="0.5" fill={line} />
        <rect x="3" y="19.5" width="14" height="1" rx="0.5" fill={line} />
        <rect x="3" y="22" width="15" height="1" rx="0.5" fill={line} />
        <rect x="3" y="26" width="12" height="1.5" rx="0.5" fill={lineDark} />
        <rect x="3" y="30" width="16" height="1" rx="0.5" fill={line} />
        <rect x="3" y="32.5" width="13" height="1" rx="0.5" fill={line} />
        <rect x="23" y="13" width="10" height="1.5" rx="0.5" fill={lineDark} />
        <rect x="23" y="17" width="14" height="1" rx="0.5" fill={line} />
        <rect x="23" y="19.5" width="12" height="1" rx="0.5" fill={line} />
        <rect x="23" y="23" width="10" height="1.5" rx="0.5" fill={lineDark} />
        <rect x="23" y="27" width="14" height="1" rx="0.5" fill={line} />
        <rect x="23" y="29.5" width="11" height="1" rx="0.5" fill={line} />
        <rect x="23" y="32" width="13" height="1" rx="0.5" fill={line} />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 40 52" className="w-full h-full" fill="none">
      <rect x="8" y="3" width="24" height="2.5" rx="0.5" fill={lineDark} />
      <rect x="10" y="7" width="20" height="1" rx="0.5" fill={line} />
      <rect x="15" y="9.5" width="10" height="0.5" fill={accent} opacity={active ? 1 : 0.4} />
      <rect x="3" y="13" width="34" height="1.5" rx="0.5" fill={lineDark} />
      <rect x="3" y="17" width="34" height="1" rx="0.5" fill={line} />
      <rect x="3" y="19.5" width="30" height="1" rx="0.5" fill={line} />
      <rect x="3" y="22" width="32" height="1" rx="0.5" fill={line} />
      <rect x="3" y="26" width="20" height="1.5" rx="0.5" fill={lineDark} />
      <rect x="3" y="30" width="34" height="1" rx="0.5" fill={line} />
      <rect x="3" y="32.5" width="28" height="1" rx="0.5" fill={line} />
      <rect x="3" y="35" width="32" height="1" rx="0.5" fill={line} />
      <rect x="3" y="39" width="16" height="1.5" rx="0.5" fill={lineDark} />
      <rect x="3" y="43" width="34" height="1" rx="0.5" fill={line} />
      <rect x="3" y="45.5" width="26" height="1" rx="0.5" fill={line} />
    </svg>
  )
}

export function TemplatePicker() {
  const { template, setTemplate } = useResume()

  return (
    <div>
      <p className="text-xs font-semibold text-[#1c1917] mb-3">Template</p>
      <div className="grid grid-cols-3 gap-2.5">
        {templates.map((t) => {
          const active = template === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTemplate(t.id)}
              className={`group flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all ${
                active
                  ? 'border-[#f97316] bg-[#fff7ed]'
                  : 'border-transparent hover:border-[#e7e5e4] bg-[#fafaf9] hover:bg-white'
              }`}
            >
              <div className={`w-full aspect-[40/52] rounded-md overflow-hidden border transition-all ${
                active ? 'border-[#f97316]/30 shadow-sm' : 'border-[#e7e5e4] group-hover:border-[#d6d3d1]'
              } bg-white`}>
                <MiniPreview layout={t.layout} active={active} />
              </div>
              <span className={`text-[11px] font-medium leading-tight text-center transition-colors ${
                active ? 'text-[#f97316]' : 'text-[#44403c] group-hover:text-[#1c1917]'
              }`}>
                {t.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
