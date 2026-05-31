'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { useQuestionsList } from '@/hooks/use-questions'
import { useSelectedGroup } from '@/hooks/use-selected-group'
import { PageHeader } from '@/components/app/page-header'
import { GroupPicker } from '@/components/app/group-picker'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DIFFICULTY_LABELS } from '@/lib/constants'
import { CanView } from '@/components/auth/can-view'
import type { QuestionDifficulty } from '@/lib/api/types'

export default function QuestoesPage() {
  const { groupId } = useSelectedGroup()
  const [discipline, setDiscipline] = useState('')
  const [difficulty, setDifficulty] = useState<string>('all')

  const params = useMemo(() => {
    const p: Record<string, string> = {}
    if (groupId) p.groupId = groupId
    if (discipline) p.discipline = discipline
    if (difficulty !== 'all') p.difficulty = difficulty
    return p
  }, [groupId, discipline, difficulty])

  const { data, loading, error } = useQuestionsList(params)
  const items = data?.items ?? []

  return (
    <CanView view="student.questions" fallback={<p>Sem permissão.</p>}>
      <div className="space-y-6">
        <PageHeader
          title="Questões"
          description={`${data?.total ?? 0} questões disponíveis`}
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
          <div className="grid gap-3">
            {items.map((q) => (
              <Link key={q.id} href={`/questoes/${q.id}`}>
                <Card className="border-border hover:bg-secondary/30 transition-colors">
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex gap-2 mb-1">
                        {q.discipline && <Badge variant="outline">{q.discipline}</Badge>}
                        <Badge variant="secondary">
                          {DIFFICULTY_LABELS[q.difficulty as QuestionDifficulty]}
                        </Badge>
                      </div>
                      <p className="text-sm line-clamp-2">{q.statement}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
            ))}
            {items.length === 0 && groupId && (
              <p className="text-center text-muted-foreground py-8">Nenhuma questão encontrada.</p>
            )}
          </div>
        )}
      </div>
    </CanView>
  )
}
