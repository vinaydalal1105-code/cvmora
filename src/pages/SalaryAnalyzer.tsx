import { useState } from 'react'

export function SalaryAnalyzer() {
  const [role, setRole] = useState('')
  const [location, setLocation] = useState('')
  const [experience, setExperience] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-14 sm:py-20">
      <p className="text-base font-medium text-[#f97316] uppercase tracking-[0.18em] mb-3">
        Negotiation
      </p>
      <h1 className="text-3xl sm:text-4xl font-bold text-[#1c1917] mb-4 tracking-tight">
        Salary Analyzer
      </h1>
      <p className="text-lg text-[#78716c] leading-relaxed mb-10 max-w-xl" style={{ lineHeight: 1.6 }}>
        Check if your offer is at market rate. Use this as a starting point for negotiation—then use the links below for real data.
      </p>
      <div className="max-w-lg">
        <div className="surface-card p-6 sm:p-8 rounded-2xl space-y-5 border border-[#e7e5e4]">
          <div>
            <label className="block text-base font-semibold text-[#1c1917] mb-2">Job title</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Software Engineer"
              className="input-premium w-full"
            />
          </div>
          <div>
            <label className="block text-base font-semibold text-[#1c1917] mb-2">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Remote, New York, UK"
              className="input-premium w-full"
            />
          </div>
          <div>
            <label className="block text-base font-semibold text-[#1c1917] mb-2">Experience level</label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="input-premium w-full"
            >
              <option value="">Select</option>
              <option value="entry">Entry level (0–2 years)</option>
              <option value="mid">Mid-level (3–5 years)</option>
              <option value="senior">Senior (6+ years)</option>
            </select>
          </div>
          <button
            type="button"
            onClick={() => setSubmitted(true)}
            className="w-full py-3.5 rounded-xl bg-[#f97316] text-white font-semibold hover:bg-[#ea580c] transition-colors"
          >
            Get salary range
          </button>
        </div>
        {submitted && (
          <div className="mt-6 surface-card p-6 rounded-2xl border border-[#e7e5e4] border-l-4 border-l-[#f97316]">
            <p className="text-[0.9375rem] text-[#44403c] leading-relaxed">
              Salary data is not integrated in this demo. For real market data, use sites like{' '}
              <a
                href="https://levels.fyi"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#f97316] hover:opacity-80 transition-opacity underline underline-offset-2"
              >
                Levels.fyi
              </a>
              ,{' '}
              <a
                href="https://glassdoor.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#f97316] hover:opacity-80 transition-opacity underline underline-offset-2"
              >
                Glassdoor
              </a>
              , or your country’s job boards. Always research before negotiating.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
