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

const templateItems = [
  { to: '/templates', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z', title: 'All Templates', desc: 'Browse all resume templates in one place' },
  { to: '/templates/ats', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', title: 'ATS-Friendly', desc: 'Optimized for applicant tracking systems' },
  { to: '/templates', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', title: 'Professional', desc: 'Job-winning, recruiter-friendly layouts' },
  { to: '/templates', icon: 'M13 10V3L4 14h7v7l9-11h-7z', title: 'Modern', desc: 'Current and stylish for innovative roles' },
  { to: '/templates', icon: 'M4 6h16M4 12h16M4 18h7', title: 'Simple', desc: 'Clean, timeless single-column structure' },
  { to: '/builder', icon: 'M12 4v16m8-8H4', title: 'Create Resume', desc: 'Start building your resume now' },
]

const exampleItems = [
  { to: '/examples', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', title: 'Education', desc: 'Resumes for teaching and academic roles' },
  { to: '/examples', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', title: 'Government', desc: 'Resumes that fit department requirements' },
  { to: '/examples', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', title: 'Engineering', desc: 'Highlight your technical expertise' },
  { to: '/examples', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', title: 'Retail', desc: 'Resumes crafted for customer-facing roles' },
  { to: '/examples', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', title: 'All Examples', desc: '500+ free resume examples by industry' },
  { to: '/builder', icon: 'M12 4v16m8-8H4', title: 'Build Resume', desc: 'Create your resume from scratch' },
]

const coverLetterItems = [
  { to: '/cover-letter', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', title: 'Cover Letter Builder', desc: 'Create a tailored cover letter in minutes' },
  { to: '/cover-letter/templates', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z', title: 'Cover Letter Templates', desc: 'Professional templates for any industry' },
  { to: '/cover-letter', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', title: 'Cover Letter Examples', desc: 'See real examples that got results' },
  { to: '/resources/guide/cover-letter', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', title: 'How to Write', desc: 'Step-by-step guide to a great cover letter' },
]

const resourceItems = [
  { to: '/resources', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', title: 'Resume Guide', desc: 'How to write a resume, sections and tips' },
  { to: '/resources', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', title: 'Cover Letter Guide', desc: 'Structure, tone, and how to stand out' },
  { to: '/faq', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', title: 'FAQ', desc: 'Quick answers about Cvmora' },
  { to: '/interview', icon: 'M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z', title: 'Job Interview', desc: 'Practice questions and interview tips' },
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

function DropdownItem({ to, icon, title, desc }: { to: string; icon: string; title: string; desc: string }) {
  return (
    <Link
      to={to}
      className="flex items-start gap-3.5 px-3 py-3 rounded-xl hover:bg-[#f5f5f4] transition-colors group"
    >
      <span className="w-9 h-9 rounded-lg bg-[#f5f5f4] group-hover:bg-white flex items-center justify-center shrink-0 mt-0.5 transition-colors">
        <svg className="w-[18px] h-[18px] text-[#44403c]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path d={icon} />
        </svg>
      </span>
      <div className="min-w-0">
        <span className="text-[14px] font-semibold text-[#1c1917] block leading-tight">{title}</span>
        <span className="text-[13px] text-[#78716c] block mt-0.5 leading-snug">{desc}</span>
      </div>
    </Link>
  )
}

function TemplatesDropdown() {
  return (
    <div className="bg-white border-t border-[#e7e5e4] shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
      <div className="max-w-[900px] mx-auto px-6 py-5">
        <div className="grid grid-cols-3 gap-x-2">
          {templateItems.map((item) => (
            <DropdownItem key={item.title} {...item} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ExamplesDropdown() {
  return (
    <div className="bg-white border-t border-[#e7e5e4] shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
      <div className="max-w-[900px] mx-auto px-6 py-5">
        <div className="grid grid-cols-3 gap-x-2">
          {exampleItems.map((item) => (
            <DropdownItem key={item.title} {...item} />
          ))}
        </div>
      </div>
    </div>
  )
}

function CoverLetterDropdown() {
  return (
    <div className="bg-white border-t border-[#e7e5e4] shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
      <div className="max-w-[900px] mx-auto px-6 py-5">
        <div className="grid grid-cols-2 gap-x-2">
          {coverLetterItems.map((item) => (
            <DropdownItem key={item.title} {...item} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ResourcesDropdown() {
  return (
    <div className="bg-white border-t border-[#e7e5e4] shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
      <div className="max-w-[900px] mx-auto px-6 py-5">
        <div className="grid grid-cols-2 gap-x-2">
          {resourceItems.map((item) => (
            <DropdownItem key={item.title} {...item} />
          ))}
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
          <div className="flex items-center justify-between gap-1.5 sm:gap-4 pl-2.5 pr-2 sm:px-8 py-1.5 sm:py-2.5 min-h-[48px] sm:min-h-0">
            <Logo />

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

            <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/pricing"
                    className="hidden sm:flex text-[14px] sm:text-[15px] font-medium text-[#f97316] hover:text-[#ea580c] transition-colors py-2 px-1.5 sm:px-2 min-h-[44px] items-center rounded-full lg:min-h-0"
                  >
                    Pricing
                  </Link>
                  <Link to="/dashboard" className="hidden sm:flex text-[15px] font-medium text-[#1c1917] hover:text-[#f97316] transition-colors py-2.5 px-2 min-h-[44px] items-center lg:min-h-0">Dashboard</Link>
                  <span className="text-xs text-[#78716c] hidden lg:inline max-w-[120px] truncate" title={(user?.name || user?.email) ?? ''}>{user?.name || user?.email}</span>
                  <button type="button" onClick={handleLogout} className="hidden sm:flex text-[15px] font-medium text-[#1c1917] hover:text-[#f97316] transition-colors py-2.5 px-2 min-h-[44px] items-center lg:min-h-0">Sign out</button>
                </>
              ) : (
                <>
                  <Link to="/pricing" className="text-[14px] sm:text-[15px] font-medium text-[#f97316] hover:text-[#ea580c] transition-colors py-2 px-1.5 sm:px-2 min-h-[44px] flex items-center rounded-full lg:min-h-0 hidden sm:flex">Pricing</Link>
                  <Link to="/login" className="text-[14px] sm:text-[15px] font-medium text-[#1c1917] hover:text-[#f97316] transition-colors py-2 px-1.5 sm:px-2 min-h-[44px] flex items-center rounded-full lg:min-h-0 hidden sm:flex">Sign in</Link>
                  <Link to="/builder" className="px-3 sm:px-4 py-2 sm:py-2.5 min-h-[40px] sm:min-h-[44px] flex items-center rounded-full bg-[#BFED8D] text-[#1c1917] text-[13px] sm:text-[15px] font-medium border border-[#a8e070] shadow-[0_1px_2px_rgba(0,0,0,0.06)] hover:bg-[#b0e87d] transition-colors whitespace-nowrap shrink-0">Start building</Link>
                </>
              )}

              <button
                type="button"
                onClick={() => setMobileMenuOpen((o) => !o)}
                className="lg:hidden flex items-center justify-center w-10 h-10 min-w-[40px] min-h-[40px] rounded-full text-[#1c1917] hover:bg-[#f5f5f4] active:bg-[#e7e5e4]"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                )}
              </button>
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

                <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="block px-5 py-3.5 text-[15px] font-semibold text-[#f97316] hover:bg-[#fff7ed]">
                  Pricing
                </Link>

                <div className="border-t border-[#e5e7eb] mt-1 pt-1">
                  {isAuthenticated ? (
                    <>
                      <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-5 py-3.5 text-[15px] font-medium text-[#1c1917] hover:bg-[#f5f5f4]">
                        Dashboard
                      </Link>
                      <button type="button" onClick={() => { handleLogout(); setMobileMenuOpen(false) }} className="w-full text-left px-5 py-3.5 text-[15px] font-medium text-[#1c1917] hover:bg-[#f5f5f4]">
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-5 py-3.5 text-[15px] font-medium text-[#1c1917] hover:bg-[#f5f5f4]">
                        Sign in
                      </Link>
                      <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="block mx-4 mb-3 mt-1 text-center px-5 py-3 rounded-full bg-[#BFED8D] text-[#1c1917] text-[15px] font-semibold border border-[#a8e070]">
                        Create account
                      </Link>
                    </>
                  )}
                </div>
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
