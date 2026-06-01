'use client'

import { useCallback, useMemo, useState } from 'react'
import { questionsApi } from '@/lib/api/axios'
import { usePaginatedQuery } from '@/hooks/use-paginated-query'
import { useSelectedGroup } from '@/hooks/use-selected-group'
import type { Paginated, QuestionListItem } from '@/lib/api/types'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { PaginationControls } from '@/components/app/pagination-controls'
import { Badge } from '@/components/ui/badge'
import { DIFFICULTY_LABELS } from '@/lib/constants'

interface QuestionSelectorProps {
  selectedIds: string[]
  onChange: (ids: string[]) => void
}

export function QuestionSelector({ selectedIds, onChange }: QuestionSelectorProps) {
  const { groupId } = useSelectedGroup()
  const [discipline, setDiscipline] = useState('')

  const baseParams = useMemo(
    () => ({
      groupId: groupId ?? '',
      ...(discipline ? { discipline } : {}),
    }),
    [groupId, discipline]
  )

  const fetcher = useCallback(
    async (params: Record<string, unknown> & { page: number; limit: number }) => {
      if (!params.groupId) {
        return { items: [], total: 0, page: 1, limit: 20, totalPages: 0 } satisfies Paginated<QuestionListItem>
      }
      const { data } = await questionsApi.list(params)
      return data as Paginated<QuestionListItem>
    },
    []
  )

  const { items, loading, error, page, limit, pagination, setPage, setLimit } = usePaginatedQuery(
    fetcher,
    { namespace: 'questions:selector', baseParams, enabled: !!groupId }
  )

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id))
    } else {
      onChange([...selectedIds, id])
    }
  }

  if (!groupId) {
    return <p className="text-sm text-muted-foreground">Selecione um grupo para listar questões.</p>
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <Label className="text-xs text-muted-foreground">
          {selectedIds.length} selecionada(s)
        </Label>
        <Input
          className="h-8 max-w-[180px]"
          placeholder="Filtrar disciplina"
          value={discipline}
          onChange={(e) => setDiscipline(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {loading ? (
        <div className="flex justify-center py-6"><Spinner className="h-6 w-6" /></div>
      ) : (
        <>
          <div className="max-h-64 overflow-y-auto space-y-2 rounded-lg border border-border p-2">
            {items.map((q) => (
              <label
                key={q.id}
                className="flex gap-3 items-start rounded-md p-2 hover:bg-secondary/50 cursor-pointer"
              >
                <Checkbox
                  checked={selectedIds.includes(q.id)}
                  onCheckedChange={() => toggle(q.id)}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm line-clamp-2">{q.statement}</p>
                  <div className="mt-1 flex gap-1">
                    {q.discipline && <Badge variant="outline" className="text-xs">{q.discipline}</Badge>}
                    <Badge variant="secondary" className="text-xs">
                      {DIFFICULTY_LABELS[q.difficulty]}
                    </Badge>
                  </div>
                </div>
              </label>
            ))}
            {items.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-4">Nenhuma questão.</p>
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
  )
}
