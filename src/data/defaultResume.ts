import type { ResumeData } from '../types/resume'

export const defaultResume: ResumeData = {
  jobTarget: '',
  contact: {
    fullName: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    address: '',
    city: '',
    state: '',
    country: '',
    website: '',
    linkedin: '',
    photo: '',
  },
  summary: '',
  experience: [
    {
      id: crypto.randomUUID(),
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    },
  ],
  education: [
    {
      id: crypto.randomUUID(),
      degree: '',
      school: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
    },
  ],
  skills: [],
  descriptionFormat: 'bullets',
}
