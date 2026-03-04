import { Link } from 'react-router-dom'

const guides = [
  {
    slug: 'resume',
    title: 'How to write a resume: Expert guide & examples',
    desc: 'What to include, what to leave out, and how to structure each section for maximum impact.',
    tag: 'Field tested',
    tagClass: 'bg-violet-100 text-violet-800 border-violet-200/50',
  },
  {
    slug: 'cover-letter',
    title: 'How to write a cover letter: Expert guide & examples',
    desc: 'Structure and tone. How to match the job description and stand out to recruiters.',
    tag: 'HR approved',
    tagClass: 'bg-amber-100 text-amber-800 border-amber-200/50',
  },
  {
    slug: 'ats',
    title: 'ATS-friendly resume tips: Get past the bots',
    desc: 'Formatting and keywords that help your resume pass applicant tracking systems and reach recruiters.',
    tag: 'ATS',
    tagClass: 'bg-emerald-100 text-emerald-800 border-emerald-200/50',
  },
  {
    slug: 'summary',
    title: 'Resume summary examples that get interviews',
    desc: 'Strong opening lines for different experience levels and industries. What to say and what to avoid.',
    tag: 'Tips',
    tagClass: 'bg-sky-100 text-sky-800 border-sky-200/50',
  },
  {
    slug: 'experience',
    title: 'How to list experience and achievements',
    desc: 'Bullet points that show impact. Use numbers and action verbs so recruiters see your value.',
    tag: 'Tips',
    tagClass: 'bg-sky-100 text-sky-800 border-sky-200/50',
  },
  {
    slug: 'interview',
    title: 'Interview preparation and common questions',
    desc: 'Prepare for behavioral and situational questions. Practice answers and build confidence.',
    tag: 'Career',
    tagClass: 'bg-rose-100 text-rose-800 border-rose-200/50',
  },
]

export function Resources() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-14 sm:py-20">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-12">
        <div>
          <p className="text-sm font-medium text-[var(--color-primary)] uppercase tracking-[0.18em] mb-3">
            Guides & tips
          </p>
          <h1 className="text-3xl sm:text-[2.25rem] font-bold text-cvmora-ink tracking-tight">
            Need some expert advice?
          </h1>
          <p className="text-lg text-cvmora-muted mt-2 leading-relaxed" style={{ lineHeight: 1.6 }}>Guides and tips to get you hired.</p>
        </div>
        <Link
          to="/faq"
          className="text-base font-semibold text-[var(--color-primary)] hover:text-cvmora-ink transition-colors shrink-0 inline-flex items-center gap-1.5"
        >
          Read the FAQ
          <span aria-hidden>→</span>
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {guides.map((item) => (
          <Link
            key={item.slug}
            to={`/resources/guide/${item.slug}`}
            className="surface-card group block p-6 sm:p-8 rounded-2xl hover:border-[var(--color-primary)]/20 transition-all duration-200"
          >
            <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider mb-5 border ${item.tagClass}`}>
              {item.tag}
            </span>
            <h2 className="font-semibold text-cvmora-ink text-xl mb-2.5 group-hover:text-[var(--color-primary)] transition-colors duration-200">
              {item.title}
            </h2>
            <p className="text-base text-cvmora-ink/68 leading-relaxed mb-5" style={{ lineHeight: 1.55 }}>{item.desc}</p>
            <span className="inline-flex items-center gap-1.5 text-base font-semibold text-[var(--color-primary)] group-hover:gap-2.5 transition-all duration-200">
              Read more
              <span aria-hidden>→</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
