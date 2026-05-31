'use client'

import { useEffect, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { usePermissions } from '@/hooks/use-permissions'
import { ROUTE_TO_VIEW, getDefaultHomePath } from '@/lib/permissions/rules'
import { Spinner } from '@/components/ui/spinner'

interface AuthGuardProps {
  children: ReactNode
  requireAdmin?: boolean
}

export function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const { canView } = usePermissions()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
      return
    }
    if (requireAdmin && user?.role !== 'admin') {
      router.replace(getDefaultHomePath(user?.role ?? null))
      return
    }
    const view = ROUTE_TO_VIEW[pathname]
    if (view && !canView(view)) {
      router.replace(getDefaultHomePath(user?.role ?? null))
    }
  }, [isLoading, isAuthenticated, requireAdmin, user, pathname, router, canView])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (!isAuthenticated) return null

  return <>{children}</>
}
