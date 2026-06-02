'use client'

import { ThemeToggle } from '@/components/layout/theme-toggle'
import { useAuth } from '@/hooks/use-auth'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export function Topbar() {
  const { user } = useAuth()
  const initials = (user?.name ?? 'U').charAt(0).toUpperCase()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-end gap-3 border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <ThemeToggle />
      <div className="flex items-center gap-3 pl-2 border-l border-border">
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium leading-none">{user?.name ?? 'Usuário'}</p>
          <p className="text-xs text-muted-foreground capitalize">{user?.role ?? '—'}</p>
        </div>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary/15 text-primary text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
