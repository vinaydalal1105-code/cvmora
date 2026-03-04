export type TemplatePreviewStyle = 'single' | 'twoColumn' | 'header'

export type TemplateCategory = 'simple' | 'professional' | 'modern' | 'ats' | 'twoColumn' | 'picture'

export interface ResumeTemplate {
  id: string
  name: string
  desc: string
  tag: string | null
  users?: string
  colors?: string[]
  pdf?: boolean
  docx?: boolean
  goldStandard?: boolean
  previewStyle?: TemplatePreviewStyle
  ats?: boolean
  category?: TemplateCategory
}

export const allTemplates: ResumeTemplate[] = [
  { id: 'classic', name: 'Classic', desc: 'Classically structured resume template, for a robust career history.', tag: null, users: '2.2M+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'single', ats: true, category: 'simple' },
  { id: 'traditional', name: 'Traditional', desc: 'Classic full-page resume template with sizable resume sections.', tag: null, users: '2.2M+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'single', ats: true, category: 'simple' },
  { id: 'professional', name: 'Professional', desc: 'A touch of personality with a well-organized resume structure. Job-winning, recruiter-friendly.', tag: 'Popular', users: '6M+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'single', ats: true, category: 'professional' },
  { id: 'modern', name: 'Modern', desc: 'Current and stylish. Great for tech and creative roles. Tech-inspired design, minimalist page.', tag: 'ATS', users: '450K+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'twoColumn', ats: true, category: 'modern' },
  { id: 'simple-ats', name: 'Simple ATS', desc: 'Clean, modern template design that is easily read by ATS scanners. ATS-optimized.', tag: 'Gold Standard', users: '440K+ users', colors: ['Monochrome'], pdf: true, docx: true, goldStandard: true, previewStyle: 'single', ats: true, category: 'ats' },
  { id: 'balanced', name: 'Balanced', desc: 'Modern and eye-catching resume template. Beautiful contrasting structure.', tag: null, users: '2.5M+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'single', ats: true, category: 'professional' },
  { id: 'header-ats', name: 'Header ATS', desc: 'Dedicated achievements section to highlight successes. ATS-optimized template to increase visibility.', tag: 'ATS', users: '330K+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'header', ats: true, category: 'ats' },
  { id: 'minimal', name: 'Minimal', desc: 'Simple and timeless. Puts content first. Clean, orderly structure with stylish minimalism.', tag: 'Clean', users: '2M+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'single', ats: true, category: 'simple' },
  { id: 'vivid', name: 'Vivid', desc: 'Powerful modern resume template with bold section highlights.', tag: null, users: '1.9M+ users', colors: ['Monochrome'], pdf: true, docx: false, previewStyle: 'header', ats: false, category: 'modern' },
  { id: 'sidebar-right', name: 'Sidebar', desc: 'Two-column layout with contact and skills in a right accent sidebar. Clean and professional.', tag: null, users: '1.2M+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'twoColumn', ats: true, category: 'professional' },
  { id: 'centered-clean', name: 'Centered', desc: 'Single-column, centered name and contact with a thin accent line. Minimal and readable.', tag: null, users: '980K+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'single', ats: true, category: 'simple' },
  { id: 'accent-bar', name: 'Accent Bar', desc: 'Full-width accent header with name and contact; two-column body for summary, work, skills, and education.', tag: null, users: '1.1M+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'header', ats: true, category: 'professional' },
  { id: 'vertical-line', name: 'Vertical Line', desc: 'Thin vertical accent bar on the left; section titles and content aligned with a clean, modern look.', tag: null, users: '890K+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'single', ats: true, category: 'simple' },
  { id: 'initials-header', name: 'Initials Header', desc: 'Header with initials in a square box, name and contact on the right. Professional and memorable.', tag: null, users: '760K+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'single', ats: true, category: 'professional' },
  { id: 'divided', name: 'Divided', desc: 'Strong horizontal divider under header; bold section titles and clean single-column layout.', tag: null, users: '1.0M+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'single', ats: true, category: 'simple' },
  { id: 'story', name: 'Story', desc: 'Friendly intro line and numbered sections (01 Profile, 02 Experience). Minimal and approachable.', tag: null, users: '620K+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'single', ats: true, category: 'simple' },
  { id: 'deco', name: 'Deco', desc: 'Elegant header with accent underline and decorative icon; section titles with left bar and underline.', tag: null, users: '540K+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'single', ats: true, category: 'professional' },
  { id: 'proficiency', name: 'Proficiency', desc: 'Two-column with sidebar: contact, skills, and initials; main column for profile and employment.', tag: null, users: '710K+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'twoColumn', ats: true, category: 'professional' },
  { id: 'header-profile', name: 'Header Profile', desc: 'Full-width band with name, title, and profile summary; two-column body for experience and skills.', tag: null, users: '580K+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'header', ats: true, category: 'professional' },
  { id: 'elegant', name: 'Elegant', desc: 'Centered layout with short underlines under section titles. Symmetrical and highly readable.', tag: null, users: '670K+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'single', ats: true, category: 'simple' },
  { id: 'pillar', name: 'Pillar', desc: 'Narrow accent strip and bold name with left border. Editorial, modern layout.', tag: null, users: '520K+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'single', ats: true, category: 'professional' },
  { id: 'spotlight', name: 'Spotlight', desc: 'Name in a soft highlight box; section dots. Memorable first impression.', tag: null, users: '480K+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'single', ats: true, category: 'modern' },
  { id: 'card', name: 'Card', desc: 'Sections in soft bordered cards. Scannable and structured.', tag: null, users: '550K+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'single', ats: true, category: 'professional' },
  { id: 'serif', name: 'Serif', desc: 'Serif headings, sans-serif body. Elegant and distinctive.', tag: null, users: '410K+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'single', ats: true, category: 'simple' },
  { id: 'bold-block', name: 'Bold Block', desc: 'Strong dark header block; section labels in accent blocks. High-impact.', tag: null, users: '460K+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'header', ats: true, category: 'professional' },
  { id: 'timeline', name: 'Timeline', desc: 'Experience and education with a vertical timeline and date dots.', tag: null, users: '390K+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'single', ats: true, category: 'modern' },
  { id: 'luxe', name: 'Luxe', desc: 'Refined layout with thin accent rules and generous spacing. Premium feel.', tag: null, users: '350K+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'single', ats: true, category: 'simple' },
]

export const atsTemplates = allTemplates.filter((t) => t.ats)

export const categoryFilters = [
  { label: 'All templates', to: '/templates', active: false },
  { label: 'Simple', to: '/templates', active: false },
  { label: 'Word', to: '/templates', active: false },
  { label: 'Picture', to: '/templates', active: false },
  { label: 'ATS', to: '/templates/ats', active: true },
  { label: 'Two-column', to: '/templates', active: false },
  { label: 'Google Docs', to: '/templates', active: false },
]
