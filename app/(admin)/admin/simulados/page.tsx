'use client'

import { useState } from 'react'
import { Plus, Play, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useSimulationsList } from '@/hooks/use-simulations'
import { useSelectedGroup } from '@/hooks/use-selected-group'
import { PageHeader } from '@/components/app/page-header'
import { GroupPicker } from '@/components/app/group-picker'
import { GroupsManageDrawer } from '@/components/groups/groups-manage-drawer'
import { PaginationControls } from '@/components/app/pagination-controls'
import { SimulationFormDrawer } from '@/components/forms/simulation-form-drawer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Badge } from '@/components/ui/badge'
import { simulationsApi } from '@/lib/api/axios'
import { invalidateNamespaces } from '@/lib/api/invalidate'
import { CanView } from '@/components/auth/can-view'

export default function AdminSimuladosPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { groupId } = useSelectedGroup()
  const { items, loading, error, refetch, page, limit, pagination, setPage, setLimit } =
    useSimulationsList(groupId ?? undefined)

  const handleDelete = async (id: string) => {
    if (!confirm('Remover simulado?')) return
    await simulationsApi.delete(id)
    invalidateNamespaces('simulations')
    refetch(true)
  }

  return (
    <CanView view="admin.simulations" fallback={<p>Sem permissão.</p>}>
      <div className="space-y-6">
        <PageHeader
          title="Simulados"
          description="Listas cronometradas de questões."
          actions={
            <>
              <GroupsManageDrawer />
              <GroupPicker />
              <Button onClick={() => setDrawerOpen(true)} className="gap-2" disabled={!groupId}>
                <Plus className="h-4 w-4" /> Novo simulado
              </Button>
            </>
          }
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        {loading ? (
          <div className="flex justify-center p-12"><Spinner className="h-8 w-8" /></div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              {items.map((s) => (
                <Card key={s.id} className="border-border">
                  <CardContent className="p-5 flex flex-col gap-3">
                    <h3 className="font-semibold">{s.title}</h3>
                    {s.description && <p className="text-sm text-muted-foreground">{s.description}</p>}
                    <div className="flex gap-2">
                      <Badge variant="secondary">{s.timerMode}</Badge>
                      {s.durationMinutes && <Badge variant="outline">{s.durationMinutes} min</Badge>}
                      <Badge variant="outline">{s.questionIds?.length ?? 0} questões</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" asChild>
                        <Link href={`/simulado/${s.id}`}><Play className="h-4 w-4 mr-1" /> Iniciar</Link>
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(s.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {pagination && (
              <PaginationControls
                page={page}
                limit={limit}
                total={pagination.total}
                totalPages={pagination.totalPages}
                onPageChange={setPage}
                onLimitChange={setLimit}
              />
            )}
          </>
        )}
        <SimulationFormDrawer open={drawerOpen} onOpenChange={setDrawerOpen} onSuccess={() => refetch(true)} />
      </div>
    </CanView>
  )
}
