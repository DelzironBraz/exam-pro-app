'use client'

import { useState } from 'react'
import { simulationsApi } from '@/lib/api/axios'
import { getApiErrorMessage } from '@/lib/api/client'
import { invalidateNamespaces } from '@/lib/api/invalidate'
import { FormDrawer } from '@/components/app/form-drawer'
import { QuestionSelector } from '@/components/app/question-selector'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSelectedGroup } from '@/hooks/use-selected-group'

interface SimulationFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function SimulationFormDrawer({
  open,
  onOpenChange,
  onSuccess,
}: SimulationFormDrawerProps) {
  const { groupId } = useSelectedGroup()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [timerMode, setTimerMode] = useState('fixed')
  const [durationMinutes, setDurationMinutes] = useState('90')
  const [questionIds, setQuestionIds] = useState<string[]>([])

  const handleSubmit = async () => {
    if (!groupId) {
      setError('Selecione um grupo.')
      return
    }
    if (questionIds.length === 0) {
      setError('Selecione ao menos uma questão.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await simulationsApi.create({
        groupId,
        title,
        description: description || undefined,
        timerMode,
        durationMinutes: timerMode === 'fixed' ? Number(durationMinutes) : undefined,
        questionIds,
      })
      invalidateNamespaces('simulations')
      onOpenChange(false)
      onSuccess?.()
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <FormDrawer open={open} onOpenChange={onOpenChange} title="Novo simulado" onSubmit={handleSubmit} loading={loading} wide>
      <div className="space-y-4">
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="space-y-2">
          <Label>Título</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Descrição</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Cronômetro</Label>
          <Select value={timerMode} onValueChange={setTimerMode}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="fixed">Fixo</SelectItem>
              <SelectItem value="free">Livre</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {timerMode === 'fixed' && (
          <div className="space-y-2">
            <Label>Duração (min)</Label>
            <Input type="number" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} />
          </div>
        )}
        <div className="space-y-2">
          <Label>Questões</Label>
          <QuestionSelector selectedIds={questionIds} onChange={setQuestionIds} />
        </div>
      </div>
    </FormDrawer>
  )
}
