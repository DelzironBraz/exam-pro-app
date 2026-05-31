'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSelectedGroup } from '@/hooks/use-selected-group'
import { Spinner } from '@/components/ui/spinner'

interface GroupPickerProps {
  className?: string
}

export function GroupPicker({ className }: GroupPickerProps) {
  const { groupId, setGroupId, options, loading } = useSelectedGroup()

  if (loading && options.length === 0) {
    return <Spinner className="h-5 w-5" />
  }

  if (options.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum grupo disponível. Crie um grupo (admin) ou plano de estudos.
      </p>
    )
  }

  return (
    <Select value={groupId ?? undefined} onValueChange={setGroupId}>
      <SelectTrigger className={className ?? 'w-[220px] bg-secondary border-border'}>
        <SelectValue placeholder="Selecione o grupo" />
      </SelectTrigger>
      <SelectContent>
        {options.map((g) => (
          <SelectItem key={g.id} value={g.id}>
            {g.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
