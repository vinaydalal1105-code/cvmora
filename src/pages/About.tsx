import { Link } from 'react-router-dom'

export function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
      <h1 className="text-3xl font-bold text-[#1c1917] tracking-tight mb-2">
        About Us
      </h1>
      <p className="text-[#78716c] text-base mb-10">
        We help you build resumes that get you hired.
      </p>

      <div className="space-y-8 text-[#44403c] text-base leading-relaxed" style={{ lineHeight: 1.65 }}>
        <section>
          <h2 className="text-lg font-semibold text-[#1c1917] mb-3">Who we are</h2>
          <p>
            Cvmora is a resume and cover letter builder built for job seekers who want professional, ATS-friendly documents without the hassle. We combine simple tools with proven templates so you can create a strong application in minutes and stand out to recruiters.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1c1917] mb-3">Our mission</h2>
          <p>
            We believe everyone deserves a fair shot at the job they want. Our goal is to make it easy to present your experience clearly and professionally—whether you’re applying for your first job, switching careers, or aiming for a senior role. We focus on clarity, compliance with applicant tracking systems, and designs that recruiters actually read.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1c1917] mb-3">What we offer</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="text-[#1c1917]">Resume builder</strong> — Step-by-step builder with ATS-friendly and professional templates</li>
            <li><strong className="text-[#1c1917]">Cover letters</strong> — Matching cover letter templates and guidance</li>
            <li><strong className="text-[#1c1917]">Resume examples</strong> — Sample resumes by role and industry to inspire your own</li>
            <li><strong className="text-[#1c1917]">Resources & tips</strong> — Guides, FAQ, interview prep, and job board to support your search</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1c1917] mb-3">Why job seekers choose us</h2>
          <p>
            Users with a well-crafted resume are <strong className="text-[#1c1917]">75% more likely to land the job</strong>. We’re rated <strong className="text-[#1c1917]">4.8 out of 5</strong> by thousands of job seekers, and we’re committed to keeping our tools simple, fast, and effective.
          </p>
        </section>

        <section className="pt-4">
          <p className="text-[#78716c]">
            Have questions? Check our <Link to="/faq" className="text-[#f97316] hover:underline font-medium">FAQ</Link> or <Link to="/resources" className="text-[#f97316] hover:underline font-medium">Resources</Link>. Ready to start? <Link to="/builder" className="text-[#f97316] hover:underline font-medium">Build your resume</Link>.
          </p>
        </section>
      </div>
    </div>
  )
}
