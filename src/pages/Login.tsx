import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const API_BASE = import.meta.env.VITE_API_URL || ''

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const err = searchParams.get('error')
    const verified = searchParams.get('verified')
    if (err) {
      const raw = decodeURIComponent(err.replace(/\+/g, ' '))
      setError(raw)
      setSearchParams({}, { replace: true })
    } else if (verified === '1') {
      setError('')
      setSuccess('Your email is verified. You can sign in now.')
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-[420px] mx-auto px-4 sm:px-6 py-10 sm:py-20 min-h-[50vh]">
      <div className="surface-card p-5 sm:p-9 rounded-2xl">
        <h1 className="text-2xl font-bold text-cvmora-ink mb-2 tracking-tight">
          Sign in
        </h1>
        <p className="text-base text-cvmora-muted mb-7 leading-relaxed" style={{ lineHeight: 1.6 }}>
          Sign in to access your resumes and cover letters.
        </p>

        <div className="flex flex-col gap-3 mb-5">
          <a
            href={`${API_BASE}/api/auth/google`}
            className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl border border-[#e7e5e4] bg-white text-cvmora-ink font-medium hover:bg-[#fafafa] transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </a>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#e7e5e4]" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-cvmora-muted">or sign in with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {success && (
            <div className="p-4 rounded-xl bg-green-50 text-green-800 text-base font-medium border border-green-200">
              {success}
            </div>
          )}
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
              className="input-premium"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-base font-semibold text-cvmora-ink/85">Password</label>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-[var(--color-primary)] hover:opacity-80 transition-opacity"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-premium pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded text-cvmora-muted hover:text-cvmora-ink focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /><line x1="2" y1="2" x2="22" y2="22" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] disabled:opacity-50 shadow-[var(--shadow-button)] hover:shadow-[var(--shadow-button-hover)] transition-all duration-200"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="mt-7 text-base text-cvmora-muted">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-[var(--color-primary)] hover:opacity-80 transition-opacity">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
