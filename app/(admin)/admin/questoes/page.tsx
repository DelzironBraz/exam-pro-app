'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Plus, Trash2, Eye } from 'lucide-react'
import { useQuestionsList } from '@/hooks/use-questions'
import { useSelectedGroup } from '@/hooks/use-selected-group'
import { PageHeader } from '@/components/app/page-header'
import { GroupPicker } from '@/components/app/group-picker'
import { QuestionFormDrawer } from '@/components/forms/question-form-drawer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { questionsApi } from '@/lib/api/axios'
import { invalidateNamespaces } from '@/lib/api/invalidate'
import { DIFFICULTY_LABELS } from '@/lib/constants'
import { CanView } from '@/components/auth/can-view'
import type { QuestionDifficulty } from '@/lib/api/types'

export default function AdminQuestoesPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { groupId } = useSelectedGroup()
  const params = useMemo(() => (groupId ? { groupId } : {}), [groupId])
  const { data, loading, error, refetch } = useQuestionsList(params)
  const items = data?.items ?? []

  const handleDelete = async (id: string) => {
    if (!confirm('Remover questão?')) return
    await questionsApi.delete(id)
    invalidateNamespaces('questions')
    refetch(true)
  }

  return (
    <CanView view="admin.questions" fallback={<p>Sem permissão.</p>}>
      <div className="space-y-6">
        <PageHeader
          title="Banco de Questões"
          description="Crie e gerencie questões do grupo selecionado."
          actions={
            <>
              <GroupPicker />
              <Button onClick={() => setDrawerOpen(true)} className="gap-2" disabled={!groupId}>
                <Plus className="h-4 w-4" /> Nova questão
              </Button>
            </>
          }
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Card className="border-border">
          {loading ? (
            <div className="flex justify-center p-12"><Spinner className="h-8 w-8" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Disciplina</TableHead>
                  <TableHead>Enunciado</TableHead>
                  <TableHead>Dificuldade</TableHead>
                  <TableHead className="w-24" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell>{q.discipline ?? '—'}</TableCell>
                    <TableCell className="max-w-md truncate">{q.statement}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {DIFFICULTY_LABELS[q.difficulty as QuestionDifficulty]}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/questoes/${q.id}`}><Eye className="h-4 w-4" /></Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(q.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
        <QuestionFormDrawer open={drawerOpen} onOpenChange={setDrawerOpen} onSuccess={() => refetch(true)} />
      </div>
    </CanView>
  )
}
