import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/client'

const MONTHLY_PRICE = 9
const YEARLY_PRICE = 79
const YEARLY_MONTHLY_EQUIV = +(YEARLY_PRICE / 12).toFixed(2)
const YEARLY_SAVINGS_PERCENT = Math.round((1 - YEARLY_PRICE / (MONTHLY_PRICE * 12)) * 100)

const FREE_FEATURES = [
  'Build & preview your resume',
  'All 20+ professional templates',
  'Real-time ATS score checker',
  'Cover letter builder',
  'Unlimited edits & formatting',
]

const PRO_FEATURES = [
  'Everything in Free, plus:',
  'Unlimited PDF & Word downloads',
  'Premium template styles',
  'Priority email support',
  'Early access to new features',
  'Manage subscription anytime',
]

export function Pricing() {
  const { user, isAuthenticated, refreshUser } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'cancel'; message: string } | null>(null)

  const isActive = user?.subscription_status === 'active'

  useEffect(() => {
    const status = searchParams.get('checkout')
    if (status === 'success') {
      setToast({ type: 'success', message: 'Welcome to Pro! Your subscription is now active.' })
      if (isAuthenticated) refreshUser()
      const next = new URLSearchParams(searchParams)
      next.delete('checkout')
      next.delete('session_id')
      setSearchParams(next, { replace: true })
    } else if (status === 'cancel') {
      setToast({ type: 'cancel', message: 'Checkout was cancelled. No charge was made.' })
      const next = new URLSearchParams(searchParams)
      next.delete('checkout')
      setSearchParams(next, { replace: true })
    }
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 6000)
    return () => clearTimeout(t)
  }, [toast])

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      const res = await api<{ url: string }>('/stripe/create-checkout-session', {
        method: 'POST',
        body: { billingCycle: billing, returnUrl: 'pricing' },
      })
      if (res?.url) window.location.href = res.url
    } catch (err) {
      setToast({ type: 'cancel', message: err instanceof Error ? err.message : 'Something went wrong.' })
      setLoading(false)
    }
  }

  const handleManage = async () => {
    setLoading(true)
    try {
      const res = await api<{ url: string }>('/stripe/customer-portal', { method: 'POST' })
      if (res?.url) window.location.href = res.url
    } catch (err) {
      setToast({ type: 'cancel', message: err instanceof Error ? err.message : 'Could not open billing portal.' })
      setLoading(false)
    }
  }

  const price = billing === 'monthly' ? MONTHLY_PRICE : YEARLY_MONTHLY_EQUIV
  const totalLabel = billing === 'yearly' ? `$${YEARLY_PRICE}/year` : `$${MONTHLY_PRICE}/month`

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-20">
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-50 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl shadow-lg text-[13px] sm:text-[14px] font-medium max-w-[90vw] text-center ${
            toast.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-amber-50 text-amber-800 border border-amber-200'
          }`}
        >
          {toast.message}
        </motion.div>
      )}

      <div className="text-center mb-10 sm:mb-14">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#1c1917] tracking-tight"
        >
          Simple, transparent pricing
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-4 text-lg text-[#78716c] max-w-xl mx-auto"
        >
          Build your resume for free. Upgrade to Pro when you're ready to download.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="inline-flex items-center bg-[#f5f5f4] rounded-full p-1 mt-8"
        >
          <button
            type="button"
            onClick={() => setBilling('monthly')}
            className={`px-5 py-2 rounded-full text-[14px] font-semibold transition-all ${
              billing === 'monthly'
                ? 'bg-white text-[#1c1917] shadow-sm'
                : 'text-[#78716c] hover:text-[#1c1917]'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBilling('yearly')}
            className={`px-5 py-2 rounded-full text-[14px] font-semibold transition-all flex items-center gap-2 ${
              billing === 'yearly'
                ? 'bg-white text-[#1c1917] shadow-sm'
                : 'text-[#78716c] hover:text-[#1c1917]'
            }`}
          >
            Yearly
            <span className="text-[11px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
              Save {YEARLY_SAVINGS_PERCENT}%
            </span>
          </button>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {/* Free tier */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-2xl border border-[#e7e5e4] bg-white p-6 sm:p-8 flex flex-col"
        >
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#1c1917]">Free</h2>
            <p className="text-[#78716c] text-sm mt-1">Everything you need to get started</p>
          </div>

          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-extrabold text-[#1c1917]">$0</span>
            <span className="text-[#a8a29e] text-sm font-medium">/month</span>
          </div>

          <Link
            to="/builder"
            className="w-full text-center px-5 py-3 rounded-full border-2 border-[#e7e5e4] text-[#1c1917] text-[15px] font-semibold hover:border-[#d6d3d1] hover:bg-[#fafaf9] active:scale-[0.98] transition-all"
          >
            Get started free
          </Link>

          <ul className="mt-8 space-y-3 flex-1">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3 text-[14px] text-[#44403c]">
                <svg className="w-5 h-5 text-[#a8a29e] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Pro tier */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="rounded-2xl border-2 border-[#f97316] bg-white p-6 sm:p-8 flex flex-col relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-[#f97316] text-white text-[11px] font-bold px-4 py-1 rounded-bl-xl">
            MOST POPULAR
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#1c1917]">Pro</h2>
            <p className="text-[#78716c] text-sm mt-1">For job seekers ready to land interviews</p>
          </div>

          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-4xl font-extrabold text-[#1c1917]">
              ${billing === 'monthly' ? MONTHLY_PRICE : YEARLY_MONTHLY_EQUIV}
            </span>
            <span className="text-[#a8a29e] text-sm font-medium">/month</span>
          </div>
          {billing === 'yearly' && (
            <p className="text-[12px] text-[#78716c] mb-5">
              Billed as {totalLabel}
            </p>
          )}
          {billing === 'monthly' && <div className="mb-5" />}

          {isActive ? (
            <div className="flex flex-col gap-2">
              <div className="w-full text-center px-5 py-3 rounded-full bg-green-50 text-green-700 text-[15px] font-semibold border border-green-200">
                Current plan
              </div>
              <button
                type="button"
                onClick={handleManage}
                disabled={loading}
                className="text-[13px] text-[#f97316] hover:text-[#ea580c] font-medium underline disabled:opacity-50 transition-colors"
              >
                {loading ? 'Opening...' : 'Manage subscription'}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full px-5 py-3 rounded-full bg-[#f97316] text-white text-[15px] font-semibold hover:bg-[#ea580c] active:scale-[0.98] disabled:opacity-50 transition-all shadow-sm"
            >
              {loading ? 'Redirecting...' : 'Start 3-Day Free Trial'}
            </button>
          )}

          <ul className="mt-8 space-y-3 flex-1">
            {PRO_FEATURES.map((f, i) => (
              <li key={f} className={`flex items-start gap-3 text-[14px] ${i === 0 ? 'text-[#f97316] font-semibold' : 'text-[#44403c]'}`}>
                {i === 0 ? (
                  <svg className="w-5 h-5 text-[#f97316] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-[#f97316] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {f}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto mt-16 sm:mt-20">
        <h2 className="text-xl font-bold text-[#1c1917] text-center mb-8">Frequently asked questions</h2>
        <div className="space-y-4">
          <FaqItem
            q="Can I try before I pay?"
            a="Absolutely. Build your resume, pick a template, customize colors, and preview everything for free. You only need Pro when you're ready to download."
          />
          <FaqItem
            q="What payment methods do you accept?"
            a="We accept all major credit and debit cards (Visa, Mastercard, Amex) through Stripe's secure checkout. Your card details never touch our servers."
          />
          <FaqItem
            q="Can I cancel anytime?"
            a="Yes. You can cancel your subscription at any time from the billing portal. You'll keep Pro access until the end of your current billing period."
          />
          <FaqItem
            q="Do you offer refunds?"
            a="If you're not satisfied, contact us within 7 days of your first payment and we'll issue a full refund — no questions asked."
          />
          <FaqItem
            q="Is my data secure?"
            a="Your resume data is encrypted and never shared with third parties. Payments are processed by Stripe with bank-level security."
          />
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-16 sm:mt-20 mb-8">
        <p className="text-[#78716c] text-sm">
          Questions? <Link to="/contact" className="text-[#f97316] font-medium hover:underline">Contact us</Link> or check our <Link to="/faq" className="text-[#f97316] font-medium hover:underline">FAQ</Link>.
        </p>
      </div>
    </div>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-[#e7e5e4] rounded-xl bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-[15px] font-semibold text-[#1c1917]">{q}</span>
        <svg
          className={`w-4 h-4 text-[#78716c] shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-4">
          <p className="text-[14px] text-[#78716c] leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  )
}
