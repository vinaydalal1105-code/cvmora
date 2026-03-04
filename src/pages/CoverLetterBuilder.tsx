import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/client'
import { CoverLetterPreview, type CoverLetterPreviewHandle } from '../components/CoverLetterPreview'
import { createCoverLetterDocx } from '../utils/exportCoverLetterDocx'
import type { CoverLetterData, CoverLetterTemplateId } from '../types/coverLetter'

const defaultData: CoverLetterData = {
  title: 'Cover Letter',
  full_name: '',
  address: '',
  phone: '',
  email: '',
  job_title: '',
  company: '',
  hiring_manager: '',
  body: '',
  template_id: 'professional',
}

export function CoverLetterBuilder() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const initialTemplateId = (location.state as { templateId?: CoverLetterTemplateId } | null)?.templateId
  const [data, setData] = useState<CoverLetterData>(() => ({
    ...defaultData,
    template_id: initialTemplateId && ['professional', 'modern', 'minimal'].includes(initialTemplateId) ? initialTemplateId : defaultData.template_id,
  }))
  const [loading, setLoading] = useState(!!id && isAuthenticated)
  const [saving, setSaving] = useState(false)
  const [downloadingDocx, setDownloadingDocx] = useState(false)
  const [hasFinished, setHasFinished] = useState(false)
  const previewRef = useRef<CoverLetterPreviewHandle>(null)

  useEffect(() => {
    if (!id || !isAuthenticated) {
      if (id && !isAuthenticated) navigate('/login')
      setLoading(false)
      return
    }
    api<CoverLetterData & { template_id: string }>(`/cover-letters/${id}`)
      .then((res) => {
        const r = res as unknown as Record<string, unknown>
        setData({
          ...defaultData,
          title: (r.title as string) ?? defaultData.title,
          job_title: (r.job_title as string) ?? '',
          company: (r.company as string) ?? '',
          body: (r.body as string) ?? '',
          template_id: ((r.template_id as CoverLetterTemplateId) || 'professional') as CoverLetterTemplateId,
          full_name: (r.full_name as string) ?? '',
          address: (r.address as string) ?? '',
          phone: (r.phone as string) ?? '',
          email: (r.email as string) ?? '',
          hiring_manager: (r.hiring_manager as string) ?? '',
        })
      })
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false))
  }, [id, isAuthenticated, navigate])

  const handleSave = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setSaving(true)
    try {
      if (id) {
        await api(`/cover-letters/${id}`, { method: 'PUT', body: data })
      } else {
        const created = await api<{ id: number }>('/cover-letters', {
          method: 'POST',
          body: data,
        })
        navigate(`/cover-letter/${created.id}`, { replace: true })
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDownloadWord = async () => {
    setDownloadingDocx(true)
    try {
      const blob = await createCoverLetterDocx(data)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `cover-letter-${data.job_title || data.title}.docx`.replace(/\s+/g, '-')
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setDownloadingDocx(false)
    }
  }

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-cvmora-ink/60">
        Loading…
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="flex-1 flex min-h-0">
        {/* Left sidebar: form sections */}
        <aside className="w-[340px] sm:w-[380px] shrink-0 border-r border-[#e7e5e4] bg-white overflow-y-auto">
          <div className="p-4 sm:p-5 space-y-5">
          {/* Template */}
          <div className="rounded-xl border border-[#e7e5e4] p-4 bg-[#fafafa]/80">
            <h2 className="text-sm font-semibold text-[#1c1917] uppercase tracking-wider mb-3">Template</h2>
            <div className="flex flex-wrap gap-2">
              {(['professional', 'modern', 'minimal'] as CoverLetterTemplateId[]).map((tid) => (
                <button
                  key={tid}
                  type="button"
                  onClick={() => setData((d) => ({ ...d, template_id: tid }))}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    data.template_id === tid
                      ? 'bg-[#f97316] text-white'
                      : 'bg-white border border-[#e7e5e4] text-[#44403c] hover:border-[#f97316]/50'
                  }`}
                >
                  {tid === 'professional' ? 'Professional' : tid === 'modern' ? 'Modern' : 'Minimal'}
                </button>
              ))}
            </div>
          </div>
          {/* Personal Details */}
          <div className="rounded-xl border border-[#e7e5e4] p-4 bg-[#fafafa]/80">
            <h2 className="text-sm font-semibold text-[#1c1917] uppercase tracking-wider mb-3">Personal Details</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-base font-medium text-[#44403c] mb-1">Full Name</label>
                <input
                  type="text"
                  value={data.full_name}
                  onChange={(e) => setData((d) => ({ ...d, full_name: e.target.value }))}
                  placeholder="Your full name"
                  className="input-premium w-full"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-[#44403c] mb-1">Job Title</label>
                <input
                  type="text"
                  value={data.job_title}
                  onChange={(e) => setData((d) => ({ ...d, job_title: e.target.value }))}
                  placeholder="e.g. Software Engineer"
                  className="input-premium w-full"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-[#44403c] mb-1">Address</label>
                <input
                  type="text"
                  value={data.address}
                  onChange={(e) => setData((d) => ({ ...d, address: e.target.value }))}
                  placeholder="City, State, ZIP"
                  className="input-premium w-full"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-[#44403c] mb-1">Phone Number</label>
                <input
                  type="text"
                  value={data.phone}
                  onChange={(e) => setData((d) => ({ ...d, phone: e.target.value }))}
                  placeholder="+1 234 567 8900"
                  className="input-premium w-full"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-[#44403c] mb-1">Email</label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))}
                  placeholder="you@email.com"
                  className="input-premium w-full"
                />
              </div>
            </div>
          </div>

          {/* Employer Details */}
          <div className="rounded-xl border border-[#e7e5e4] p-4 bg-[#fafafa]/80">
            <h2 className="text-sm font-semibold text-[#1c1917] uppercase tracking-wider mb-3">Employer Details</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-base font-medium text-[#44403c] mb-1">Company Name</label>
                <input
                  type="text"
                  value={data.company}
                  onChange={(e) => setData((d) => ({ ...d, company: e.target.value }))}
                  placeholder="Company Name"
                  className="input-premium w-full"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-[#44403c] mb-1">Hiring Manager Name</label>
                <input
                  type="text"
                  value={data.hiring_manager}
                  onChange={(e) => setData((d) => ({ ...d, hiring_manager: e.target.value }))}
                  placeholder="Optional"
                  className="input-premium w-full"
                />
              </div>
            </div>
          </div>

          {/* Letter Details */}
          <div className="rounded-xl border border-[#e7e5e4] p-4 bg-[#fafafa]/80">
            <h2 className="text-sm font-semibold text-[#1c1917] uppercase tracking-wider mb-2">Letter Details</h2>
            <p className="text-sm text-[#78716c] mb-3">3–4 paragraphs for the role.</p>
            <textarea
              value={data.body}
              onChange={(e) => setData((d) => ({ ...d, body: e.target.value }))}
              placeholder={'Dear Hiring Manager,\n\n...'}
              rows={8}
              className="input-premium w-full resize-y min-h-[160px]"
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {isAuthenticated && (
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-[#f97316] text-white text-base font-semibold hover:bg-[#ea580c] disabled:opacity-50 transition-colors"
                >
                  {saving ? 'Saving…' : 'Save'}
                </button>
              )}
              <button
                type="button"
                onClick={() => setHasFinished(true)}
                className="px-5 py-2.5 rounded-full bg-[#BFED8D] text-[#1c1917] text-base font-medium border border-[#a8e070] hover:bg-[#b0e87d] transition-colors"
              >
                Finish
              </button>
            </div>
          </div>
          </div>
        </aside>

        {/* Right: Preview fills remaining space */}
        <div className="flex-1 min-w-0 flex flex-col bg-[#e5e7eb] relative">
          {hasFinished && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 flex flex-col items-center gap-6">
                <h2 className="text-xl font-bold text-[#1c1917] text-center">Your cover letter is ready</h2>
                <p className="text-[#78716c] text-center text-sm">Choose a format to download.</p>
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <button
                    type="button"
                    onClick={() => previewRef.current?.print()}
                    className="flex-1 px-5 py-3 rounded-full bg-[#f97316] text-white text-base font-semibold hover:bg-[#ea580c] transition-colors"
                  >
                    Download PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadWord()}
                    disabled={downloadingDocx}
                    className="flex-1 px-5 py-3 rounded-full border-2 border-[#f97316] text-[#f97316] text-base font-semibold hover:bg-[#fff7ed] disabled:opacity-50 transition-colors"
                  >
                    {downloadingDocx ? '…' : 'Download Word'}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setHasFinished(false)}
                  className="text-sm text-[#78716c] hover:text-[#1c1917] underline"
                >
                  Back to editing
                </button>
              </div>
            </div>
          )}
          <CoverLetterPreview ref={previewRef} data={data} showDownloadButtons={false} />
        </div>
      </div>
    </div>
  )
}
