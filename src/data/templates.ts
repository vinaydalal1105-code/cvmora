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
  { id: 'classic', name: 'Classic', desc: 'Timeless serif typography with elegant centered layout. Perfect for traditional industries and executive roles.', tag: 'Bestseller', users: '3.2M+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'single', ats: true, category: 'simple' },
  { id: 'traditional', name: 'Traditional', desc: 'Formal structure with distinctive section bars. Polished and authoritative for senior professionals.', tag: null, users: '2.8M+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'single', ats: true, category: 'simple' },
  { id: 'professional', name: 'Professional', desc: 'Premium two-column sidebar with skill tags. The go-to template for making a strong first impression.', tag: 'Most Popular', users: '6.5M+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'twoColumn', ats: true, category: 'professional' },
  { id: 'modern', name: 'Modern', desc: 'Bold header accent with clean typography. Tech-forward design loved by startups and creative teams.', tag: 'Trending', users: '4.1M+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'single', ats: true, category: 'modern' },
  { id: 'simple-ats', name: 'Simple ATS', desc: 'Ultra-clean, zero-decoration layout engineered for maximum ATS compatibility. Content-first design.', tag: 'Gold Standard', users: '3.8M+ users', colors: ['Monochrome'], pdf: true, docx: true, goldStandard: true, previewStyle: 'single', ats: true, category: 'ats' },
  { id: 'balanced', name: 'Balanced', desc: 'Striking dark header with two-column body. Bold yet professional for mid-career transitions.', tag: 'New Design', users: '2.9M+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'header', ats: true, category: 'professional' },
  { id: 'header-ats', name: 'Header ATS', desc: 'Vibrant header band with left-border sections. ATS-optimized with visual flair recruiters remember.', tag: 'ATS', users: '2.4M+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'header', ats: true, category: 'ats' },
  { id: 'minimal', name: 'Minimal', desc: 'Breathable whitespace with understated elegance. For those who let their achievements speak loudest.', tag: 'Editor Pick', users: '3.5M+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'single', ats: true, category: 'simple' },
  { id: 'vivid', name: 'Vivid', desc: 'Eye-catching colored sidebar with full-height accent. Stand out instantly in any application pile.', tag: 'Eye-catching', users: '2.6M+ users', colors: ['Monochrome'], pdf: true, docx: false, previewStyle: 'twoColumn', ats: false, category: 'modern' },
  { id: 'sidebar-right', name: 'Sidebar', desc: 'Dark right sidebar with initials badge and skill dots. Premium two-column layout with strong branding.', tag: null, users: '2.1M+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'twoColumn', ats: true, category: 'professional' },
  { id: 'centered-clean', name: 'Centered', desc: 'Perfectly symmetrical centered layout with accent underlines. Refined balance that exudes confidence.', tag: null, users: '1.8M+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'single', ats: true, category: 'simple' },
  { id: 'accent-bar', name: 'Accent Bar', desc: 'Full-width header bar with initials badge and two-column body. Corporate-grade professionalism.', tag: null, users: '1.9M+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'header', ats: true, category: 'professional' },
  { id: 'vertical-line', name: 'Vertical Line', desc: 'Editorial accent pillar with magazine-inspired typography. Distinctive and creative without sacrificing clarity.', tag: 'Creative', users: '1.5M+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'single', ats: true, category: 'modern' },
  { id: 'initials-header', name: 'Initials', desc: 'Memorable monogram badge header with accent borders. Personal branding that makes you unforgettable.', tag: null, users: '1.6M+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'single', ats: true, category: 'professional' },
  { id: 'divided', name: 'Divided', desc: 'Bold dividers and strong accent rules. Assertive layout that commands attention from the first glance.', tag: null, users: '1.7M+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'single', ats: true, category: 'simple' },
  { id: 'story', name: 'Story', desc: 'Numbered narrative sections with a storytelling flow. Approachable and modern, perfect for creative roles.', tag: 'Unique', users: '1.3M+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'single', ats: true, category: 'modern' },
  { id: 'deco', name: 'Deco', desc: 'Decorative serif header with diamond accent and ornate section bars. Artistic elegance for distinctive careers.', tag: null, users: '1.1M+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'single', ats: true, category: 'professional' },
  { id: 'proficiency', name: 'Proficiency', desc: 'Skill-focused sidebar with visual proficiency bars. Showcase technical expertise at a glance.', tag: 'Tech', users: '1.4M+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'twoColumn', ats: true, category: 'professional' },
  { id: 'header-profile', name: 'Profile', desc: 'Full-width profile banner with summary built into the header. Maximum impact above the fold.', tag: null, users: '1.2M+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'header', ats: true, category: 'professional' },
  { id: 'elegant', name: 'Elegant', desc: 'Serif-inspired centered layout with accent underlines. Refined symmetry for executive and academic roles.', tag: 'Premium', users: '1.5M+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'single', ats: true, category: 'simple' },
  { id: 'pillar', name: 'Pillar', desc: 'Bold editorial pillar accent with left-border name treatment. Modern magazine aesthetic for creative leaders.', tag: null, users: '1.0M+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'single', ats: true, category: 'modern' },
  { id: 'spotlight', name: 'Spotlight', desc: 'Name highlighted in a soft accent box with dot indicators. Memorable personal branding that pops.', tag: 'Stand Out', users: '1.2M+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'single', ats: true, category: 'modern' },
  { id: 'card', name: 'Card', desc: 'Content organized in clean bordered cards. Scannable structure that guides the reader naturally.', tag: null, users: '1.1M+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'single', ats: true, category: 'professional' },
  { id: 'serif', name: 'Serif', desc: 'Classic serif headings paired with modern sans-serif body. Timeless elegance meets contemporary readability.', tag: null, users: '900K+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'single', ats: true, category: 'simple' },
  { id: 'bold-block', name: 'Bold Block', desc: 'High-impact dark header with accent label blocks. Powerful visual presence for ambitious professionals.', tag: 'Impactful', users: '1.0M+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'header', ats: true, category: 'professional' },
  { id: 'timeline', name: 'Timeline', desc: 'Visual timeline dots and lines tracing your career path. Engaging chronological storytelling with style.', tag: 'Popular', users: '1.3M+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'single', ats: true, category: 'modern' },
  { id: 'luxe', name: 'Luxe', desc: 'Premium serif typography with diamond accents and generous spacing. The luxury feel that elevates any resume.', tag: 'Luxury', users: '850K+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'single', ats: true, category: 'simple' },
  { id: 'gradient', name: 'Gradient', desc: 'Futuristic diagonal gradient header with bold typography. A striking first impression for forward-thinking professionals.', tag: 'Futuristic', users: '780K+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'header', ats: true, category: 'modern' },
  { id: 'neon', name: 'Neon', desc: 'Dark header with glowing accent borders. Tech-inspired design that signals innovation and technical expertise.', tag: 'Tech', users: '720K+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'header', ats: true, category: 'modern' },
  { id: 'geometric', name: 'Geometric', desc: 'Grid-based two-column layout with accent squares and clean lines. Structured precision for detail-oriented roles.', tag: 'New', users: '650K+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'twoColumn', ats: true, category: 'modern' },
  { id: 'aura', name: 'Aura', desc: 'Soft centered aesthetic with rounded elements and gentle accent touches. An elegant, airy feel that radiates confidence.', tag: 'Aesthetic', users: '690K+ users', colors: ['Monochrome'], pdf: true, docx: true, previewStyle: 'single', ats: true, category: 'simple' },
]

export const atsTemplates = allTemplates.filter((t) => t.ats)

export const categoryFilters = [
  { label: 'All templates', to: '/templates', active: false },
  { label: 'Simple', to: '/templates', active: false },
  { label: 'Professional', to: '/templates', active: false },
  { label: 'Modern', to: '/templates', active: false },
  { label: 'ATS', to: '/templates/ats', active: true },
]
