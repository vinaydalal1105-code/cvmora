import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const STORAGE_KEY = 'cvmora-cookie-consent'

export function CookieBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === null) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setVisible(false)
  }

  const reject = () => {
    localStorage.setItem(STORAGE_KEY, 'rejected')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[100] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 px-4 sm:px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] bg-white border-t border-[#e7e5e4] shadow-[0_-4px_24px_rgba(0,0,0,0.06)]"
      role="dialog"
      aria-label="Cookie consent"
    >
      <p className="text-sm sm:text-[15px] text-[#44403c] leading-relaxed max-w-2xl order-2 sm:order-1">
        We use cookies to analyze website traffic and help improve our visitor experience.{' '}
        <Link
          to="/privacy"
          className="underline underline-offset-2 hover:text-[#f97316] font-medium transition-colors text-[#1c1917]"
        >
          Privacy Policy
        </Link>
      </p>
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 shrink-0 order-1 sm:order-2">
        <button
          type="button"
          onClick={reject}
          className="min-h-[44px] px-5 py-3 sm:py-2.5 rounded-full text-[15px] font-medium text-[#1c1917] bg-[#f5f5f4] hover:bg-[#e7e5e4] active:bg-[#e7e5e4] transition-colors border border-[#e7e5e4]"
        >
          Reject
        </button>
        <button
          type="button"
          onClick={accept}
          className="min-h-[44px] px-5 py-3 sm:py-2.5 rounded-full text-[16px] font-medium bg-[#BFED8D] text-[#1c1917] border border-[#a8e070] hover:bg-[#b0e87d] active:bg-[#b0e87d] transition-colors"
        >
          Accept
        </button>
      </div>
    </div>
  )
}
