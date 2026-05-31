'use client'

import { useState } from 'react'
import { studyPlansApi } from '@/lib/api/axios'
import { getApiErrorMessage } from '@/lib/api/client'
import { invalidateNamespaces } from '@/lib/api/invalidate'
import { FormDrawer } from '@/components/app/form-drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSelectedGroup } from '@/hooks/use-selected-group'

interface StudyPlanFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function StudyPlanFormDrawer({ open, onOpenChange, onSuccess }: StudyPlanFormDrawerProps) {
  const { groupId } = useSelectedGroup()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState('')

  const handleSubmit = async () => {
    if (!groupId) {
      setError('Selecione um grupo.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await studyPlansApi.create({ groupId, title })
      invalidateNamespaces('study-plans')
      onOpenChange(false)
      onSuccess?.()
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <FormDrawer open={open} onOpenChange={onOpenChange} title="Novo plano de estudos" onSubmit={handleSubmit} loading={loading}>
      <div className="space-y-4">
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="space-y-2">
          <Label>Título</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
      </div>
    </FormDrawer>
  )
}
