import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/client'

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

export function Dashboard() {
  const { user, isAuthenticated } = useAuth()
  const [resumes, setResumes] = useState<ResumeMeta[]>([])
  const [coverLetters, setCoverLetters] = useState<CoverLetterMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) return
    Promise.all([
      api<ResumeMeta[]>('/resumes').catch(() => []),
      api<CoverLetterMeta[]>('/cover-letters').catch(() => []),
    ])
      .then(([r, c]) => {
        setResumes(Array.isArray(r) ? r : [])
        setCoverLetters(Array.isArray(c) ? c : [])
      })
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false))
  }, [isAuthenticated])

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
      <h1 className="text-2xl sm:text-3xl font-bold text-cvmora-ink mb-1 tracking-tight">
        Welcome{user?.name ? `, ${user.name}` : ''}
      </h1>
      <p className="text-[0.9375rem] text-cvmora-muted mb-10">{user?.email}</p>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 text-[0.9375rem] font-medium border border-red-100 mb-8">
          {error}
        </div>
      )}

      <section className="mb-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-cvmora-ink tracking-tight">My Resumes</h2>
          <Link
            to="/builder"
            className="text-[0.9375rem] font-semibold text-[var(--color-primary)] hover:opacity-80 transition-opacity"
          >
            + New resume
          </Link>
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
                <Link
                  to={`/builder/${r.id}`}
                  className="surface-card group block p-5 rounded-2xl hover:border-[var(--color-primary)]/20 transition-all duration-200"
                >
                  <span className="font-semibold text-cvmora-ink group-hover:text-[var(--color-primary)] transition-colors duration-150">
                    {r.title}
                  </span>
                  <span className="text-[0.8125rem] text-cvmora-muted ml-2">({r.template_id})</span>
                  <p className="text-[0.8125rem] text-cvmora-muted mt-1.5">
                    Updated {new Date(r.updated_at).toLocaleDateString()}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-cvmora-ink tracking-tight">My Cover Letters</h2>
          <Link
            to="/cover-letter"
            className="text-[0.9375rem] font-semibold text-[var(--color-primary)] hover:opacity-80 transition-opacity"
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
