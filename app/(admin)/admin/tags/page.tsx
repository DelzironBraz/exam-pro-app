'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useTagsList } from '@/hooks/use-tags'
import { PageHeader } from '@/components/app/page-header'
import { PaginationControls } from '@/components/app/pagination-controls'
import { TagFormDrawer } from '@/components/forms/tag-form-drawer'
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
import { tagsApi } from '@/lib/api/axios'
import { invalidateNamespaces } from '@/lib/api/invalidate'
import { CanView } from '@/components/auth/can-view'

export default function AdminTagsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { items, loading, error, refetch, page, limit, pagination, setPage, setLimit } = useTagsList()

  const handleDelete = async (id: string) => {
    if (!confirm('Remover tag?')) return
    await tagsApi.delete(id)
    invalidateNamespaces('tags')
    refetch(true)
  }

  return (
    <CanView view="admin.tags" fallback={<p>Sem permissão.</p>}>
      <div className="space-y-6">
        <PageHeader
          title="Tags"
          description="Etiquetas para questões e grupos."
          actions={
            <Button onClick={() => setDrawerOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Nova tag
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
                    <TableHead className="w-20" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.name}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)}>
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
        <TagFormDrawer open={drawerOpen} onOpenChange={setDrawerOpen} onSuccess={() => refetch(true)} />
      </div>
    </CanView>
  )
}
