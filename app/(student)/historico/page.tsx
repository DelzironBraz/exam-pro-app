'use client'

import { useMyExamAttempts } from '@/hooks/use-exams'
import { PageHeader } from '@/components/app/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Badge } from '@/components/ui/badge'
import { CanView } from '@/components/auth/can-view'

export default function HistoricoPage() {
  const { data: attempts, loading, error } = useMyExamAttempts()

  return (
    <CanView view="student.history" fallback={<p>Sem permissão.</p>}>
      <div className="space-y-6">
        <PageHeader
          title="Histórico"
          description="Suas tentativas de provas finalizadas."
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        {loading ? (
          <div className="flex justify-center p-12"><Spinner className="h-8 w-8" /></div>
        ) : (
          <div className="space-y-3">
            {(attempts ?? [])
              .filter((a) => a.finishedAt)
              .map((a) => (
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
            {(attempts ?? []).filter((a) => a.finishedAt).length === 0 && (
              <p className="text-center text-muted-foreground py-8">Nenhuma tentativa finalizada.</p>
            )}
          </div>
        )}
      </div>
    </CanView>
  )
}
