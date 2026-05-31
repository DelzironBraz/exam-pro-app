import { AuthGuard } from '@/components/auth/auth-guard'
import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'
import { SelectedGroupProvider } from '@/hooks/use-selected-group'

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <SelectedGroupProvider>
      <div className="min-h-screen bg-background">
        <Sidebar variant="student" />
        <div className="pl-64">
          <Topbar />
          <main className="p-6">{children}</main>
        </div>
      </div>
      </SelectedGroupProvider>
    </AuthGuard>
  )
}
