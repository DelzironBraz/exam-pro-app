'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import type { GroupResponse } from '@/lib/api/types'
import { useGroupsList } from '@/hooks/use-groups'
import { PageHeader } from '@/components/app/page-header'
import { PaginationControls } from '@/components/app/pagination-controls'
import { GroupFormDrawer } from '@/components/forms/group-form-drawer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { groupsApi } from '@/lib/api/axios'
import { invalidateNamespaces } from '@/lib/api/invalidate'
import { CanView } from '@/components/auth/can-view'

export default function AdminGruposPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState<GroupResponse | null>(null)
  const { items, loading, error, refetch, page, limit, pagination, setPage, setLimit } =
    useGroupsList()

  const handleDelete = async (id: string) => {
    if (!confirm('Remover este grupo?')) return
    await groupsApi.delete(id)
    invalidateNamespaces('groups')
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('ow-groups-updated'))
    refetch(true)
  }

  return (
    <CanView view="admin.groups" fallback={<p>Sem permissão.</p>}>
      <div className="space-y-6">
        <PageHeader
          title="Grupos"
          description="Organize o conteúdo por concurso, tecnologia ou tema."
          actions={
            <Button onClick={() => { setEditing(null); setDrawerOpen(true) }} className="gap-2">
              <Plus className="h-4 w-4" /> Novo grupo
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
                    <TableHead>Tipo</TableHead>
                    <TableHead>Visibilidade</TableHead>
                    <TableHead className="w-24" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((g) => (
                    <TableRow key={g.id}>
                      <TableCell className="font-medium">{g.name}</TableCell>
                      <TableCell><Badge variant="secondary">{g.type}</Badge></TableCell>
                      <TableCell>{g.visibility}</TableCell>
                      <TableCell className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => { setEditing(g); setDrawerOpen(true) }}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(g.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
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
        <GroupFormDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          group={editing}
          onSuccess={() => { setEditing(null); refetch(true) }}
        />
      </div>
    </CanView>
  )
}
