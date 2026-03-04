import { useEffect, useState } from 'react'

interface Job {
  id: number
  title: string
  company_name: string
  url: string
  category: string
  job_type: string
  candidate_required_location: string
  description?: string
}

export function JobBoard() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [categories, setCategories] = useState<{ name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/jobs/categories')
      .then((r) => r.json())
      .then((d) => setCategories(Array.isArray(d) ? d : []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (search) params.set('search', search)
    fetch(`/api/jobs?${params}`)
      .then((r) => r.json())
      .then((d) => setJobs(Array.isArray(d.jobs) ? d.jobs : []))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false))
  }, [category, search])

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-14 sm:py-20">
      <p className="text-base font-medium text-[var(--color-primary)] uppercase tracking-[0.18em] mb-3">
        Remote jobs
      </p>
      <h1 className="text-3xl sm:text-4xl font-bold text-cvmora-ink mb-4 tracking-tight">
        Job Board
      </h1>
      <p className="text-lg text-cvmora-muted leading-relaxed mb-8" style={{ lineHeight: 1.6 }}>
        Browse remote jobs. Search by keyword or category.
      </p>
      <div className="flex flex-wrap gap-3 mb-8">
        <input
          type="search"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-premium w-64 sm:w-72"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input-premium w-auto min-w-[180px]"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <p className="text-base text-cvmora-muted">Loading jobs…</p>
      ) : jobs.length === 0 ? (
        <p className="text-base text-cvmora-muted">No jobs found. Try a different search.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job.id}>
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="surface-card group block p-5 sm:p-6 rounded-2xl hover:border-[var(--color-primary)]/20 transition-all duration-200"
              >
                <span className="font-semibold text-cvmora-ink text-lg group-hover:text-[var(--color-primary)] transition-colors duration-150">
                  {job.title}
                </span>
                <p className="text-base text-cvmora-muted mt-1.5">
                  {job.company_name}
                  {job.category && ` · ${job.category}`}
                  {job.candidate_required_location && ` · ${job.candidate_required_location}`}
                </p>
                {job.description && (
                  <p className="text-[0.9375rem] text-cvmora-ink/65 mt-3 line-clamp-2 leading-relaxed">
                    {job.description.replace(/<[^>]+>/g, '').slice(0, 200)}…
                  </p>
                )}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
