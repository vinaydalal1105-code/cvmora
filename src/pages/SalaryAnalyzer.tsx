import { useState } from 'react'

const salaryTools = [
  {
    name: 'Levels.fyi',
    desc: 'Verified compensation data for tech roles. Compare offers by company, level, and location.',
    url: 'https://www.levels.fyi/t/software-engineer',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    name: 'Glassdoor',
    desc: 'Salary estimates and reviews across all industries. Filter by company, title, and city.',
    url: 'https://www.glassdoor.com/Salaries/index.htm',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    name: 'Payscale',
    desc: 'Personalized salary report based on your title, experience, skills, and education.',
    url: 'https://www.payscale.com/research/US/Job',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    name: 'LinkedIn Salary',
    desc: 'Salary insights powered by LinkedIn member data. See ranges by role and region.',
    url: 'https://www.linkedin.com/salary/',
    color: 'text-sky-600',
    bg: 'bg-sky-50',
  },
  {
    name: 'Indeed Salaries',
    desc: 'Average salaries from millions of job postings. Search any title or company.',
    url: 'https://www.indeed.com/career/salaries',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
  },
  {
    name: 'Salary.com',
    desc: 'Detailed compensation reports. Popular for benchmarking offers in traditional industries.',
    url: 'https://www.salary.com/research/salary',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
]

const tips = [
  {
    title: 'Research before you negotiate',
    desc: 'Use at least two salary tools above to find the market range for your role, location, and experience level.',
  },
  {
    title: 'Consider total compensation',
    desc: 'Base salary is only part of it. Factor in equity, bonuses, benefits, PTO, and remote flexibility.',
  },
  {
    title: 'Know your number',
    desc: 'Have a specific range in mind before the conversation. Your target should be the top 25% of market rate.',
  },
  {
    title: 'Practice your pitch',
    desc: 'Use the Interview Prep tool to rehearse. Frame your ask around the value you bring, not personal needs.',
  },
]

export function SalaryAnalyzer() {
  const [role, setRole] = useState('')
  const [location, setLocation] = useState('')

  const searchQuery = [role, location, 'salary'].filter(Boolean).join(' ')
  const hasInput = role.trim().length > 0

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="mb-10">
        <p className="text-sm font-semibold text-[#f97316] uppercase tracking-wider mb-2">Negotiation</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1c1917] mb-3 tracking-tight">
          Salary Analyzer
        </h1>
        <p className="text-base text-[#78716c] leading-relaxed max-w-lg">
          Research market rates before your next negotiation. Enter your role and location, then explore real salary data from trusted sources.
        </p>
      </div>

      <div className="rounded-xl border border-[#e7e5e4] bg-white p-5 sm:p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-[#44403c] mb-1.5">Job title</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Software Engineer"
              className="w-full rounded-lg border border-[#e7e5e4] px-4 py-2.5 text-[0.9375rem] text-[#1c1917] placeholder:text-[#a8a29e] focus:outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]/20 transition-colors"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-[#44403c] mb-1.5">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Remote, New York, UK"
              className="w-full rounded-lg border border-[#e7e5e4] px-4 py-2.5 text-[0.9375rem] text-[#1c1917] placeholder:text-[#a8a29e] focus:outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]/20 transition-colors"
            />
          </div>
        </div>
        {hasInput && (
          <div className="mt-4 pt-4 border-t border-[#f5f5f4]">
            <p className="text-sm text-[#78716c] mb-2">Quick search on Google:</p>
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1c1917] text-white text-sm font-medium hover:bg-[#292524] transition-colors"
            >
              Search &ldquo;{role}{location ? ` ${location}` : ''} salary&rdquo;
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
            </a>
          </div>
        )}
      </div>

      <h2 className="text-lg font-semibold text-[#1c1917] mb-4 tracking-tight">Explore salary data</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-12">
        {salaryTools.map((tool) => {
          const href = hasInput
            ? `https://www.google.com/search?q=${encodeURIComponent(`${role} ${location} salary site:${new URL(tool.url).hostname}`)}`
            : tool.url
          return (
            <a
              key={tool.name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-[#e7e5e4] bg-white p-5 hover:border-[#d6d3d1] hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-2.5">
                <div className={`w-8 h-8 rounded-lg ${tool.bg} ${tool.color} flex items-center justify-center text-sm font-bold`}>
                  {tool.name[0]}
                </div>
                <h3 className="font-semibold text-[#1c1917] text-[0.9375rem] group-hover:text-[#f97316] transition-colors">
                  {tool.name}
                </h3>
                <svg className="w-3.5 h-3.5 text-[#a8a29e] ml-auto shrink-0 group-hover:text-[#f97316] transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
              </div>
              <p className="text-sm text-[#78716c] leading-relaxed">{tool.desc}</p>
            </a>
          )
        })}
      </div>

      <h2 className="text-lg font-semibold text-[#1c1917] mb-4 tracking-tight">Negotiation tips</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {tips.map((tip) => (
          <div
            key={tip.title}
            className="rounded-xl border border-[#e7e5e4] bg-white p-5"
          >
            <h3 className="font-semibold text-[#1c1917] text-[0.9375rem] mb-1.5">{tip.title}</h3>
            <p className="text-sm text-[#78716c] leading-relaxed">{tip.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
