'use client'

import { CheckCircle, XCircle } from 'lucide-react'
import type { AssessmentQuestionListItem } from '@/lib/api/types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface ViewAnswerData {
  isCorrect: boolean
  selectedAlternativeId: string
  correctAlternativeId?: string
  explanation?: string | null
}

interface ViewAnswerPanelProps {
  item: AssessmentQuestionListItem
  data: ViewAnswerData
}

export function ViewAnswerPanel({ item, data }: ViewAnswerPanelProps) {
  const correctId =
    data.correctAlternativeId ??
    (data.isCorrect ? data.selectedAlternativeId : undefined)

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium">
        {data.isCorrect ? (
          <>
            <CheckCircle className="h-5 w-5 text-[oklch(0.55_0.17_155)]" />
            Resposta correta
          </>
        ) : (
          <>
            <XCircle className="h-5 w-5 text-destructive" />
            Resposta incorreta
          </>
        )}
      </div>

      <div className="space-y-2">
        {item.alternatives.map((alt) => {
          const isSelected = alt.id === data.selectedAlternativeId
          const isCorrectAlt = correctId != null && alt.id === correctId
          const isWrong = isSelected && !data.isCorrect

          return (
            <div
              key={alt.id}
              className={cn(
                'rounded-lg border p-3 text-sm',
                isCorrectAlt && 'border-[oklch(0.55_0.17_155)] bg-[oklch(0.55_0.17_155)]/10',
                isWrong && 'border-destructive bg-destructive/10',
                isSelected && !isCorrectAlt && !isWrong && 'border-primary bg-primary/10'
              )}
            >
              <div className="flex items-start gap-2">
                <span className="font-medium shrink-0">{alt.label}.</span>
                <span className="flex-1">{alt.content}</span>
                {isSelected && (
                  <Badge variant="outline" className="shrink-0 text-xs">
                    Sua escolha
                  </Badge>
                )}
                {isCorrectAlt && !isSelected && (
                  <Badge variant="secondary" className="shrink-0 text-xs">
                    Gabarito
                  </Badge>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {data.explanation && (
        <p className="text-sm text-muted-foreground border-t border-border pt-3">
          {data.explanation}
        </p>
      )}

      {!data.isCorrect && !correctId && (
        <p className="text-xs text-muted-foreground">
          O gabarito completo estará disponível ao finalizar a avaliação.
        </p>
      )}
    </div>
  )
}
