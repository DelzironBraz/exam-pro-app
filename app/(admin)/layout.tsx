import { AuthGuard } from '@/components/auth/auth-guard'
import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'
import { SelectedGroupProvider } from '@/hooks/use-selected-group'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requireAdmin>
      <SelectedGroupProvider>
      <div className="min-h-screen bg-background">
        <Sidebar variant="admin" />
        <div className="pl-64">
          <Topbar />
          <main className="p-6">{children}</main>
        </div>
      </div>
      </SelectedGroupProvider>
    </AuthGuard>
  )
}
