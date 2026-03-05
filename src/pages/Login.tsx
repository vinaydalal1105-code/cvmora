import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

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
              className="input-premium"
            />
          </div>
          <div>
            <label className="block text-base font-semibold text-cvmora-ink/85 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-premium"
            />
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
