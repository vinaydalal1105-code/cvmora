import { Link } from 'react-router-dom'
import { Logo } from './Logo'

const columns = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'Privacy Policy', to: '/privacy' },
    ],
  },
  {
    title: 'Product',
    links: [
      { label: 'Resume Builder', to: '/builder' },
      { label: 'Resume Templates', to: '/templates' },
      { label: 'Resume Examples', to: '/examples' },
      { label: 'Cover Letter', to: '/cover-letter' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Guides & Tips', to: '/resources' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Job Board', to: '/jobs' },
      { label: 'Interview Prep', to: '/interview' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Service', to: '/terms' },
      { label: 'Accessibility', to: '/accessibility' },
    ],
  },
]

const socialLinks = [
  { label: 'X', href: 'https://twitter.com', aria: 'X (Twitter)' },
  { label: 'GitHub', href: 'https://github.com', aria: 'GitHub' },
  { label: 'LinkedIn', href: 'https://linkedin.com', aria: 'LinkedIn' },
  { label: 'Reddit', href: 'https://reddit.com', aria: 'Reddit' },
]

export function Footer() {
  return (
    <footer className="bg-white border-t border-[#e7e5e4] mt-auto pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-10">
          {/* Left: Logo + description + social */}
          <div className="lg:col-span-1 flex flex-col">
            <Logo iconOnly={false} className="mb-4" />
            <p className="text-sm sm:text-base text-[#78716c] leading-relaxed max-w-[280px] mb-6" style={{ lineHeight: 1.6 }}>
              Cvmora is the resume builder that helps you create professional resumes and cover letters in minutes. Get hired faster.
            </p>
            <div className="flex flex-wrap items-center gap-4" aria-label="Social links">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#78716c] hover:text-[#f97316] transition-colors text-base font-medium py-2 min-h-[44px] flex items-center sm:min-h-0 sm:py-0"
                  aria-label={s.aria}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
          {/* Right: Column links — 2 cols on mobile, 4 on larger */}
          <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-6">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] text-[#1c1917] mb-3 sm:mb-4">
                  {col.title}
                </h3>
                <ul className="space-y-1 sm:space-y-3">
                  {col.links.map((link) => (
                    <li key={link.to + link.label}>
                      <Link
                        to={link.to}
                        className="block text-sm sm:text-base text-[#78716c] hover:text-[#f97316] transition-colors py-2.5 sm:py-1.5 -mx-1 px-1 rounded-lg active:bg-[#f5f5f4]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-[#e7e5e4]">
          <p className="text-xs sm:text-sm text-[#78716c]">
            © {new Date().getFullYear()} Cvmora. Build resumes that get you hired.
          </p>
        </div>
      </div>
    </footer>
  )
}
