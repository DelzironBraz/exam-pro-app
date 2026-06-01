'use client'

import { useMyExamAttempts } from '@/hooks/use-exams'
import { PageHeader } from '@/components/app/page-header'
import { PaginationControls } from '@/components/app/pagination-controls'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Badge } from '@/components/ui/badge'
import { CanView } from '@/components/auth/can-view'

export default function HistoricoPage() {
  const { items, loading, error, page, limit, pagination, setPage, setLimit } = useMyExamAttempts()
  const finished = items.filter((a) => a.finishedAt)

  return (
    <CanView view="student.history" fallback={<p>Sem permissão.</p>}>
      <div className="space-y-6">
        <PageHeader
          title="Histórico"
          description="Tentativas de provas finalizadas (paginado)."
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        {loading ? (
          <div className="flex justify-center p-12"><Spinner className="h-8 w-8" /></div>
        ) : (
          <>
            <div className="space-y-3">
              {finished.map((a) => (
                <Card key={a.id} className="border-border">
                  <CardContent className="p-4 flex flex-wrap justify-between gap-2">
                    <div>
                      <p className="font-medium">Prova {a.examId.slice(0, 8)}…</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(a.finishedAt!).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Badge variant="outline">
                        {a.totalCorrect}/{a.totalQuestions} acertos
                      </Badge>
                      {a.score > 0 && <Badge>Nota {a.score}</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {finished.length === 0 && (
                <p className="text-center text-muted-foreground py-8">Nenhuma tentativa finalizada.</p>
              )}
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
