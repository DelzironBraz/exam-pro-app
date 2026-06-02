'use client'

import { useState } from 'react'
import { Plus, Play, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useExamsList } from '@/hooks/use-exams'
import { useSelectedGroup } from '@/hooks/use-selected-group'
import { PageHeader } from '@/components/app/page-header'
import { GroupPicker } from '@/components/app/group-picker'
import { GroupsManageDrawer } from '@/components/groups/groups-manage-drawer'
import { PaginationControls } from '@/components/app/pagination-controls'
import { ExamFormDrawer } from '@/components/forms/exam-form-drawer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Badge } from '@/components/ui/badge'
import { examsApi } from '@/lib/api/axios'
import { invalidateNamespaces } from '@/lib/api/invalidate'
import { CanView } from '@/components/auth/can-view'

export default function AdminProvasPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { groupId } = useSelectedGroup()
  const { items, loading, error, refetch, page, limit, pagination, setPage, setLimit } =
    useExamsList(groupId ?? undefined)

  const handleDelete = async (id: string) => {
    if (!confirm('Remover prova?')) return
    await examsApi.delete(id)
    invalidateNamespaces('exams')
    refetch(true)
  }

  return (
    <CanView view="admin.exams" fallback={<p>Sem permissão.</p>}>
      <div className="space-y-6">
        <PageHeader
          title="Provas"
          description="Provas completas com questões vinculadas."
          actions={
            <>
              <GroupsManageDrawer />
              <GroupPicker />
              <Button onClick={() => setDrawerOpen(true)} className="gap-2" disabled={!groupId}>
                <Plus className="h-4 w-4" /> Nova prova
              </Button>
            </>
          }
        />
        {!groupId && <p className="text-sm text-muted-foreground">Selecione um grupo.</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {loading ? (
          <div className="flex justify-center p-12"><Spinner className="h-8 w-8" /></div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              {items.map((exam) => (
                <Card key={exam.id} className="border-border">
                  <CardContent className="p-5 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{exam.title}</h3>
                      <Badge variant="outline">{exam.year}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {exam.institution} · {exam.organization}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {exam.totalQuestions ?? 0} questões · {exam.durationMinutes} min
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/provas/${exam.id}`}><Play className="h-4 w-4 mr-1" /> Ver</Link>
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(exam.id)}>
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
        <ExamFormDrawer open={drawerOpen} onOpenChange={setDrawerOpen} onSuccess={() => refetch(true)} />
      </div>
    </CanView>
  )
}
