"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/use-auth"
import { usePermissions } from "@/hooks/use-permissions"
import type { AppView } from "@/lib/permissions/rules"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  view: AppView
}

const studentNavItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, view: "student.dashboard" },
  { title: "Questões", href: "/questoes", icon: FileQuestion, view: "student.questions" },
  { title: "Provas", href: "/provas", icon: FileText, view: "student.exams" },
  { title: "Simulados", href: "/simulados", icon: ClipboardList, view: "student.simulations" },
  { title: "Plano de Estudos", href: "/plano-estudos", icon: Calendar, view: "student.studyPlans" },
  { title: "Histórico", href: "/historico", icon: History, view: "student.history" },
  { title: "Configurações", href: "/configuracoes", icon: Settings, view: "student.settings" },
]

const adminNavItems: NavItem[] = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard, view: "admin.dashboard" },
  { title: "Questões", href: "/admin/questoes", icon: FileQuestion, view: "admin.questions" },
  { title: "Provas", href: "/admin/provas", icon: FileText, view: "admin.exams" },
  { title: "Simulados", href: "/admin/simulados", icon: ClipboardList, view: "admin.simulations" },
  { title: "PDF Parser", href: "/admin/parser", icon: FileCode, view: "admin.parser" },
  { title: "Comentários AI", href: "/admin/comentarios-ai", icon: MessageSquare, view: "admin.dashboard" },
  { title: "Usuários", href: "/admin/usuarios", icon: Users, view: "admin.users" },
  { title: "Configurações", href: "/admin/configuracoes", icon: Settings, view: "admin.settings" },
]

interface SidebarProps {
  variant?: "student" | "admin"
}

export function Sidebar({ variant = "student" }: SidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { canView } = usePermissions()
  const allItems = variant === "admin" ? adminNavItems : studentNavItems
  const navItems = allItems.filter((item) => canView(item.view))
  const userName = user?.name ?? "Usuário"
  const userPlan = user?.role === "admin" ? "Administrador" : "Estudante"

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-sidebar">
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
          OW
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-sidebar-foreground">Offensive World</span>
          {variant === "admin" && (
            <span className="text-xs text-muted-foreground">Admin</span>
          )}
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      <div className="p-4">
        <Button className="w-full gap-2 bg-primary hover:bg-primary/90" size="sm">
          <Zap className="h-4 w-4" />
          Upgrade Plan
        </Button>
      </div>

      <div className="border-t border-border p-4">
        <div className="mb-4 flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/20 text-primary">
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-sidebar-foreground">{userName}</span>
            <span className="text-xs text-muted-foreground">{userPlan}</span>
          </div>
        </div>

        <div className="space-y-1">
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
        </div>
      </div>
    </aside>
  )
}
