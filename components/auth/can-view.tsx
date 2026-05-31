'use client'

import type { ReactNode } from 'react'
import { useCanView } from '@/hooks/use-can-view'
import type { AppView } from '@/lib/permissions/rules'

interface CanViewProps {
  view: AppView
  children: ReactNode
  fallback?: ReactNode
}

/**
 * Renderiza children apenas se o cargo do usuário permitir a view.
 */
export function CanView({ view, children, fallback = null }: CanViewProps) {
  const { allowed } = useCanView(view)
  if (!allowed) return <>{fallback}</>
  return <>{children}</>
}
