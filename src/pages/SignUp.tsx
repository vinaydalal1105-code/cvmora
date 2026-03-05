import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(email, password, name || undefined)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-[420px] mx-auto px-4 sm:px-6 py-10 sm:py-20 min-h-[50vh]">
      <div className="surface-card p-5 sm:p-9 rounded-2xl">
        <h1 className="text-2xl font-bold text-cvmora-ink mb-2 tracking-tight">
          Create account
        </h1>
        <p className="text-[0.9375rem] text-cvmora-muted mb-7 leading-relaxed">
          Sign up to save your resumes and cover letters.
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 text-red-700 text-[0.9375rem] font-medium border border-red-100">
              {error}
            </div>
          )}
          <div>
            <label className="block text-base font-semibold text-cvmora-ink/85 mb-2">Name (optional)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="input-premium"
            />
          </div>
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
              minLength={6}
              className="input-premium"
            />
            <p className="text-[0.8125rem] text-cvmora-muted mt-1.5">At least 6 characters</p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] disabled:opacity-50 shadow-[var(--shadow-button)] hover:shadow-[var(--shadow-button-hover)] transition-all duration-200"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className="mt-7 text-[0.9375rem] text-cvmora-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[var(--color-primary)] hover:opacity-80 transition-opacity">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
