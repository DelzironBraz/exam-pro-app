'use client'

import type { ReactNode } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'
import { useSidebarCollapse } from '@/hooks/use-sidebar-collapse'
import { cn } from '@/lib/utils'

interface AppShellProps {
  variant: 'student' | 'admin'
  children: ReactNode
}

export function AppShell({ variant, children }: AppShellProps) {
  const { collapsed, toggle, width, ready } = useSidebarCollapse()

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        variant={variant}
        collapsed={collapsed}
        onToggle={toggle}
        ready={ready}
      />
      <div
        className={cn('transition-[padding] duration-300 ease-in-out', !ready && 'pl-64')}
        style={ready ? { paddingLeft: width } : undefined}
      >
        <Topbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
