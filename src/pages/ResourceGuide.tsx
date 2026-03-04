import { Link, useParams, Navigate } from 'react-router-dom'

const GUIDE_CONTENT: Record<
  string,
  { title: string; tag: string; sections: { heading: string; body: string }[]; cta: string; ctaTo: string }
> = {
  resume: {
    title: 'How to write a resume: Expert guide & examples',
    tag: 'Field tested',
    cta: 'Create your resume',
    ctaTo: '/builder',
    sections: [
      {
        heading: 'What to include',
        body: 'Include your contact information, a clear professional summary or objective, work experience with bullet points, education, and relevant skills. Optional sections include certifications, projects, or volunteer work when they support your goal.',
      },
      {
        heading: 'What to leave out',
        body: 'Leave out personal details like age or photo (unless requested), outdated or irrelevant jobs from many years ago, and long paragraphs. Keep each section scannable and focused on what matters for the role you want.',
      },
      {
        heading: 'How to structure each section',
        body: 'Use reverse chronological order for experience and education. Start each bullet with a strong action verb and include numbers or outcomes when possible. Use consistent formatting and clear headings so recruiters and ATS can parse your resume easily.',
      },
    ],
  },
  'cover-letter': {
    title: 'How to write a cover letter: Expert guide & examples',
    tag: 'HR approved',
    cta: 'Write your cover letter',
    ctaTo: '/cover-letter',
    sections: [
      {
        heading: 'Structure and tone',
        body: 'Keep your cover letter to one page with a clear greeting, opening paragraph that states the role and your interest, one or two body paragraphs that connect your experience to the job, and a closing with a call to action. Use a professional but warm tone.',
      },
      {
        heading: 'Matching the job description',
        body: 'Reference specific requirements from the job posting and show how your background fits. Use similar keywords and phrases so recruiters see the match. Focus on a few strong examples rather than listing everything.',
      },
      {
        heading: 'Standing out',
        body: 'Show you understand the company and role. Mention a recent achievement or a concrete example. End with enthusiasm and a clear next step, such as your availability for an interview.',
      },
    ],
  },
  ats: {
    title: 'ATS-friendly resume tips: Get past the bots',
    tag: 'ATS',
    cta: 'Browse ATS templates',
    ctaTo: '/templates/ats',
    sections: [
      {
        heading: 'Formatting that works',
        body: 'Use standard section headings (e.g. Experience, Education, Skills), simple fonts, and avoid headers, footers, tables, or text boxes. Stick to a single column layout so ATS can read your content in order.',
      },
      {
        heading: 'Keywords that help',
        body: 'Include keywords from the job description in your summary, experience, and skills. Use both exact phrases and natural variations. Don’t stuff keywords; keep sentences clear and professional.',
      },
      {
        heading: 'Reaching recruiters',
        body: 'An ATS-friendly resume is also easy for humans to read. After passing the screen, your resume should look clean and professional. All Cvmora templates are built to work with ATS and impress recruiters.',
      },
    ],
  },
  summary: {
    title: 'Resume summary examples that get interviews',
    tag: 'Tips',
    cta: 'Build your resume',
    ctaTo: '/builder',
    sections: [
      {
        heading: 'Strong opening lines',
        body: 'Start with your years of experience and core focus (e.g. “Project manager with 6+ years leading cross-functional teams”). Follow with one or two sentences on key strengths and the value you bring. Keep it to 3–5 lines.',
      },
      {
        heading: 'By experience level',
        body: 'Experienced candidates can lead with tenure and expertise. Career changers or entry-level applicants can emphasize transferable skills, education, and motivation. Tailor the tone to the industry and role.',
      },
      {
        heading: 'What to say and avoid',
        body: 'Do: use concrete skills and outcomes. Don’t: use vague phrases like “hard worker” or “team player” without examples. Avoid first person (“I”) in most formats; use third person or implied subject for a professional tone.',
      },
    ],
  },
  experience: {
    title: 'How to list experience and achievements',
    tag: 'Tips',
    cta: 'See resume examples',
    ctaTo: '/examples',
    sections: [
      {
        heading: 'Bullet points that show impact',
        body: 'Start each bullet with a strong action verb (Led, Improved, Designed, Managed). Include scope (team size, budget, timeline) and results (percentages, numbers, awards). Focus on what you achieved, not only what you did.',
      },
      {
        heading: 'Using numbers',
        body: 'Quantify wherever possible: “Reduced costs by 20%,” “Managed a team of 8,” “Delivered 15 projects on time.” Even approximate numbers help recruiters understand scale and impact.',
      },
      {
        heading: 'Action verbs and clarity',
        body: 'Use varied, specific verbs (e.g. Spearheaded, Streamlined, Implemented). Keep bullets to one or two lines. Put the most important or recent achievements first so recruiters see them quickly.',
      },
    ],
  },
  interview: {
    title: 'Interview preparation and common questions',
    tag: 'Career',
    cta: 'Practice interview questions',
    ctaTo: '/interview',
    sections: [
      {
        heading: 'Behavioral and situational questions',
        body: 'Prepare short stories using the STAR method (Situation, Task, Action, Result) for questions like “Tell me about a time you…” or “Describe a challenge you faced.” Have 3–5 examples that show leadership, problem-solving, and teamwork.',
      },
      {
        heading: 'Common questions to practice',
        body: 'Practice answers for: Tell me about yourself, Why this company/role, Your strengths and weaknesses, Where you see yourself in 5 years, and a question that shows you researched the company. Keep answers concise and relevant.',
      },
      {
        heading: 'Building confidence',
        body: 'Rehearse out loud or with a friend. Review the job description and align your answers to the role. Prepare thoughtful questions to ask the interviewer. Get good sleep and arrive (or log in) a few minutes early.',
      },
    ],
  },
}

export function ResourceGuide() {
  const { slug } = useParams<{ slug: string }>()
  const guide = slug ? GUIDE_CONTENT[slug] : null

  if (!guide) {
    return <Navigate to="/resources" replace />
  }

  return (
    <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-14 sm:py-20">
      <Link
        to="/resources"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)] hover:text-cvmora-ink transition-colors mb-8"
      >
        ← Back to Guides & tips
      </Link>
      <span className="inline-block px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider mb-4 border bg-violet-100 text-violet-800 border-violet-200/50">
        {guide.tag}
      </span>
      <h1 className="text-3xl sm:text-[2rem] font-bold text-cvmora-ink tracking-tight mb-8">
        {guide.title}
      </h1>
      <div className="space-y-10 mb-12">
        {guide.sections.map((sec, i) => (
          <section key={i}>
            <h2 className="text-xl font-semibold text-cvmora-ink mb-3">{sec.heading}</h2>
            <p className="text-base text-cvmora-ink/80 leading-relaxed" style={{ lineHeight: 1.65 }}>
              {sec.body}
            </p>
          </section>
        ))}
      </div>
      <Link
        to={guide.ctaTo}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--color-primary)] text-white font-semibold hover:opacity-95 transition-opacity"
      >
        {guide.cta}
        <span aria-hidden>→</span>
      </Link>
    </div>
  )
}
