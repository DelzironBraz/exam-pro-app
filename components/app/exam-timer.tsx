'use client'

import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'

interface ExamTimerProps {
  durationMinutes: number
  startedAt: string
  onExpire?: () => void
}

export function ExamTimer({ durationMinutes, startedAt, onExpire }: ExamTimerProps) {
  const totalSec = durationMinutes * 60
  const [remaining, setRemaining] = useState(() => {
    const elapsed = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000)
    return Math.max(0, totalSec - elapsed)
  })

  useEffect(() => {
    const t = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(t)
          onExpire?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [onExpire])

  const m = Math.floor(remaining / 60)
  const s = remaining % 60
  const urgent = remaining < 300

  return (
    <div
      className={`flex items-center gap-2 text-sm font-mono ${urgent ? 'text-destructive' : 'text-muted-foreground'}`}
    >
      <Clock className="h-4 w-4" />
      {m}:{s.toString().padStart(2, '0')}
    </div>
  )
}
