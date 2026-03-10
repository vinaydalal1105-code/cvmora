import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/client'
import { ResumeThumbnail } from '../components/ResumeThumbnail'
import { createResumeDocx } from '../utils/exportDocx'
import type { ResumeData } from '../types/resume'

interface ResumeMeta {
  id: number
  title: string
  template_id: string
  created_at: string
  updated_at: string
}

interface CoverLetterMeta {
  id: number
  title: string
  job_title: string
  company: string
  template_id: string
  created_at: string
  updated_at: string
}

function ResumeCard({ resume, onDelete }: { resume: ResumeMeta; onDelete?: (id: number) => void }) {
  const [downloadingWord, setDownloadingWord] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!onDelete || deleting) return
    if (!window.confirm('Delete this resume? This cannot be undone.')) return
    setDeleting(true)
    try {
      await api(`/resumes/${resume.id}`, { method: 'DELETE' })
      onDelete(resume.id)
    } catch (err) {
      console.error('Delete failed:', err)
    } finally {
      setDeleting(false)
    }
  }

  const handleDownloadWord = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDownloadingWord(true)
    try {
      const row = await api<{ data: ResumeData; template_id: string }>(`/resumes/${resume.id}`)
      const blob = await createResumeDocx(row.data)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const name = (row.data?.contact?.fullName || row.data?.contact?.email || resume.title || 'resume').replace(/\s+/g, '-')
      a.download = `resume-${name}.docx`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download failed:', err)
    } finally {
      setDownloadingWord(false)
    }
  }

  return (
    <div className="surface-card flex flex-col sm:flex-row gap-4 sm:gap-5 p-5 rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-primary)]/20 transition-all duration-200">
      <ResumeThumbnail resumeId={resume.id} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Link
          to={`/builder/${resume.id}`}
          className="font-semibold text-cvmora-ink hover:text-[var(--color-primary)] transition-colors duration-150 inline-block"
        >
          {resume.title}
        </Link>
        <span className="text-[0.8125rem] text-cvmora-muted">({resume.template_id})</span>
        <p className="text-[0.8125rem] text-cvmora-muted mt-1.5">
          Updated {new Date(resume.updated_at).toLocaleDateString()}
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <Link
            to={`/builder/${resume.id}?download=pdf`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center px-3 py-1.5 rounded-lg text-[0.8125rem] font-medium bg-[#BFED8D] text-[#1c1917] border border-[#a8e070] hover:bg-[#b0e87d] transition-colors"
          >
            Download PDF
          </Link>
          <button
            type="button"
            onClick={handleDownloadWord}
            disabled={downloadingWord}
            className="inline-flex items-center px-3 py-1.5 rounded-lg text-[0.8125rem] font-medium border border-[var(--color-border)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 disabled:opacity-50 transition-colors"
          >
            {downloadingWord ? '…' : 'Download Word'}
          </button>
          <Link
            to={`/builder/${resume.id}`}
            className="inline-flex items-center px-3 py-1.5 rounded-lg text-[0.8125rem] font-medium text-[var(--color-primary)] hover:underline"
          >
            Edit
          </Link>
          {onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-[0.8125rem] font-medium text-red-600 hover:bg-red-50 hover:underline disabled:opacity-50"
            >
              {deleting ? '…' : 'Delete'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function Dashboard() {
  const { user, isAuthenticated, updateProfile } = useAuth()
  const [editingName, setEditingName] = useState(false)

  const handleEditName = async () => {
    const newName = window.prompt('Display name', user?.name ?? '')
    if (newName === null) return
    const trimmed = newName.trim()
    if (!trimmed) return
    setEditingName(true)
    try {
      await updateProfile({ name: trimmed })
    } finally {
      setEditingName(false)
    }
  }
  const [resumes, setResumes] = useState<ResumeMeta[]>([])
  const [coverLetters, setCoverLetters] = useState<CoverLetterMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingAll, setDeletingAll] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) return
    setError('')
    Promise.all([
      api<ResumeMeta[]>('/resumes').catch((err) => {
        console.error('Failed to load resumes:', err)
        setError('Couldn’t load your resumes. Try signing in again or refresh the page.')
        return [] as ResumeMeta[]
      }),
      api<CoverLetterMeta[]>('/cover-letters').catch(() => [] as CoverLetterMeta[]),
    ])
      .then(([r, c]) => {
        const list = Array.isArray(r) ? r : []
        const seen = new Set<number>()
        setResumes(list.filter((item) => (seen.has(item.id) ? false : (seen.add(item.id), true))))
        setCoverLetters(Array.isArray(c) ? c : [])
      })
      .catch(() => setError('Couldn’t load your resumes. Try signing in again or refresh the page.'))
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  const handleDeleteAllResumes = async () => {
    if (deletingAll || resumes.length === 0) return
    if (!window.confirm(`Permanently delete all ${resumes.length} resumes? This cannot be undone.`)) return
    setDeletingAll(true)
    setError('')
    try {
      await api<{ deleted: number }>('/resumes/delete-all', { method: 'POST' })
      setResumes([])
    } catch (err) {
      console.error('Delete all failed:', err)
      setError('Couldn’t delete all resumes. Try again.')
    } finally {
      setDeletingAll(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-14 text-center">
        <p className="text-[0.9375rem] text-cvmora-muted mb-5">Sign in to see your dashboard.</p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 font-semibold text-[var(--color-primary)] hover:opacity-80 transition-opacity"
        >
          Sign in
          <span aria-hidden>→</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="flex flex-wrap items-baseline gap-2 mb-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-cvmora-ink tracking-tight">
          Welcome{user?.name ? `, ${user.name}` : ''}
        </h1>
        <button
          type="button"
          onClick={handleEditName}
          disabled={editingName}
          className="text-[0.8125rem] font-medium text-[var(--color-primary)] hover:underline disabled:opacity-50"
        >
          {editingName ? '…' : 'Edit name'}
        </button>
      </div>
      <p className="text-[0.9375rem] text-cvmora-muted mb-10">{user?.email}</p>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 text-[0.9375rem] font-medium border border-red-100 mb-8">
          {error}
        </div>
      )}

      <section className="mb-12">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 mb-5">
          <h2 className="text-lg font-semibold text-cvmora-ink tracking-tight">My Resumes</h2>
          <div className="flex flex-wrap items-center gap-3">
            {resumes.length > 0 && (
              <button
                type="button"
                onClick={handleDeleteAllResumes}
                disabled={deletingAll}
                className="text-[0.8125rem] font-medium text-red-600 hover:text-red-700 hover:underline disabled:opacity-50"
              >
                {deletingAll ? 'Deleting…' : 'Delete all resumes'}
              </button>
            )}
            <Link
              to="/builder"
              className="text-[0.9375rem] font-semibold text-[var(--color-primary)] hover:opacity-80 transition-opacity whitespace-nowrap"
            >
              + New resume
            </Link>
          </div>
        </div>
        {loading ? (
          <p className="text-[0.9375rem] text-cvmora-muted">Loading…</p>
        ) : resumes.length === 0 ? (
          <div className="surface-card p-8 rounded-2xl text-center">
            <p className="text-[0.9375rem] text-cvmora-muted mb-5">You don't have any resumes yet.</p>
            <Link
              to="/builder"
              className="btn-primary inline-flex px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] shadow-[var(--shadow-button)] hover:shadow-[var(--shadow-button-hover)] transition-all"
            >
              Create your first resume
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {resumes.map((r) => (
              <li key={r.id}>
                <ResumeCard
                  resume={r}
                  onDelete={(id) => setResumes((prev) => prev.filter((x) => x.id !== id))}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 mb-5">
          <h2 className="text-lg font-semibold text-cvmora-ink tracking-tight">My Cover Letters</h2>
          <Link
            to="/cover-letter"
            className="text-[0.9375rem] font-semibold text-[var(--color-primary)] hover:opacity-80 transition-opacity whitespace-nowrap"
          >
            + New cover letter
          </Link>
        </div>
        {loading ? null : coverLetters.length === 0 ? (
          <div className="surface-card p-8 rounded-2xl text-center">
            <p className="text-[0.9375rem] text-cvmora-muted mb-5">No cover letters yet.</p>
            <Link
              to="/cover-letter"
              className="btn-primary inline-flex px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] shadow-[var(--shadow-button)] hover:shadow-[var(--shadow-button-hover)] transition-all"
            >
              Write a cover letter
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {coverLetters.map((c) => (
              <li key={c.id}>
                <Link
                  to={`/cover-letter/${c.id}`}
                  className="surface-card group block p-5 rounded-2xl hover:border-[var(--color-primary)]/20 transition-all duration-200"
                >
                  <span className="font-semibold text-cvmora-ink group-hover:text-[var(--color-primary)] transition-colors duration-150">
                    {c.title}
                  </span>
                  {(c.job_title || c.company) && (
                    <span className="text-[0.8125rem] text-cvmora-muted ml-2">
                      — {[c.job_title, c.company].filter(Boolean).join(' at ')}
                    </span>
                  )}
                  <p className="text-[0.8125rem] text-cvmora-muted mt-1.5">
                    Updated {new Date(c.updated_at).toLocaleDateString()}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
