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
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="mb-8">
        <p className="text-sm font-semibold text-[#f97316] uppercase tracking-wider mb-2">Remote Jobs</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1c1917] mb-3 tracking-tight">
          Job Board
        </h1>
        <p className="text-base text-[#78716c] leading-relaxed max-w-lg">
          Browse remote jobs. Search by keyword or filter by category.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#a8a29e] pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="search"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[#e7e5e4] pl-10 pr-4 py-2.5 text-[0.9375rem] text-[#1c1917] placeholder:text-[#a8a29e] focus:outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]/20 transition-colors bg-white"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-[#e7e5e4] px-4 py-2.5 text-[0.9375rem] text-[#1c1917] focus:outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]/20 transition-colors bg-white min-w-[200px] appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20d%3D%22M3%204.5l3%203%203-3%22%20fill%3D%22none%22%20stroke%3D%22%2378716c%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-9"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      {!loading && jobs.length > 0 && (
        <p className="text-sm text-[#a8a29e] mb-4">{jobs.length} job{jobs.length !== 1 ? 's' : ''} found</p>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-[#e7e5e4] border-t-[#f97316] rounded-full animate-spin mb-4" />
          <p className="text-sm text-[#78716c]">Loading jobs...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-12 h-12 rounded-full bg-[#f5f5f4] flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-[#a8a29e]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </div>
          <p className="text-[0.9375rem] font-medium text-[#1c1917] mb-1">No jobs found</p>
          <p className="text-sm text-[#a8a29e]">Try a different search or category.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <a
              key={job.id}
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-xl border border-[#e7e5e4] bg-white p-5 hover:border-[#d6d3d1] hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-[#1c1917] text-base group-hover:text-[#f97316] transition-colors duration-150 mb-1.5">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#78716c]">
                    <span className="font-medium text-[#44403c]">{job.company_name}</span>
                    {job.category && (
                      <>
                        <span className="text-[#d6d3d1]">·</span>
                        <span>{job.category}</span>
                      </>
                    )}
                    {job.candidate_required_location && (
                      <>
                        <span className="text-[#d6d3d1]">·</span>
                        <span>{job.candidate_required_location}</span>
                      </>
                    )}
                  </div>
                  {job.description && (
                    <p className="text-sm text-[#a8a29e] mt-2.5 line-clamp-2 leading-relaxed">
                      {job.description.replace(/<[^>]+>/g, '').slice(0, 180)}...
                    </p>
                  )}
                </div>
                <div className="shrink-0 mt-1">
                  {job.job_type && (
                    <span className="px-2.5 py-1 rounded-full bg-[#f5f5f4] text-[#78716c] text-xs font-medium">
                      {job.job_type}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#f5f5f4]">
                <span className="text-sm font-semibold text-[#f97316] group-hover:gap-2 transition-all inline-flex items-center gap-1">
                  View job
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                </span>
                {job.candidate_required_location && (
                  <span className="ml-auto text-xs text-[#a8a29e] flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                    {job.candidate_required_location}
                  </span>
                )}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
