'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import { useSubmitQuestionAnswer } from '@/hooks/use-questions'
import { getApiErrorMessage } from '@/lib/api/client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { DIFFICULTY_LABELS } from '@/lib/constants'
import type {
  AnswerQuestionResponse,
  QuestionDifficulty,
  QuestionListItem,
} from '@/lib/api/types'

interface QuestionPracticeCardProps {
  question: QuestionListItem
  onAnswered?: (questionId: string, result: AnswerQuestionResponse) => void
}

export function QuestionPracticeCard({ question, onAnswered }: QuestionPracticeCardProps) {
  const { submit } = useSubmitQuestionAnswer()
  const startedAt = useRef(Date.now())

  const review = question.completed && question.lastAnswer

  const [selectedId, setSelectedId] = useState<string | null>(
    review ? question.lastAnswer!.selectedAlternativeId : null
  )
  const [result, setResult] = useState<AnswerQuestionResponse | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const feedback = result ?? (review
    ? {
        isCorrect: question.lastAnswer!.isCorrect,
        correctAlternativeId: question.lastAnswer!.isCorrect
          ? question.lastAnswer!.selectedAlternativeId
          : '',
        explanation: null,
      }
    : null)

  const locked = !!feedback

  const alternatives = useMemo(
    () => question.alternatives ?? [],
    [question.alternatives]
  )

  const handleAnswer = useCallback(async () => {
    if (!selectedId || locked) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const data = await submit(question.id, {
        selectedAlternativeId: selectedId,
        timeSpentSeconds: Math.max(
          1,
          Math.round((Date.now() - startedAt.current) / 1000)
        ),
      })
      setResult(data)
      onAnswered?.(question.id, data)
    } catch (err) {
      setSubmitError(getApiErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }, [locked, onAnswered, question.id, selectedId, submit])

  return (
    <Card className="border-border">
      <CardContent className="p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {question.discipline && <Badge variant="outline">{question.discipline}</Badge>}
          {question.topic && <Badge variant="outline">{question.topic}</Badge>}
          <Badge variant="secondary">
            {DIFFICULTY_LABELS[question.difficulty as QuestionDifficulty]}
          </Badge>
          {review && !result && (
            <Badge variant={question.lastAnswer!.isCorrect ? 'default' : 'destructive'}>
              {question.lastAnswer!.isCorrect ? 'Respondida · acerto' : 'Respondida · erro'}
            </Badge>
          )}
        </div>

        <p className="text-sm leading-relaxed whitespace-pre-wrap">{question.statement}</p>

        {alternatives.length > 0 ? (
          <div className="space-y-2">
            {alternatives.map((alt) => {
              const isSelected = selectedId === alt.id
              const correctId = feedback?.correctAlternativeId
              const isCorrectAlt = !!correctId && alt.id === correctId
              const isWrong = !!feedback && isSelected && !feedback.isCorrect

              return (
                <button
                  key={alt.id}
                  type="button"
                  disabled={locked}
                  onClick={() => setSelectedId(alt.id)}
                  className={`w-full text-left rounded-lg border p-3 text-sm transition-colors ${
                    isCorrectAlt
                      ? 'border-[oklch(0.72_0.19_155)] bg-[oklch(0.72_0.19_155)]/10'
                      : isWrong
                        ? 'border-destructive bg-destructive/10'
                        : isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:bg-secondary/50'
                  }`}
                >
                  <span className="font-medium mr-2">{alt.label}.</span>
                  {alt.content}
                </button>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Alternativas indisponíveis.</p>
        )}

        {submitError && <p className="text-sm text-destructive">{submitError}</p>}

        {!feedback ? (
          <Button
            onClick={handleAnswer}
            disabled={!selectedId || submitting || alternatives.length === 0}
            className="w-full sm:w-auto"
          >
            {submitting ? <Spinner className="h-4 w-4" /> : 'Confirmar resposta'}
          </Button>
        ) : (
          <div className="rounded-lg border border-border p-4 space-y-2">
            <div className="flex items-center gap-2 font-medium text-sm">
              {feedback.isCorrect ? (
                <>
                  <CheckCircle className="h-5 w-5 text-[oklch(0.72_0.19_155)]" />
                  Resposta correta
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-destructive" />
                  Resposta incorreta
                </>
              )}
            </div>
            {feedback.explanation && (
              <p className="text-sm text-muted-foreground">{feedback.explanation}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
