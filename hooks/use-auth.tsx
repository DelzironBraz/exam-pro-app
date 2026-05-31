'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api/axios'
import { getApiErrorMessage, setStoredToken } from '@/lib/api/client'
import { invalidateCache } from '@/lib/api/cache'
import type { AuthUser, LoginResponse } from '@/lib/api/types'
import { getDefaultHomePath } from '@/lib/permissions/rules'

const USER_KEY = 'ow_user'

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string, redirectTo?: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function loadStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

function persistUser(user: AuthUser | null): void {
  if (typeof window === 'undefined') return
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
  else localStorage.removeItem(USER_KEY)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setUser(loadStoredUser())
    setIsLoading(false)
  }, [])

  const login = useCallback(
    async (email: string, password: string, redirectTo?: string) => {
      const { data } = await authApi.login({ email, password })
      const payload = data as LoginResponse
      setStoredToken(payload.accessToken)
      persistUser(payload.user)
      setUser(payload.user)
      invalidateCache()
      router.push(redirectTo ?? getDefaultHomePath(payload.user.role))
    },
    [router]
  )

  const logout = useCallback(() => {
    setStoredToken(null)
    persistUser(null)
    setUser(null)
    invalidateCache()
    router.push('/login')
  }, [router])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}

export function useAuthLogin() {
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = useCallback(
    async (email: string, password: string, redirectTo?: string) => {
      setLoading(true)
      setError(null)
      try {
        await login(email, password, redirectTo)
      } catch (err) {
        setError(getApiErrorMessage(err, 'Falha ao entrar'))
        throw err
      } finally {
        setLoading(false)
      }
    },
    [login]
  )

  return useMemo(() => ({ submit, loading, error }), [submit, loading, error])
}
