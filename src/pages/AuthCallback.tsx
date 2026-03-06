import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function AuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { completeOAuthLogin } = useAuth()
  const [error, setError] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      setError('Missing login token')
      return
    }
    completeOAuthLogin(token)
      .then(() => navigate('/dashboard', { replace: true }))
      .catch(() => setError('Sign-in failed. Please try again.'))
  }, [searchParams, completeOAuthLogin, navigate])

  if (error) {
    return (
      <div className="max-w-[420px] mx-auto px-4 py-20 text-center">
        <p className="text-red-600 font-medium mb-4">{error}</p>
        <a href="/login" className="text-[var(--color-primary)] font-semibold hover:opacity-80">
          Back to Sign in
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-[420px] mx-auto px-4 py-20 text-center">
      <p className="text-cvmora-muted font-medium">Signing you in…</p>
    </div>
  )
}
