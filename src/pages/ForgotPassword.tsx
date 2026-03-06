import { useState } from 'react'
import { Link } from 'react-router-dom'

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const url = API_BASE ? `${API_BASE}/api/auth/forgot-password` : '/api/auth/forgot-password'
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      let data: { error?: string; message?: string } = {}
      const text = await res.text()
      if (text) {
        try {
          data = JSON.parse(text)
        } catch {
          data = { error: res.statusText || 'Invalid response' }
        }
      }
      if (!res.ok) {
        const msg = data.error || (res.status === 404
          ? 'Password reset isn’t available. If you’re on localhost, start the backend (e.g. npm run server).'
          : res.statusText || 'Something went wrong')
        setError(msg)
        return
      }
      setSent(true)
    } catch (err) {
      const message = err instanceof TypeError && err.message === 'Failed to fetch'
        ? 'Cannot reach the server. Make sure the app backend is running (e.g. npm run server).'
        : 'Something went wrong. Try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-[420px] mx-auto px-4 sm:px-6 py-10 sm:py-20 min-h-[50vh]">
      <div className="surface-card p-5 sm:p-9 rounded-2xl">
        <h1 className="text-2xl font-bold text-cvmora-ink mb-2 tracking-tight">
          Forgot password
        </h1>
        <p className="text-base text-cvmora-muted mb-7 leading-relaxed" style={{ lineHeight: 1.6 }}>
          Enter your email and we’ll send you a link to reset your password.
        </p>

        {sent ? (
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-green-50 text-green-800 text-base font-medium border border-green-200">
              If an account exists with that email, we’ve sent a password reset link. Check your inbox and spam folder.
            </div>
            <Link
              to="/login"
              className="btn-primary w-full py-3.5 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] inline-flex items-center justify-center"
            >
              Back to Sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 rounded-xl bg-red-50 text-red-700 text-base font-medium border border-red-100">
                {error}
              </div>
            )}
            <div>
              <label className="block text-base font-semibold text-cvmora-ink/85 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="input-premium"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] disabled:opacity-50 shadow-[var(--shadow-button)] hover:shadow-[var(--shadow-button-hover)] transition-all duration-200"
            >
              {loading ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        )}

        <p className="mt-7 text-base text-cvmora-muted">
          Remember your password?{' '}
          <Link to="/login" className="font-semibold text-[var(--color-primary)] hover:opacity-80 transition-opacity">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
