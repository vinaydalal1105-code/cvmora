import { useState, useEffect, useRef } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { Footer } from './Footer'
import { CookieBar } from './CookieBar'
import { Logo } from './Logo'

type DropdownId = 'templates' | 'examples' | 'cover-letter' | 'resources'

const mainNav: { to: string; label: string; dropdown?: DropdownId }[] = [
  { to: '/templates', label: 'Resume Templates', dropdown: 'templates' },
  { to: '/examples', label: 'Resume Examples', dropdown: 'examples' },
  { to: '/cover-letter', label: 'Cover Letter', dropdown: 'cover-letter' },
  { to: '/faq', label: 'FAQ' },
  { to: '/resources', label: 'Resources', dropdown: 'resources' },
]

const exampleCategories = [
  { to: '/examples', icon: '🎓', title: 'Education', desc: 'Resumes for roles in or outside the classroom' },
  { to: '/examples', icon: '🏛️', title: 'Government', desc: 'Resumes that fit department recruiters' },
  { to: '/examples', icon: '⚙️', title: 'Engineering', desc: 'Resumes that highlight technical expertise' },
  { to: '/examples', icon: '🛒', title: 'Retail', desc: 'Resumes as well-crafted as your experience' },
]

const mostPopular = [
  { label: 'Nurse', to: '/examples' },
  { label: 'High School Student', to: '/examples' },
  { label: 'Internship', to: '/examples' },
  { label: 'Student', to: '/examples' },
  { label: 'Accountant', to: '/examples' },
]

const templateStyles = [
  { to: '/templates/ats', label: 'ATS', desc: 'Optimize for applicant tracking systems' },
  { to: '/templates', label: 'Professional', desc: 'Job-winning, recruiter-friendly layouts' },
  { to: '/templates', label: 'Modern', desc: 'Current and stylish for tech & creative' },
  { to: '/templates', label: 'Simple', desc: 'Clean, timeless structure' },
]

const coverLetterLinks = [
  { label: 'Cover Letter Builder', to: '/cover-letter' },
  { label: 'Cover Letter Templates', to: '/cover-letter/templates' },
  { label: 'Cover Letter Examples', to: '/cover-letter' },
  { label: 'How to write a cover letter', to: '/resources/guide/cover-letter' },
]

const resourceCategories = [
  { to: '/resources', icon: '📝', title: 'Resume Help', desc: 'How to write a resume, sections, and examples' },
  { to: '/resources', icon: '✉️', title: 'Cover Letter', desc: 'Structure, tone, and how to stand out' },
  { to: '/faq', icon: '❓', title: 'FAQ', desc: 'Quick answers about Cvmora' },
  { to: '/interview', icon: '🎤', title: 'Job Interview', desc: 'Practice questions and interview tips' },
]

function NavLink({
  to,
  label,
  isActive,
  hasDropdown,
  isDropdownOpen,
  onMouseEnter,
  onDropdownClick,
}: {
  to: string
  label: string
  isActive: boolean
  hasDropdown: boolean
  isDropdownOpen: boolean
  onMouseEnter: () => void
  onDropdownClick?: (e: React.MouseEvent) => void
}) {
  const handleClick = hasDropdown && onDropdownClick
    ? (e: React.MouseEvent) => {
        e.preventDefault()
        onDropdownClick(e)
      }
    : undefined

  return (
    <div
      className="relative"
      onMouseEnter={onMouseEnter}
    >
      <Link
        to={to}
        onClick={handleClick}
        className={`relative flex items-center gap-0.5 text-base font-normal px-2.5 py-2 transition-colors duration-150 outline-none focus:outline-none ${
          isActive || isDropdownOpen ? 'text-[#f97316]' : 'text-[#1c1917] hover:text-[#f97316]'
        }`}
      >
        {label}
        {hasDropdown && (
          <span
            className={`inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isDropdownOpen ? 'rotate-180' : ''}`}
            aria-hidden
          >
            <svg className="w-3 h-3 opacity-60" viewBox="0 0 12 12" fill="currentColor">
              <path d="M2.5 4.5 L6 8 L9.5 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </Link>
    </div>
  )
}

function ExamplesDropdown() {
  return (
    <div className="bg-white border-t border-cvmora-ink/8 shadow-[var(--shadow-card-hover)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left: Resume Examples by category */}
          <div>
            <h3 className="text-sm font-semibold text-cvmora-ink uppercase tracking-wider mb-4">Resume Examples</h3>
            <ul className="space-y-1">
              {exampleCategories.map((cat) => (
                <li key={cat.title}>
                  <Link
                    to={cat.to}
                    className="flex items-center gap-3 py-2.5 px-2 -mx-2 rounded-lg text-left group hover:bg-cvmora-ink/5 transition-colors"
                  >
                    <span className="text-lg shrink-0" aria-hidden>{cat.icon}</span>
                    <div className="min-w-0 flex-1">
                      <span className="font-medium text-cvmora-ink text-[0.9375rem] group-hover:text-[var(--color-primary)] transition-colors block">
                        {cat.title}
                      </span>
                      <span className="text-[0.8125rem] text-cvmora-muted block mt-0.5">{cat.desc}</span>
                    </div>
                    <span className="text-cvmora-muted group-hover:text-[var(--color-primary)] shrink-0" aria-hidden>›</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Middle: Most Popular */}
          <div>
            <h3 className="text-sm font-semibold text-cvmora-ink uppercase tracking-wider mb-4">Most Popular</h3>
            <ul className="space-y-1">
              {mostPopular.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="block py-2.5 px-2 -mx-2 rounded-lg text-[0.9375rem] text-cvmora-ink hover:bg-cvmora-ink/5 hover:text-[var(--color-primary)] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to="/examples"
              className="inline-flex items-center gap-1 mt-4 text-[0.9375rem] font-semibold text-[var(--color-primary)] hover:opacity-80 transition-opacity"
            >
              All Examples
              <span aria-hidden>›</span>
            </Link>
          </div>
          {/* Right: CTA */}
          <div className="flex flex-col">
            <div className="flex-1 rounded-xl bg-cvmora-cream border border-cvmora-ink/8 p-6 flex flex-col items-center text-center">
              <div className="w-20 h-24 rounded-lg bg-white border border-cvmora-ink/10 shadow-sm flex items-center justify-center mb-4">
                <span className="text-2xl text-cvmora-muted">📄</span>
              </div>
              <p className="font-semibold text-cvmora-ink text-[0.9375rem] mb-1">500+ Free Resume Examples by industry</p>
              <p className="text-[0.8125rem] text-cvmora-muted leading-relaxed mb-4">
                Use the expert guides and our resume builder to create a beautiful resume in minutes.
              </p>
              <Link
                to="/builder"
                className="text-[0.9375rem] font-semibold text-[var(--color-primary)] hover:opacity-80 transition-opacity inline-flex items-center gap-1"
              >
                Get started now
                <span aria-hidden>›</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TemplatesDropdown() {
  return (
    <div className="bg-white border-t border-cvmora-ink/8 shadow-[var(--shadow-card-hover)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div>
            <h3 className="text-sm font-semibold text-cvmora-ink uppercase tracking-wider mb-4">Resume Templates</h3>
            <ul className="space-y-1">
              {templateStyles.map((t) => (
                <li key={t.label}>
                  <Link
                    to={t.to}
                    className="flex items-center justify-between gap-3 py-2.5 px-2 -mx-2 rounded-lg text-left group hover:bg-cvmora-ink/5 transition-colors"
                  >
                    <div>
                      <span className="font-medium text-cvmora-ink text-[0.9375rem] group-hover:text-[var(--color-primary)] transition-colors block">{t.label}</span>
                      <span className="text-[0.8125rem] text-cvmora-muted block mt-0.5">{t.desc}</span>
                    </div>
                    <span className="text-cvmora-muted group-hover:text-[var(--color-primary)] shrink-0" aria-hidden>›</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col justify-center">
            <div className="rounded-xl bg-cvmora-cream border border-cvmora-ink/8 p-6 text-center">
              <p className="font-semibold text-cvmora-ink text-[0.9375rem] mb-1">Tested resume templates</p>
              <p className="text-[0.8125rem] text-cvmora-muted leading-relaxed mb-4">Use the templates recruiters like. Download to Word or PDF.</p>
              <Link to="/templates" className="text-[0.9375rem] font-semibold text-[var(--color-primary)] hover:opacity-80 inline-flex items-center gap-1">
                View all templates <span aria-hidden>›</span>
              </Link>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="rounded-xl bg-cvmora-cream border border-cvmora-ink/8 p-6 flex flex-col items-center text-center">
              <div className="w-20 h-24 rounded-lg bg-white border border-cvmora-ink/10 shadow-sm flex items-center justify-center mb-4">
                <span className="text-2xl text-cvmora-muted">📄</span>
              </div>
              <p className="font-semibold text-cvmora-ink text-[0.9375rem] mb-1">Create your resume in minutes</p>
              <p className="text-[0.8125rem] text-cvmora-muted leading-relaxed mb-4">Pick a template, fill in your details, export to PDF or Word.</p>
              <Link to="/builder" className="text-[0.9375rem] font-semibold text-[var(--color-primary)] hover:opacity-80 inline-flex items-center gap-1">
                Get started now <span aria-hidden>›</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CoverLetterDropdown() {
  return (
    <div className="bg-white border-t border-cvmora-ink/8 shadow-[var(--shadow-card-hover)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div>
            <h3 className="text-sm font-semibold text-cvmora-ink uppercase tracking-wider mb-4">Cover Letter</h3>
            <ul className="space-y-1">
              {coverLetterLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="block py-2.5 px-2 -mx-2 rounded-lg text-[0.9375rem] text-cvmora-ink hover:bg-cvmora-ink/5 hover:text-[var(--color-primary)] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-2 flex flex-col">
            <div className="rounded-xl bg-cvmora-cream border border-cvmora-ink/8 p-6 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-20 h-24 rounded-lg bg-white border border-cvmora-ink/10 shadow-sm flex items-center justify-center shrink-0">
                <span className="text-2xl text-cvmora-muted">✉️</span>
              </div>
              <div className="text-center sm:text-left">
                <p className="font-semibold text-cvmora-ink text-[0.9375rem] mb-1">Build a cover letter that matches your resume</p>
                <p className="text-[0.8125rem] text-cvmora-muted leading-relaxed mb-4">Paste the job, tailor your pitch, download as PDF or Word.</p>
                <Link to="/cover-letter" className="text-[0.9375rem] font-semibold text-[var(--color-primary)] hover:opacity-80 inline-flex items-center gap-1">
                  Create cover letter <span aria-hidden>›</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ResourcesDropdown() {
  return (
    <div className="bg-white border-t border-cvmora-ink/8 shadow-[var(--shadow-card-hover)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div>
            <h3 className="text-sm font-semibold text-cvmora-ink uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-1">
              {resourceCategories.map((cat) => (
                <li key={cat.title}>
                  <Link
                    to={cat.to}
                    className="flex items-center gap-3 py-2.5 px-2 -mx-2 rounded-lg text-left group hover:bg-cvmora-ink/5 transition-colors"
                  >
                    <span className="text-lg shrink-0" aria-hidden>{cat.icon}</span>
                    <div className="min-w-0 flex-1">
                      <span className="font-medium text-cvmora-ink text-[0.9375rem] group-hover:text-[var(--color-primary)] transition-colors block">{cat.title}</span>
                      <span className="text-[0.8125rem] text-cvmora-muted block mt-0.5">{cat.desc}</span>
                    </div>
                    <span className="text-cvmora-muted group-hover:text-[var(--color-primary)] shrink-0" aria-hidden>›</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-2 flex flex-col">
            <div className="rounded-xl bg-cvmora-cream border border-cvmora-ink/8 p-6 flex flex-col items-center text-center">
              <p className="font-semibold text-cvmora-ink text-[0.9375rem] mb-1">Need some expert advice?</p>
              <p className="text-[0.8125rem] text-cvmora-muted leading-relaxed mb-4">Guides on resumes, cover letters, and career advice. Field-tested tips.</p>
              <Link to="/resources" className="text-[0.9375rem] font-semibold text-[var(--color-primary)] hover:opacity-80 inline-flex items-center gap-1">
                Read the blog <span aria-hidden>›</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const SCROLL_THRESHOLD = 80

export function Layout() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [openDropdown, setOpenDropdown] = useState<DropdownId | null>(null)
  const [navVisible, setNavVisible] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const lastScrollYRef = useRef(0)
  const isBuilder = location.pathname.startsWith('/builder')
  const isCoverLetterBuilder =
    location.pathname.startsWith('/cover-letter') &&
    location.pathname !== '/cover-letter/templates' &&
    !location.pathname.startsWith('/cover-letter/templates/')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    setMobileMenuOpen(false)
    setOpenDropdown(null)
  }, [location.pathname])

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY
          const last = lastScrollYRef.current
          if (y <= SCROLL_THRESHOLD) {
            setNavVisible(true)
          } else if (y > last) {
            setNavVisible(false)
          } else {
            setNavVisible(true)
          }
          lastScrollYRef.current = y
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (isBuilder) {
    return (
      <div className="h-screen flex flex-col overflow-hidden bg-white">
        <Outlet />
        <CookieBar />
      </div>
    )
  }

  if (isCoverLetterBuilder) {
    return (
      <div className="h-screen flex flex-col overflow-hidden bg-[#fafafa]">
        <Outlet />
        <CookieBar />
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: 'linear-gradient(to bottom, #fef7f0 0%, #ffedd5 12%, #ffe4c4 25%, #f5e6dc 40%, #e8f0f4 55%, #dceef5 70%, #d4ebf7 85%, #e0f2fe 100%)',
      }}
    >
      {/* Fixed header strip: safe-area for notched devices, hides on scroll down */}
      <div
        className="fixed top-0 left-0 right-0 z-50 pt-[max(1rem,env(safe-area-inset-top))] pb-2.5 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]"
        style={{
          transform: navVisible ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
        }}
        onMouseLeave={() => setOpenDropdown(null)}
      >
        <header className="w-full max-w-[1400px] mx-auto rounded-full bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-[#e5e7eb]/80 overflow-visible">
          <div className="flex items-center justify-between gap-2 sm:gap-4 pl-3 pr-4 sm:px-8 py-2 sm:py-2.5 min-h-[44px] sm:min-h-0">
            <Logo />

            {/* Desktop nav: hidden on small screens */}
            <nav className="hidden lg:flex items-center gap-0 flex-1 justify-center max-w-2xl mx-3">
              {mainNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  label={item.label}
                  isActive={location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to))}
                  hasDropdown={!!item.dropdown}
                  isDropdownOpen={openDropdown === item.dropdown}
                  onMouseEnter={() => setOpenDropdown(item.dropdown ?? null)}
                  onDropdownClick={() => setOpenDropdown((prev) => (prev === item.dropdown ? null : (item.dropdown ?? null)))}
                />
              ))}
            </nav>

            {/* Mobile menu button — 44px touch target */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="lg:hidden flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] rounded-full text-[#1c1917] hover:bg-[#f5f5f4] active:bg-[#e7e5e4]"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>

            <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="text-[15px] font-medium text-[#1c1917] hover:text-[#f97316] transition-colors py-2.5 px-2 min-h-[44px] flex items-center lg:min-h-0">Dashboard</Link>
                  <span className="text-xs text-[#78716c] hidden lg:inline max-w-[120px] truncate" title={user?.email ?? ''}>{user?.email}</span>
                  <button type="button" onClick={handleLogout} className="text-[15px] font-medium text-[#1c1917] hover:text-[#f97316] transition-colors py-2.5 px-2 min-h-[44px] flex items-center lg:min-h-0">Sign out</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-[15px] font-medium text-[#1c1917] hover:text-[#f97316] transition-colors py-2.5 px-2 min-h-[44px] flex items-center rounded-full lg:min-h-0">Sign in</Link>
                  <Link to="/builder" className="px-3 py-2.5 min-h-[44px] flex items-center rounded-full bg-[#BFED8D] text-[#1c1917] text-[14px] sm:text-[15px] font-medium border border-[#a8e070] shadow-[0_1px_2px_rgba(0,0,0,0.06)] hover:bg-[#b0e87d] transition-colors whitespace-nowrap shrink-0">Start building</Link>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Mobile menu overlay: nav links + expandable dropdowns */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden absolute left-0 right-0 top-full z-40 mt-1 mx-2 sm:mx-4 rounded-2xl bg-white shadow-lg border border-[#e5e7eb] overflow-hidden max-h-[80vh] sm:max-h-[85vh] overflow-y-auto pb-[env(safe-area-inset-bottom)]"
            >
              <nav className="py-2">
                {mainNav.map((item) => (
                  <div key={item.to}>
                    {item.dropdown ? (
                      <button
                        type="button"
                        onClick={() => setOpenDropdown((prev) => (prev === item.dropdown ? null : item.dropdown ?? null))}
                        className={`w-full flex items-center justify-between gap-2 px-5 py-3.5 text-left text-[15px] font-normal transition-colors ${
                          openDropdown === item.dropdown ? 'text-[#f97316] bg-[#fff7ed]/50' : 'text-[#1c1917]'
                        }`}
                      >
                        {item.label}
                        <span className={`shrink-0 transition-transform ${openDropdown === item.dropdown ? 'rotate-180' : ''}`}>
                          <svg className="w-4 h-4 opacity-60" viewBox="0 0 12 12" fill="currentColor">
                            <path d="M2.5 4.5 L6 8 L9.5 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </button>
                    ) : (
                      <Link
                        to={item.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-5 py-3.5 text-[15px] font-normal text-[#1c1917] hover:bg-[#f5f5f4]"
                      >
                        {item.label}
                      </Link>
                    )}
                    {item.dropdown && openDropdown === item.dropdown && (
                      <div className="border-t border-[#e5e7eb] bg-[#fafafa]">
                        {openDropdown === 'templates' && <TemplatesDropdown />}
                        {openDropdown === 'examples' && <ExamplesDropdown />}
                        {openDropdown === 'cover-letter' && <CoverLetterDropdown />}
                        {openDropdown === 'resources' && <ResourcesDropdown />}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <div className="hidden lg:block">
          {openDropdown === 'templates' && (
            <motion.div
              key="templates"
              initial={{ opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 right-0 top-full z-40 overflow-hidden"
            >
              <TemplatesDropdown />
            </motion.div>
          )}
          {openDropdown === 'examples' && (
            <motion.div
              key="examples"
              initial={{ opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 right-0 top-full z-40 overflow-hidden"
            >
              <ExamplesDropdown />
            </motion.div>
          )}
          {openDropdown === 'cover-letter' && (
            <motion.div
              key="cover-letter"
              initial={{ opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 right-0 top-full z-40 overflow-hidden"
            >
              <CoverLetterDropdown />
            </motion.div>
          )}
          {openDropdown === 'resources' && (
            <motion.div
              key="resources"
              initial={{ opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 right-0 top-full z-40 overflow-hidden"
            >
              <ResourcesDropdown />
            </motion.div>
          )}
          </div>
        </AnimatePresence>
      </div>
      {/* Spacer so main content starts below the fixed header */}
      <div className="shrink-0 h-[76px] sm:h-[80px]" aria-hidden />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
      <CookieBar />
    </div>
  )
}
