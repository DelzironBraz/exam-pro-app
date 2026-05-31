'use client'

import Link from 'next/link'
import { Play } from 'lucide-react'
import { useExamsList } from '@/hooks/use-exams'
import { useSelectedGroup } from '@/hooks/use-selected-group'
import { PageHeader } from '@/components/app/page-header'
import { GroupPicker } from '@/components/app/group-picker'
import { GroupsManageDrawer } from '@/components/groups/groups-manage-drawer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Badge } from '@/components/ui/badge'
import { CanView } from '@/components/auth/can-view'

export default function ProvasPage() {
  const { groupId } = useSelectedGroup()
  const { data: exams, loading, error } = useExamsList(groupId ?? undefined)

  return (
    <CanView view="student.exams" fallback={<p>Sem permissão.</p>}>
      <div className="space-y-6">
        <PageHeader
          title="Provas"
          description="Provas completas para treino cronometrado."
          actions={
            <>
              <GroupsManageDrawer />
              <GroupPicker />
            </>
          }
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        {loading ? (
          <div className="flex justify-center p-12"><Spinner className="h-8 w-8" /></div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {(exams ?? []).map((exam) => (
              <Card key={exam.id} className="border-border">
                <CardContent className="p-5 space-y-3">
                  <h3 className="font-semibold text-lg">{exam.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {exam.institution} · {exam.organization} · {exam.year}
                  </p>
                  <div className="flex gap-2">
                    <Badge variant="outline">{exam.durationMinutes} min</Badge>
                    <Badge variant="secondary">
                      {exam.totalQuestions ?? exam.questionIds?.length ?? 0} questões
                    </Badge>
                  </div>
                  <Button asChild className="gap-2">
                    <Link href={`/provas/${exam.id}`}>
                      <Play className="h-4 w-4" /> Iniciar prova
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
            {groupId && (exams ?? []).length === 0 && (
              <p className="text-muted-foreground col-span-2 text-center py-8">
                Nenhuma prova neste grupo.
              </p>
            )}
          </div>
        )}
      </div>
    </CanView>
  )
}
