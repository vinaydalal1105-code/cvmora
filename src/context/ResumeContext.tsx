import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { ResumeData, TemplateId } from '../types/resume'
import { defaultResume } from '../data/defaultResume'

interface ResumeContextValue {
  data: ResumeData
  template: TemplateId
  setTemplate: (id: TemplateId) => void
  /** Accent color (hex) chosen on templates page – used by builder preview when set */
  accentColor: string | undefined
  setAccentColor: (color: string | undefined) => void
  loadData: (data: ResumeData) => void
  updateJobTarget: (jobTarget: string) => void
  updateContact: (contact: Partial<ResumeData['contact']>) => void
  updateSummary: (summary: string) => void
  addExperience: () => void
  updateExperience: (id: string, patch: Partial<ResumeData['experience'][0]>) => void
  removeExperience: (id: string) => void
  addEducation: () => void
  updateEducation: (id: string, patch: Partial<ResumeData['education'][0]>) => void
  removeEducation: (id: string) => void
  setSkills: (skills: string[]) => void
}

const ResumeContext = createContext<ResumeContextValue | null>(null)

interface ResumeProviderProps {
  children: ReactNode
  /** Initial template from URL (e.g. ?template=balanced) so first paint is correct */
  initialTemplate?: TemplateId
  /** Initial accent from URL (e.g. ?accent=%23aabcdf) so first paint is correct */
  initialAccentColor?: string
}

export function ResumeProvider({ children, initialTemplate, initialAccentColor }: ResumeProviderProps) {
  const [data, setData] = useState<ResumeData>(defaultResume)
  const [template, setTemplateState] = useState<TemplateId>(initialTemplate ?? 'professional')
  const [accentColor, setAccentColorState] = useState<string | undefined>(initialAccentColor ?? undefined)

  const setTemplate = useCallback((id: TemplateId) => setTemplateState(id), [])
  const setAccentColor = useCallback((color: string | undefined) => setAccentColorState(color), [])

  const loadData = useCallback((next: ResumeData) => {
    setData(next)
  }, [])

  const updateJobTarget = useCallback((jobTarget: string) => {
    setData((d) => ({ ...d, jobTarget }))
  }, [])

  const updateContact = useCallback((contact: Partial<ResumeData['contact']>) => {
    setData((d) => {
      const next = { ...d.contact, ...contact }
      const first = contact.firstName !== undefined ? contact.firstName : d.contact.firstName
      const last = contact.lastName !== undefined ? contact.lastName : d.contact.lastName
      if (first !== undefined || last !== undefined) {
        const combined = [first ?? '', last ?? ''].map((s) => s.trim()).filter(Boolean).join(' ')
        if (combined) next.fullName = combined
      }
      const city = contact.city !== undefined ? contact.city : d.contact.city
      const state = contact.state !== undefined ? contact.state : d.contact.state
      const country = contact.country !== undefined ? contact.country : d.contact.country
      if (city !== undefined || state !== undefined || country !== undefined) {
        next.location = [city ?? '', state ?? '', country ?? ''].map((s) => s.trim()).filter(Boolean).join(', ')
      }
      return { ...d, contact: next }
    })
  }, [])

  const updateSummary = useCallback((summary: string) => {
    setData((d) => ({ ...d, summary }))
  }, [])

  const addExperience = useCallback(() => {
    setData((d) => ({
      ...d,
      experience: [
        ...d.experience,
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
    }))
  }, [])

  const updateExperience = useCallback((id: string, patch: Partial<ResumeData['experience'][0]>) => {
    setData((d) => ({
      ...d,
      experience: d.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }))
  }, [])

  const removeExperience = useCallback((id: string) => {
    setData((d) => ({ ...d, experience: d.experience.filter((e) => e.id !== id) }))
  }, [])

  const addEducation = useCallback(() => {
    setData((d) => ({
      ...d,
      education: [
        ...d.education,
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
    }))
  }, [])

  const updateEducation = useCallback((id: string, patch: Partial<ResumeData['education'][0]>) => {
    setData((d) => ({
      ...d,
      education: d.education.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }))
  }, [])

  const removeEducation = useCallback((id: string) => {
    setData((d) => ({ ...d, education: d.education.filter((e) => e.id !== id) }))
  }, [])

  const setSkills = useCallback((skills: string[]) => {
    setData((d) => ({ ...d, skills }))
  }, [])

  const value: ResumeContextValue = {
    data,
    template,
    setTemplate,
    accentColor,
    setAccentColor,
    loadData,
    updateJobTarget,
    updateContact,
    updateSummary,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    setSkills,
  }

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
}

export function useResume() {
  const ctx = useContext(ResumeContext)
  if (!ctx) throw new Error('useResume must be used within ResumeProvider')
  return ctx
}
