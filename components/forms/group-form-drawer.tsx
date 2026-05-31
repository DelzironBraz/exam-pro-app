'use client'

import { useEffect, useState } from 'react'
import { groupsApi } from '@/lib/api/axios'
import { getApiErrorMessage } from '@/lib/api/client'
import { invalidateNamespaces } from '@/lib/api/invalidate'
import type { GroupResponse } from '@/lib/api/types'
import { FormDrawer } from '@/components/app/form-drawer'
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
import { GROUP_TYPES, GROUP_VISIBILITIES } from '@/lib/constants'

interface GroupFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  group?: GroupResponse | null
}

export function GroupFormDrawer({
  open,
  onOpenChange,
  onSuccess,
  group,
}: GroupFormDrawerProps) {
  const isEdit = !!group
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('contest')
  const [visibility, setVisibility] = useState('public')
  const [tags, setTags] = useState('')

  useEffect(() => {
    if (!open) return
    if (group) {
      setName(group.name)
      setDescription(group.description ?? '')
      setType(group.type)
      setVisibility(group.visibility)
      setTags(group.tags?.join(', ') ?? '')
    } else {
      setName('')
      setDescription('')
      setType('contest')
      setVisibility('public')
      setTags('')
    }
    setError(null)
  }, [open, group])

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      if (isEdit && group) {
        await groupsApi.update(group.id, {
          name,
          description: description || undefined,
          visibility,
        })
      } else {
        await groupsApi.create({
          name,
          description: description || undefined,
          type,
          visibility,
          tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
        })
      }
      invalidateNamespaces('groups')
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
      title={isEdit ? 'Editar grupo' : 'Novo grupo'}
      description="Organize questões, provas e simulados por grupo."
      onSubmit={handleSubmit}
      submitLabel={isEdit ? 'Salvar alterações' : 'Criar grupo'}
      loading={loading}
    >
      <div className="space-y-4">
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="space-y-2">
          <Label>Nome</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Descrição</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        {!isEdit && (
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {GROUP_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="space-y-2">
          <Label>Visibilidade</Label>
          <Select value={visibility} onValueChange={setVisibility}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {GROUP_VISIBILITIES.map((v) => (
                <SelectItem key={v.value} value={v.value}>{v.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {!isEdit && (
          <div className="space-y-2">
            <Label>Tags (vírgula)</Label>
            <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="enem, concurso" />
          </div>
        )}
      </div>
    </FormDrawer>
  )
}
