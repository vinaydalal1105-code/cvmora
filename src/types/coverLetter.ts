export type CoverLetterTemplateId = 'professional' | 'modern' | 'minimal'

export interface CoverLetterData {
  title: string
  /** Applicant */
  full_name: string
  address: string
  phone: string
  email: string
  /** Role applying for */
  job_title: string
  /** Employer */
  company: string
  hiring_manager: string
  body: string
  template_id: CoverLetterTemplateId
}
