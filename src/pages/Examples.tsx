import { Link } from 'react-router-dom'
import { resumeExamples } from '../data/examples'

const categories = ['All', 'Healthcare', 'Technology', 'Finance', 'Education', 'Entry Level']

export function Examples() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-14 sm:py-20">
      <p className="text-base font-medium text-[var(--color-primary)] uppercase tracking-[0.18em] mb-3">
        By industry
      </p>
      <h1 className="text-3xl sm:text-4xl font-bold text-cvmora-ink mb-4 tracking-tight">
        Get the interview with professional resume examples
      </h1>
      <p className="text-lg text-cvmora-muted leading-relaxed mb-10 max-w-xl" style={{ lineHeight: 1.6 }}>
        Get inspired by examples for your industry. Use the builder to create your own.
      </p>
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`px-4 py-2.5 rounded-xl text-base font-medium transition-all duration-150 ${
              cat === 'All'
                ? 'bg-[var(--color-primary)] text-white shadow-[var(--shadow-sm)]'
                : 'bg-white border border-cvmora-ink/10 text-cvmora-muted-soft hover:border-[var(--color-primary)]/30 hover:text-[var(--color-primary)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {resumeExamples.map((ex) => (
          <Link
            key={ex.id}
            to="/builder"
            state={{ exampleId: ex.id }}
            className="surface-card group block p-6 rounded-2xl hover:border-[var(--color-primary)]/20 transition-all duration-200"
          >
            <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider">
              {ex.category}
            </span>
            <h2 className="font-semibold text-cvmora-ink text-lg mt-2 mb-4 group-hover:text-[var(--color-primary)] transition-colors duration-200">
              {ex.name}
            </h2>
            <span className="inline-flex items-center gap-1.5 text-base font-semibold text-[var(--color-primary)] group-hover:gap-2.5 transition-all duration-200">
              Try this example
              <span aria-hidden>→</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
