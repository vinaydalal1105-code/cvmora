import { useState } from 'react'
import { interviewQuestions } from '../data/interviewQuestions'

export function InterviewPrep() {
  const [activeCategory, setActiveCategory] = useState(interviewQuestions[0].category)
  const [selected, setSelected] = useState<string | null>(null)
  const [answer, setAnswer] = useState('')
  const [savedAnswers, setSavedAnswers] = useState<Record<string, string>>({})

  const activeGroup = interviewQuestions.find((g) => g.category === activeCategory)

  const handleSave = () => {
    if (selected && answer.trim()) {
      setSavedAnswers((prev) => ({ ...prev, [selected]: answer }))
    }
  }

  const handleSelectQuestion = (q: string) => {
    if (selected && answer.trim()) {
      setSavedAnswers((prev) => ({ ...prev, [selected]: answer }))
    }
    setSelected(q)
    setAnswer(savedAnswers[q] ?? '')
  }

  const totalAnswered = Object.keys(savedAnswers).length
  const totalQuestions = interviewQuestions.reduce((sum, g) => sum + g.questions.length, 0)

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="mb-10">
        <p className="text-sm font-semibold text-[#f97316] uppercase tracking-wider mb-2">Practice</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1c1917] mb-3 tracking-tight">
          Interview Prep
        </h1>
        <p className="text-base text-[#78716c] leading-relaxed max-w-lg">
          Select a question, draft your answer, and practice out loud before the real thing.
        </p>
      </div>

      {totalAnswered > 0 && (
        <div className="mb-6 flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full bg-[#f5f5f4] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#f97316] transition-all duration-500"
              style={{ width: `${(totalAnswered / totalQuestions) * 100}%` }}
            />
          </div>
          <span className="text-sm font-medium text-[#78716c] shrink-0">
            {totalAnswered}/{totalQuestions} practiced
          </span>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-8">
        {interviewQuestions.map((group) => {
          const answeredInGroup = group.questions.filter((q) => savedAnswers[q]).length
          return (
            <button
              key={group.category}
              type="button"
              onClick={() => setActiveCategory(group.category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === group.category
                  ? 'bg-[#1c1917] text-white'
                  : 'bg-white text-[#44403c] border border-[#e7e5e4] hover:border-[#d6d3d1]'
              }`}
            >
              {group.category}
              {answeredInGroup > 0 && (
                <span className={`ml-1.5 text-xs ${activeCategory === group.category ? 'text-white/70' : 'text-[#a8a29e]'}`}>
                  {answeredInGroup}/{group.questions.length}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-[1fr_1fr] gap-6 items-start">
        <div className="space-y-2">
          {activeGroup?.questions.map((q, i) => {
            const isSelected = selected === q
            const hasSaved = !!savedAnswers[q]
            return (
              <button
                key={q}
                type="button"
                onClick={() => handleSelectQuestion(q)}
                className={`w-full text-left px-4 py-3.5 rounded-xl transition-all duration-150 flex items-start gap-3 ${
                  isSelected
                    ? 'bg-[#fff7ed] border border-[#f97316]/25 shadow-sm'
                    : 'bg-white border border-[#e7e5e4] hover:border-[#d6d3d1] hover:shadow-sm'
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                  hasSaved
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60'
                    : isSelected
                      ? 'bg-[#f97316] text-white'
                      : 'bg-[#f5f5f4] text-[#78716c]'
                }`}>
                  {hasSaved ? '✓' : i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <span className={`text-[0.9375rem] font-medium block ${isSelected ? 'text-[#1c1917]' : 'text-[#44403c]'}`}>
                    {q}
                  </span>
                  {hasSaved && !isSelected && (
                    <span className="text-xs text-[#a8a29e] mt-0.5 block truncate">{savedAnswers[q]}</span>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        <div className="lg:sticky lg:top-24">
          <div className="rounded-xl border border-[#e7e5e4] bg-white shadow-sm overflow-hidden">
            {selected ? (
              <div className="p-5 sm:p-6">
                <p className="text-sm font-semibold text-[#f97316] uppercase tracking-wider mb-2">Your answer</p>
                <p className="text-[0.9375rem] font-medium text-[#1c1917] mb-4 leading-snug">
                  &ldquo;{selected}&rdquo;
                </p>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here. Practice saying it out loud too."
                  rows={8}
                  className="w-full rounded-lg border border-[#e7e5e4] px-4 py-3 text-[0.9375rem] text-[#1c1917] placeholder:text-[#a8a29e] focus:outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]/20 resize-y min-h-[180px] transition-colors"
                />
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-[#a8a29e]">
                    {answer.trim().split(/\s+/).filter(Boolean).length} words
                  </span>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={!answer.trim()}
                    className="px-4 py-2 rounded-full bg-[#1c1917] text-white text-sm font-medium hover:bg-[#292524] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Save answer
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 sm:p-10 text-center">
                <div className="w-12 h-12 rounded-full bg-[#f5f5f4] flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-[#a8a29e]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                  </svg>
                </div>
                <p className="text-[0.9375rem] font-medium text-[#1c1917] mb-1">Pick a question to start</p>
                <p className="text-sm text-[#a8a29e]">Select any question from the left to draft your answer.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
