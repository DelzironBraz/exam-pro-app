import { AuthGuard } from '@/components/auth/auth-guard'
import { AppShell } from '@/components/layout/app-shell'
import { SelectedGroupProvider } from '@/hooks/use-selected-group'

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <SelectedGroupProvider>
        <AppShell variant="student">{children}</AppShell>
      </SelectedGroupProvider>
    </AuthGuard>
  )
}
