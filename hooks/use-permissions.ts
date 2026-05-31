'use client'

import { useCallback, useMemo } from 'react'
import { useAuth } from '@/hooks/use-auth'
import {
  canAccessView,
  canPerformAction,
  isAdminRole,
  type AppView,
  type PermissionAction,
} from '@/lib/permissions/rules'

export function usePermissions() {
  const { user, isAuthenticated } = useAuth()
  const role = user?.role ?? null

  const can = useCallback(
    (action: PermissionAction) => canPerformAction(role, action),
    [role]
  )

  const canView = useCallback(
    (view: AppView) => canAccessView(role, view),
    [role]
  )

  const isAdmin = useMemo(() => isAdminRole(role), [role])
  const isStudent = useMemo(() => role === 'student', [role])
  const isInstructor = useMemo(() => role === 'instructor', [role])

  return useMemo(
    () => ({
      user,
      role,
      isAuthenticated,
      isAdmin,
      isStudent,
      isInstructor,
      can,
      canView,
    }),
    [user, role, isAuthenticated, isAdmin, isStudent, isInstructor, can, canView]
  )
}
