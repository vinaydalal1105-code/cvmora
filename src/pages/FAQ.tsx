import { useState } from 'react'

const faqs: { q: string; a: string }[] = [
  {
    q: 'What is the definition of a resume?',
    a: "A resume is a concise document that summarizes your work experience, education, skills, and accomplishments. It's used to showcase your qualifications to employers and helps you stand out. It tells employers why you deserve a job interview in one or two powerful pages.",
  },
  {
    q: 'What is the difference between a CV and a resume?',
    a: 'In the U.S., a resume is typically one to two pages and highlights relevant skills and experience for a specific job. A CV (curriculum vitae) is more detailed and often used in academia or internationally. For most U.S. job applications, a resume is the preferred format.',
  },
  {
    q: 'How do I choose the right resume template?',
    a: 'Consider the job and industry. For creative roles, a more visual template can work. For traditional industries like finance or law, choose a clean, professional layout. All Cvmora templates are ATS-friendly and recruiter-approved.',
  },
  {
    q: 'How far back should a resume go?',
    a: "Focus on the last 10–15 years and your most relevant experience. Older roles can be summarized briefly or left out if they don't support your current goal.",
  },
  {
    q: 'What does ATS-friendly mean?',
    a: 'Applicant Tracking Systems (ATS) are software used by employers to screen resumes. An ATS-friendly resume uses a simple format, standard fonts, and clear headings so it parses correctly and gets seen by recruiters.',
  },
  {
    q: 'What file format can I download?',
    a: 'You can download your resume and cover letter as PDF (via the browser print dialog) or as a Word document (.docx) for editing offline.',
  },
  {
    q: 'Should I tailor my resume for each job?',
    a: 'Yes. Tailoring your resume to the job description increases your chances of getting an interview. Highlight the skills and experience most relevant to each role. With Cvmora you can save multiple versions and switch between them.',
  },
  {
    q: 'How do I delete my account?',
    a: 'From your dashboard you can manage your account. For full account deletion, contact support. We will process your request in line with our privacy policy.',
  },
  {
    q: 'Is there a free plan?',
    a: 'Yes. You can create and edit resumes and cover letters and export to PDF or Word. Creating an account lets you save and manage multiple documents.',
  },
  {
    q: 'How do I search for jobs on Cvmora?',
    a: 'Use the Job Board from the main navigation or footer. You can browse remote jobs by category and open listings in a new tab to apply with your Cvmora resume.',
  },
  {
    q: 'Where do job listings come from?',
    a: 'We aggregate remote job listings from trusted sources so you can see opportunities in one place. Listings open on the employer or job board site for applications.',
  },
]

function PlusIcon({ open }: { open: boolean }) {
  return (
    <span
      className={`inline-flex w-6 h-6 items-center justify-center text-[#1c1917] font-light transition-transform duration-200 ${
        open ? 'rotate-45' : ''
      }`}
      aria-hidden
    >
      +
    </span>
  )
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
      >
        <span className="font-normal text-[#1c1917] text-base leading-snug flex-1 min-w-0 text-left">
          {question}
        </span>
        <PlusIcon open={open} />
      </button>
      {open && (
        <p className="pb-5 text-base text-[#78716c] leading-relaxed" style={{ lineHeight: 1.6 }}>
          {answer}
        </p>
      )}
    </>
  )
}

export function FAQ() {
  return (
    <div className="min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Base44-style: two columns — heading left, accordion right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-4 flex flex-col justify-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1c1917] tracking-tight leading-tight">
              Frequently asked questions
            </h1>
          </div>
          <div className="lg:col-span-8">
            <div className="divide-y divide-[#e7e5e4]">
              {faqs.map((faq, i) => (
                <FaqItem key={i} question={faq.q} answer={faq.a} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}