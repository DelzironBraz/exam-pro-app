import { AuthGuard } from '@/components/auth/auth-guard'
import { AppShell } from '@/components/layout/app-shell'
import { SelectedGroupProvider } from '@/hooks/use-selected-group'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requireAdmin>
      <SelectedGroupProvider>
        <AppShell variant="admin">{children}</AppShell>
      </SelectedGroupProvider>
    </AuthGuard>
  )
}
