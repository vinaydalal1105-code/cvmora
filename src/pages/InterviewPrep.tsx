import { useState } from 'react'
import { interviewQuestions } from '../data/interviewQuestions'

export function InterviewPrep() {
  const [selected, setSelected] = useState<string | null>(null)
  const [answer, setAnswer] = useState('')

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-14 sm:py-20">
      <p className="text-base font-medium text-[var(--color-primary)] uppercase tracking-[0.18em] mb-3">
        Practice
      </p>
      <h1 className="text-3xl sm:text-4xl font-bold text-cvmora-ink mb-4 tracking-tight">
        Interview Prep
      </h1>
      <p className="text-lg text-cvmora-muted leading-relaxed mb-10 max-w-xl" style={{ lineHeight: 1.6 }}>
        Practice common interview questions. Write your answer below and review before the interview.
      </p>
      <div className="grid md:grid-cols-2 gap-8 sm:gap-10">
        <div>
          <h2 className="text-lg font-semibold text-cvmora-ink mb-5 tracking-tight">Questions by category</h2>
          <div className="space-y-7">
            {interviewQuestions.map((group) => (
              <div key={group.category}>
                <h3 className="text-sm font-semibold text-[var(--color-primary)] uppercase tracking-[0.15em] mb-3">
                  {group.category}
                </h3>
                <ul className="space-y-1">
                  {group.questions.map((q) => (
                    <li key={q}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelected(q)
                          setAnswer('')
                        }}
                        className={`text-left w-full px-4 py-3 rounded-xl text-[0.9375rem] font-medium transition-all duration-150 ${
                          selected === q
                            ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] border border-[var(--color-primary)]/20'
                            : 'hover:bg-cvmora-ink/5 text-cvmora-ink/78 border border-transparent'
                        }`}
                      >
                        {q}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="surface-card p-6 sm:p-7 rounded-2xl h-fit">
          <h2 className="text-lg font-semibold text-cvmora-ink mb-4 tracking-tight">Your answer</h2>
          {selected ? (
            <>
              <p className="text-[0.9375rem] text-cvmora-muted mb-4 font-medium">&ldquo;{selected}&rdquo;</p>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here. Practice out loud too!"
                rows={10}
                className="input-premium resize-y min-h-[200px]"
              />
            </>
          ) : (
            <p className="text-[0.9375rem] text-cvmora-muted">Select a question to practice.</p>
          )}
        </div>
      </div>
    </div>
  )
}
