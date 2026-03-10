import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { api } from '../api/client'

interface User {
  id: number
  email: string
  name: string
  created_at?: string
}

interface AuthContextValue {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name?: string, confirmPassword?: string) => Promise<{ needVerification?: boolean; email?: string } | void>
  completeOAuthLogin: (token: string) => Promise<void>
  updateProfile: (updates: { name?: string }) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

const TOKEN_KEY = 'cvmora_token'
const USER_KEY = 'cvmora_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const s = localStorage.getItem(USER_KEY)
      return s ? JSON.parse(s) : null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [loading, setLoading] = useState(true)

  const persist = useCallback((t: string | null, u: User | null) => {
    if (t) localStorage.setItem(TOKEN_KEY, t)
    else localStorage.removeItem(TOKEN_KEY)
    if (u) localStorage.setItem(USER_KEY, JSON.stringify(u))
    else localStorage.removeItem(USER_KEY)
    setToken(t)
    setUser(u)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { user: u, token: t } = await api<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    persist(t, u)
  }, [persist])

  const register = useCallback(
    async (email: string, password: string, name?: string, confirmPassword?: string) => {
      const res = await api<{ user?: User; token?: string; needVerification?: boolean; email?: string }>('/auth/register', {
        method: 'POST',
        body: { email, password, name, confirmPassword },
      })
      if (res.needVerification && res.email) {
        return { needVerification: true, email: res.email }
      }
      if (res.user && res.token) {
        persist(res.token, res.user)
      }
    },
    [persist]
  )

  const logout = useCallback(() => {
    persist(null, null)
  }, [persist])

  const completeOAuthLogin = useCallback(
    async (token: string) => {
      const API = '/api'
      const res = await fetch(API + '/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to load user')
      const user = (await res.json()) as User
      persist(token, user)
    },
    [persist]
  )

  const updateProfile = useCallback(
    async (updates: { name?: string }) => {
      if (!token) return
      const u = await api<User>('/auth/me', { method: 'PATCH', body: updates })
      persist(token, u)
    },
    [token, persist]
  )

  useEffect(() => {
    setLoading(false)
  }, [])

  const value: AuthContextValue = {
    user,
    token,
    loading,
    login,
    register,
    completeOAuthLogin,
    updateProfile,
    logout,
    isAuthenticated: !!token && !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
