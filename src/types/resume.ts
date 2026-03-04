export interface Contact {
  fullName: string
  /** Used in wizard; synced into fullName when either is set */
  firstName?: string
  lastName?: string
  email: string
  phone: string
  location: string
  address?: string
  city?: string
  state?: string
  country?: string
  website: string
  linkedin: string
  /** Profile photo as data URL (e.g. from file input) */
  photo?: string
}

export interface ExperienceItem {
  id: string
  jobTitle: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

export interface EducationItem {
  id: string
  degree: string
  school: string
  location: string
  startDate: string
  endDate: string
  description: string
}

export interface ReferenceItem {
  name: string
  affiliation?: string
  email?: string
  phone?: string
}

export interface ResumeData {
  /** Role/job title the candidate is targeting */
  jobTarget?: string
  contact: Contact
  summary: string
  experience: ExperienceItem[]
  education: EducationItem[]
  skills: string[]
  /** Optional references (e.g. for customer service / traditional resumes) */
  references?: ReferenceItem[]
}

export type TemplateId =
  | 'professional'
  | 'modern'
  | 'minimal'
  | 'classic'
  | 'corporate'
  | 'clean'
  | 'sidebar-right'
  | 'centered-clean'
  | 'accent-bar'
  | 'vertical-line'
  | 'initials-header'
  | 'divided'
  | 'story'
  | 'deco'
  | 'proficiency'
  | 'header-profile'
  | 'elegant'
  | 'pillar'
  | 'spotlight'
  | 'card'
  | 'serif'
  | 'bold-block'
  | 'timeline'
  | 'luxe'
