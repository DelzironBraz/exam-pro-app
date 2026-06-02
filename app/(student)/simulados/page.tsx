'use client'

import Link from 'next/link'
import { Play } from 'lucide-react'
import { useSimulationsList } from '@/hooks/use-simulations'
import { useSelectedGroup } from '@/hooks/use-selected-group'
import { PageHeader } from '@/components/app/page-header'
import { GroupPicker } from '@/components/app/group-picker'
import { GroupsManageDrawer } from '@/components/groups/groups-manage-drawer'
import { PaginationControls } from '@/components/app/pagination-controls'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Badge } from '@/components/ui/badge'
import { CanView } from '@/components/auth/can-view'

export default function SimuladosPage() {
  const { groupId } = useSelectedGroup()
  const { items, loading, error, page, limit, pagination, setPage, setLimit } =
    useSimulationsList(groupId ?? undefined)

  return (
    <CanView view="student.simulations" fallback={<p>Sem permissão.</p>}>
      <div className="space-y-6">
        <PageHeader
          title="Simulados"
          description="Modo avaliação — sem gabarito imediato por questão."
          actions={
            <>
              <GroupsManageDrawer />
              <GroupPicker />
            </>
          }
        />
        {!groupId && (
          <p className="text-sm text-muted-foreground">Selecione um grupo para listar os simulados.</p>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {loading ? (
          <div className="flex justify-center p-12"><Spinner className="h-8 w-8" /></div>
        ) : (
          <>
            {items.length === 0 && groupId && (
              <p className="text-sm text-muted-foreground">Nenhum simulado encontrado neste grupo.</p>
            )}
            <div className="grid gap-4 md:grid-cols-2">
              {items.map((s) => (
                <Card key={s.id} className="border-border">
                  <CardContent className="p-5 space-y-3">
                    <h3 className="font-semibold text-lg">{s.title}</h3>
                    {s.description && <p className="text-sm text-muted-foreground">{s.description}</p>}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{s.timerMode}</Badge>
                      {s.durationMinutes != null && (
                        <Badge variant="outline">{s.durationMinutes} min</Badge>
                      )}
                      {(s.totalQuestions ?? 0) > 0 && (
                        <Badge variant="outline">{s.totalQuestions} questões</Badge>
                      )}
                    </div>
                    <Button asChild className="gap-2">
                      <Link href={`/simulado/${s.id}`}>
                        <Play className="h-4 w-4" /> Iniciar simulado
                      </Link>
                    </Button>
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
      </div>
    </CanView>
  )
}
