'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useUsersList } from '@/hooks/use-users'
import { PageHeader } from '@/components/app/page-header'
import { PaginationControls } from '@/components/app/pagination-controls'
import { UserFormDrawer } from '@/components/forms/user-form-drawer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CanView } from '@/components/auth/can-view'

export default function AdminUsuariosPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { items, loading, error, refetch, page, limit, pagination, setPage, setLimit } = useUsersList()

  return (
    <CanView view="admin.users" fallback={<p>Sem permissão.</p>}>
      <div className="space-y-6">
        <PageHeader
          title="Usuários"
          description="Gerencie contas e cargos."
          actions={
            <Button onClick={() => setDrawerOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Novo usuário
            </Button>
          }
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Card className="border-border">
          {loading ? (
            <div className="flex justify-center p-12"><Spinner className="h-8 w-8" /></div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Cargo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell><Badge variant="secondary">{u.role}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {pagination && (
                <div className="p-4">
                  <PaginationControls
                    page={page}
                    limit={limit}
                    total={pagination.total}
                    totalPages={pagination.totalPages}
                    onPageChange={setPage}
                    onLimitChange={setLimit}
                  />
                </div>
              )}
            </>
          )}
        </Card>
        <UserFormDrawer open={drawerOpen} onOpenChange={setDrawerOpen} onSuccess={() => refetch(true)} />
      </div>
    </CanView>
  )
}
