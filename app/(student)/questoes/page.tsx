'use client'

import { useCallback, useMemo, useState } from 'react'
import { useQuestionsList } from '@/hooks/use-questions'
import { useSelectedGroup } from '@/hooks/use-selected-group'
import { PageHeader } from '@/components/app/page-header'
import { GroupPicker } from '@/components/app/group-picker'
import { PaginationControls } from '@/components/app/pagination-controls'
import { QuestionPracticeCard } from '@/components/questions/question-practice-card'
import { Spinner } from '@/components/ui/spinner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { invalidateNamespaces } from '@/lib/api/invalidate'
import { CanView } from '@/components/auth/can-view'
import type { AnswerQuestionResponse } from '@/lib/api/types'

export default function QuestoesPage() {
  const { groupId } = useSelectedGroup()
  const [discipline, setDiscipline] = useState('')
  const [difficulty, setDifficulty] = useState<string>('all')

  const listParams = useMemo(() => {
    const p: Record<string, string> = {}
    if (groupId) p.groupId = groupId
    if (discipline) p.discipline = discipline
    if (difficulty !== 'all') p.difficulty = difficulty
    return p
  }, [groupId, discipline, difficulty])

  const {
    items,
    loading,
    error,
    refetch,
    page,
    limit,
    pagination,
    setPage,
    setLimit,
  } = useQuestionsList(listParams)

  const handleAnswered = useCallback(
    (_questionId: string, _result: AnswerQuestionResponse) => {
      invalidateNamespaces('questions')
      void refetch(true)
    },
    [refetch]
  )

  return (
    <CanView view="student.questions" fallback={<p>Sem permissão.</p>}>
      <div className="space-y-6">
        <PageHeader
          title="Banco de Questões"
          description={
            pagination
              ? `${pagination.total} questões · responda na listagem com feedback imediato`
              : 'Responda na listagem com feedback imediato'
          }
          actions={<GroupPicker />}
        />
        <div className="flex flex-wrap gap-4">
          <div className="space-y-2">
            <Label>Disciplina</Label>
            <Input
              className="w-48"
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value)}
              placeholder="Filtrar..."
            />
          </div>
          <div className="space-y-2">
            <Label>Dificuldade</Label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="easy">Fácil</SelectItem>
                <SelectItem value="medium">Médio</SelectItem>
                <SelectItem value="hard">Difícil</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {!groupId && (
          <p className="text-sm text-muted-foreground">Selecione um grupo para listar questões.</p>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {loading ? (
          <div className="flex justify-center p-12"><Spinner className="h-8 w-8" /></div>
        ) : (
          <>
            <div className="space-y-4 max-w-3xl">
              {items.map((q) => (
                <QuestionPracticeCard
                  key={q.id}
                  question={q}
                  onAnswered={handleAnswered}
                />
              ))}
              {items.length === 0 && groupId && (
                <p className="text-center text-muted-foreground py-8">Nenhuma questão encontrada.</p>
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
