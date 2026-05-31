'use client'

import { useState } from 'react'
import { tagsApi } from '@/lib/api/axios'
import { getApiErrorMessage } from '@/lib/api/client'
import { invalidateNamespaces } from '@/lib/api/invalidate'
import { FormDrawer } from '@/components/app/form-drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface TagFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function TagFormDrawer({ open, onOpenChange, onSuccess }: TagFormDrawerProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      await tagsApi.create({ name: name.trim().toLowerCase() })
      invalidateNamespaces('tags')
      setName('')
      onOpenChange(false)
      onSuccess?.()
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <FormDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Nova tag"
      onSubmit={handleSubmit}
      submitLabel="Criar tag"
      loading={loading}
    >
      <div className="space-y-4">
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="space-y-2">
          <Label>Nome</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
      </div>
    </FormDrawer>
  )
}
