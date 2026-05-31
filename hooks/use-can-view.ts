'use client'

import { useMemo } from 'react'
import { usePermissions } from '@/hooks/use-permissions'
import { ROUTE_TO_VIEW, type AppView } from '@/lib/permissions/rules'

export function useCanView(view: AppView) {
  const { canView, isAuthenticated } = usePermissions()

  return useMemo(
    () => ({
      allowed: canView(view),
      isAuthenticated,
    }),
    [canView, view, isAuthenticated]
  )
}

export function useCanViewRoute(pathname: string) {
  const view = useMemo(() => {
    const exact = ROUTE_TO_VIEW[pathname]
    if (exact) return exact
    if (pathname.startsWith('/admin')) return 'admin.dashboard' as AppView
    return 'student.dashboard' as AppView
  }, [pathname])

  return useCanView(view)
}
