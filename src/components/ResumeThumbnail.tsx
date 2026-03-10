import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { templateMap, DEFAULT_ACCENTS } from './ResumePreview'
import type { ResumeData } from '../types/resume'

const A4_W = 595
const A4_H = 842
/** Scale so the full A4 fits in a small box; thumbnail shows top portion */
const THUMB_SCALE = 0.22

interface ResumeThumbnailProps {
  resumeId: number
  className?: string
}

export function ResumeThumbnail({ resumeId, className = '' }: ResumeThumbnailProps) {
  const [resume, setResume] = useState<{ data: ResumeData; template_id: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    api<{ data: ResumeData; template_id: string }>(`/resumes/${resumeId}`)
      .then((res) => {
        if (!cancelled) setResume(res)
      })
      .catch(() => {
        if (!cancelled) setResume(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [resumeId])

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center bg-[#e5e7eb] rounded-xl text-cvmora-muted text-[0.8125rem] ${className}`}
        style={{ width: 132, height: 176 }}
      >
        …
      </div>
    )
  }

  if (!resume) {
    return (
      <div
        className={`flex items-center justify-center bg-[#e5e7eb] rounded-xl text-cvmora-muted text-[0.8125rem] ${className}`}
        style={{ width: 132, height: 176 }}
      >
        —
      </div>
    )
  }

  const templateId = resume.template_id || 'professional'
  const TemplateComponent = (templateMap as Record<string, React.ComponentType<{ data: ResumeData; accentColor?: string }>>)[templateId] ?? (templateMap as Record<string, React.ComponentType<{ data: ResumeData; accentColor?: string }>>).professional
  const accentColor = DEFAULT_ACCENTS[templateId] ?? DEFAULT_ACCENTS.professional

  return (
    <div
      className={`overflow-hidden rounded-xl border border-[var(--color-border)] bg-white flex-shrink-0 ${className}`}
      style={{ width: 132, height: 176 }}
    >
      <div
        className="resume-print-inner"
        style={{
          transform: `scale(${THUMB_SCALE})`,
          transformOrigin: 'top left',
          width: A4_W,
          height: A4_H,
          minHeight: A4_H,
        }}
      >
        <div className="resume-template-fill" style={{ height: '100%', minHeight: '100%' }}>
          <TemplateComponent data={resume.data} accentColor={accentColor} />
        </div>
      </div>
    </div>
  )
}
