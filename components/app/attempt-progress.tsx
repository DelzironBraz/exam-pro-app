'use client'

import { Progress } from '@/components/ui/progress'

interface AttemptProgressProps {
  answered: number
  total: number
}

export function AttemptProgress({ answered, total }: AttemptProgressProps) {
  const percent = total > 0 ? Math.round((answered / total) * 100) : 0
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Progresso</span>
        <span>
          {answered}/{total} ({percent}%)
        </span>
      </div>
      <Progress value={percent} className="h-2" />
    </div>
  )
}
