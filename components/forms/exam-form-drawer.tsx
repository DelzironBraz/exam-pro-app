'use client'

import { useState } from 'react'
import { examsApi } from '@/lib/api/axios'
import { getApiErrorMessage } from '@/lib/api/client'
import { invalidateNamespaces } from '@/lib/api/invalidate'
import { FormDrawer } from '@/components/app/form-drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSelectedGroup } from '@/hooks/use-selected-group'

interface ExamFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function ExamFormDrawer({ open, onOpenChange, onSuccess }: ExamFormDrawerProps) {
  const { groupId } = useSelectedGroup()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [institution, setInstitution] = useState('')
  const [organization, setOrganization] = useState('')
  const [year, setYear] = useState(String(new Date().getFullYear()))
  const [roleName, setRoleName] = useState('')
  const [durationMinutes, setDurationMinutes] = useState('180')
  const [questionIds, setQuestionIds] = useState('')

  const handleSubmit = async () => {
    if (!groupId) {
      setError('Selecione um grupo.')
      return
    }
    const ids = questionIds.split(/[\s,]+/).filter(Boolean)
    if (ids.length === 0) {
      setError('Informe ao menos um ID de questão (UUID).')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await examsApi.create({
        groupId,
        title,
        institution,
        organization,
        year: Number(year),
        roleName,
        durationMinutes: Number(durationMinutes),
        questionIds: ids,
      })
      invalidateNamespaces('exams')
      onOpenChange(false)
      onSuccess?.()
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <FormDrawer open={open} onOpenChange={onOpenChange} title="Nova prova" onSubmit={handleSubmit} loading={loading} wide>
      <div className="space-y-4">
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="space-y-2">
          <Label>Título</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Instituição</Label>
            <Input value={institution} onChange={(e) => setInstitution(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Banca</Label>
            <Input value={organization} onChange={(e) => setOrganization(e.target.value)} required />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Ano</Label>
            <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Cargo</Label>
            <Input value={roleName} onChange={(e) => setRoleName(e.target.value)} required />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Duração (min)</Label>
          <Input type="number" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>IDs das questões (vírgula ou linha)</Label>
          <Input value={questionIds} onChange={(e) => setQuestionIds(e.target.value)} placeholder="uuid, uuid..." />
        </div>
      </div>
    </FormDrawer>
  )
}
