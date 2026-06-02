'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileQuestion,
  FileText,
  ClipboardList,
  Calendar,
  History,
  Settings,
  HelpCircle,
  LogOut,
  Zap,
  FileCode,
  MessageSquare,
  Users,
  FolderOpen,
  Tag,
  ChevronLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useAuth } from '@/hooks/use-auth'
import { usePermissions } from '@/hooks/use-permissions'
import type { AppView } from '@/lib/permissions/rules'
import {
  SIDEBAR_WIDTH_COLLAPSED,
  SIDEBAR_WIDTH_EXPANDED,
} from '@/hooks/use-sidebar-collapse'

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  view: AppView
}

const studentNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, view: 'student.dashboard' },
  { title: 'Questões', href: '/questoes', icon: FileQuestion, view: 'student.questions' },
  { title: 'Provas', href: '/provas', icon: FileText, view: 'student.exams' },
  { title: 'Simulados', href: '/simulados', icon: ClipboardList, view: 'student.simulations' },
  { title: 'Plano de Estudos', href: '/plano-estudos', icon: Calendar, view: 'student.studyPlans' },
  { title: 'Histórico', href: '/historico', icon: History, view: 'student.history' },
  { title: 'Configurações', href: '/configuracoes', icon: Settings, view: 'student.settings' },
]

const adminNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/admin', icon: LayoutDashboard, view: 'admin.dashboard' },
  { title: 'Grupos', href: '/admin/grupos', icon: FolderOpen, view: 'admin.groups' },
  { title: 'Tags', href: '/admin/tags', icon: Tag, view: 'admin.tags' },
  { title: 'Questões', href: '/admin/questoes', icon: FileQuestion, view: 'admin.questions' },
  { title: 'Provas', href: '/admin/provas', icon: FileText, view: 'admin.exams' },
  { title: 'Simulados', href: '/admin/simulados', icon: ClipboardList, view: 'admin.simulations' },
  { title: 'PDF Parser', href: '/admin/parser', icon: FileCode, view: 'admin.parser' },
  { title: 'Comentários AI', href: '/admin/comentarios-ai', icon: MessageSquare, view: 'admin.dashboard' },
  { title: 'Usuários', href: '/admin/usuarios', icon: Users, view: 'admin.users' },
  { title: 'Configurações', href: '/admin/configuracoes', icon: Settings, view: 'admin.settings' },
]

interface SidebarProps {
  variant?: 'student' | 'admin'
  collapsed: boolean
  onToggle: () => void
  ready?: boolean
}

function NavLink({
  item,
  isActive,
  collapsed,
}: {
  item: NavItem
  isActive: boolean
  collapsed: boolean
}) {
  const link = (
    <Link
      href={item.href}
      className={cn(
        'flex items-center rounded-lg text-sm font-medium transition-colors',
        collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5',
        isActive
          ? 'bg-sidebar-accent text-sidebar-foreground'
          : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
      )}
    >
      <item.icon className="h-5 w-5 shrink-0" />
      {!collapsed && <span>{item.title}</span>}
    </Link>
  )

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right">{item.title}</TooltipContent>
      </Tooltip>
    )
  }

  return link
}

export function Sidebar({
  variant = 'student',
  collapsed,
  onToggle,
  ready = true,
}: SidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { canView } = usePermissions()
  const allItems = variant === 'admin' ? adminNavItems : studentNavItems
  const navItems = allItems.filter((item) => canView(item.view))
  const userName = user?.name ?? 'Usuário'
  const userPlan = user?.role === 'admin' ? 'Administrador' : 'Estudante'

  const sidebarWidth = collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-sidebar transition-[width] duration-300 ease-in-out',
          !ready && 'w-64'
        )}
        style={ready ? { width: sidebarWidth } : undefined}
      >
        <div
          className={cn(
            'flex shrink-0 border-b border-border',
            collapsed
              ? 'h-16 flex-col items-center justify-center gap-1 px-1'
              : 'h-16 items-center gap-2 px-3'
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            OW
          </div>

          {!collapsed && (
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate font-semibold text-sidebar-foreground text-sm">
                Offensive World
              </span>
              {variant === 'admin' && (
                <span className="text-xs text-muted-foreground">Admin</span>
              )}
            </div>
          )}

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
            onClick={onToggle}
            aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
            aria-expanded={!collapsed}
          >
            <ChevronLeft
              className={cn(
                'h-5 w-5 transition-transform duration-300',
                collapsed && 'rotate-180'
              )}
            />
          </Button>
        </div>

        <nav
          className={cn(
            'flex-1 space-y-1 overflow-y-auto overflow-x-hidden',
            collapsed ? 'p-2' : 'p-4'
          )}
        >
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <NavLink
                key={item.href}
                item={item}
                isActive={isActive}
                collapsed={collapsed}
              />
            )
          })}
        </nav>

        <div className={cn(collapsed ? 'p-2' : 'p-4')}>
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" className="w-full bg-primary hover:bg-primary/90">
                  <Zap className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Upgrade Plan</TooltipContent>
            </Tooltip>
          ) : (
            <Button className="w-full gap-2 bg-primary hover:bg-primary/90" size="sm">
              <Zap className="h-4 w-4" />
              Upgrade Plan
            </Button>
          )}
        </div>

        <div className={cn('border-t border-border', collapsed ? 'p-2' : 'p-4')}>
          <div
            className={cn(
              'mb-4 flex items-center',
              collapsed ? 'justify-center' : 'gap-3'
            )}
          >
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/20 text-primary">
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="min-w-0 flex flex-col">
                <span className="truncate text-sm font-medium text-sidebar-foreground">
                  {userName}
                </span>
                <span className="text-xs text-muted-foreground">{userPlan}</span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            {collapsed ? (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/suporte"
                      className="flex justify-center rounded-lg p-2.5 text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
                    >
                      <HelpCircle className="h-4 w-4" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Suporte</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={logout}
                      className="flex w-full justify-center rounded-lg p-2.5 text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Sair</TooltipContent>
                </Tooltip>
              </>
            ) : (
              <>
                <Link
                  href="/suporte"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
                >
                  <HelpCircle className="h-4 w-4" />
                  Suporte
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </>
            )}
          </div>
        </div>
      </aside>
    </TooltipProvider>
  )
}
