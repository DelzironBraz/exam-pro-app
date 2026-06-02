'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { getStoredToken } from '@/lib/api/client'
import { useAuth } from '@/hooks/use-auth'
import { getDefaultHomePath } from '@/lib/permissions/rules'
import { Spinner } from '@/components/ui/spinner'

interface GuestGuardProps {
  children: ReactNode
}

/** Impede acesso à login (e rotas públicas de convidado) quando já autenticado. */
export function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const hasStoredSession =
    typeof window !== 'undefined' && !!getStoredToken()

  useEffect(() => {
    if (isLoading) return
    if (isAuthenticated || hasStoredSession) {
      router.replace(getDefaultHomePath(user?.role ?? null))
    }
  }, [isLoading, isAuthenticated, hasStoredSession, user, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (isAuthenticated || hasStoredSession) return null

  return <>{children}</>
}
