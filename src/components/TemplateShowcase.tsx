import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { allTemplates } from "../data/templates";
import { TemplateCard } from "./TemplateCard";
import type { ResumeTemplate } from "../data/templates";

const AUTO_ADVANCE_MS = 5000;

export default function TemplateShowcase() {
  const [index, setIndex] = useState(0);
  const current: ResumeTemplate = allTemplates[index % allTemplates.length];

  const goPrev = () =>
    setIndex((i) => (i - 1 + allTemplates.length) % allTemplates.length);
  const goNext = useCallback(
    () => setIndex((i) => (i + 1) % allTemplates.length),
    []
  );

  useEffect(() => {
    const id = setInterval(goNext, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [goNext]);

  return (
    <section
      className="w-full py-16 sm:py-20 px-4 sm:px-6"
      style={{
        background:
          "linear-gradient(180deg, #e0f2fe 0%, #f0f9ff 40%, #fef3e8 100%)",
      }}
    >
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1c1917] text-center mb-2">
          Choose your resume template
        </h2>
        <p className="text-[#78716c] text-center text-sm sm:text-base mb-10">
          Browse one by one. Each template is different — find the one that fits
          you.
        </p>

        <div className="relative flex flex-col sm:flex-row items-center justify-center min-h-[500px] sm:min-h-[580px] gap-4">
          {/* Desktop: arrows on sides */}
          <button
            type="button"
            onClick={goPrev}
            className="hidden sm:flex absolute left-2 sm:left-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-[#e7e5e4] text-[#1c1917] hover:border-[#f97316]/50 hover:text-[#f97316] items-center justify-center transition-colors"
            aria-label="Previous template"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex flex-col items-center px-2 sm:px-4 w-full max-w-[580px] min-w-0 sm:min-w-[400px] flex-shrink-0">
            <div className="text-[#1c1917] font-bold text-lg sm:text-xl mb-1">
              {current.name}
            </div>
            <p className="text-[#78716c] text-xs sm:text-sm mb-4 sm:mb-6">
              {current.users ? `${current.users} chose this template` : "500+ users chose this template"}
            </p>
            <div className="relative w-full flex justify-center overflow-visible min-h-[420px] sm:min-h-[680px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.6, ease: [0.33, 0, 0.2, 1] }}
                  className="absolute inset-0 flex flex-col items-center justify-start w-full overflow-visible"
                >
                  <div
                    className="flex justify-center w-full overflow-visible origin-top scale-75 sm:scale-[1.28]"
                  >
                    <TemplateCard
                      template={current}
                      variant="hero"
                    />
                  </div>
                  <Link
                    to={`/builder?template=${encodeURIComponent(current.id)}`}
                    className="mt-6 sm:mt-8 w-full max-w-[320px] py-3 rounded-lg bg-[#BFED8D] text-[#1c1917] text-center text-[13px] font-semibold border border-[#a8e070] hover:bg-[#b0e87d] transition-colors"
                  >
                    Use this template
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <button
            type="button"
            onClick={goNext}
            className="hidden sm:flex absolute right-2 sm:right-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-[#e7e5e4] text-[#1c1917] hover:border-[#f97316]/50 hover:text-[#f97316] items-center justify-center transition-colors"
            aria-label="Next template"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Mobile: arrows below card */}
          <div className="flex sm:hidden items-center justify-center gap-6 w-full pt-2">
            <button
              type="button"
              onClick={goPrev}
              className="w-12 h-12 rounded-full bg-white shadow-lg border border-[#e7e5e4] text-[#1c1917] active:border-[#f97316]/50 active:text-[#f97316] flex items-center justify-center transition-colors"
              aria-label="Previous template"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              className="w-12 h-12 rounded-full bg-white shadow-lg border border-[#e7e5e4] text-[#1c1917] active:border-[#f97316]/50 active:text-[#f97316] flex items-center justify-center transition-colors"
              aria-label="Next template"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Pagination dots */}
        <div className="flex flex-wrap justify-center gap-2 mt-8">
          {allTemplates.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i === index
                  ? "bg-[#f97316] scale-110"
                  : "bg-[#d6d3d1] hover:bg-[#a8a29e]"
              }`}
              aria-label={`Go to template ${i + 1}`}
            />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/templates"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#BFED8D] text-[#1c1917] text-sm font-semibold border border-[#a8e070] hover:bg-[#b0e87d] transition-colors"
          >
            View all templates
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
