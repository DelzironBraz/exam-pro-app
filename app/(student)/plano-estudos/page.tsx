'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useStudyPlansList } from '@/hooks/use-study-plans'
import { PageHeader } from '@/components/app/page-header'
import { GroupPicker } from '@/components/app/group-picker'
import { StudyPlanFormDrawer } from '@/components/forms/study-plan-form-drawer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Progress } from '@/components/ui/progress'
import { CanView } from '@/components/auth/can-view'
import { PaginationControls } from '@/components/app/pagination-controls'
import Link from 'next/link'

export default function PlanoEstudosPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { items: plans, loading, error, refetch, page, limit, pagination, setPage, setLimit } =
    useStudyPlansList()

  return (
    <CanView view="student.studyPlans" fallback={<p>Sem permissão.</p>}>
      <div className="space-y-6">
        <PageHeader
          title="Plano de Estudos"
          description="Organize suas metas por grupo."
          actions={
            <>
              <GroupPicker />
              <Button onClick={() => setDrawerOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" /> Novo plano
              </Button>
            </>
          }
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        {loading ? (
          <div className="flex justify-center p-12"><Spinner className="h-8 w-8" /></div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2">
              {plans.map((plan) => (
                <Card key={plan.id} className="border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">{plan.title}</CardTitle>
                    {plan.progress && (
                      <div className="space-y-1">
                        <Progress value={plan.progress.completionPercent} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {plan.progress.completedItems}/{plan.progress.totalItems} itens ·{' '}
                          {plan.progress.completionPercent}%
                        </p>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="link" className="h-auto p-0" asChild>
                      <Link href={`/plano-estudos/${plan.id}`}>Ver detalhes e itens</Link>
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
        <StudyPlanFormDrawer open={drawerOpen} onOpenChange={setDrawerOpen} onSuccess={() => refetch(true)} />
      </div>
    </CanView>
  )
}
