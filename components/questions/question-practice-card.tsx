'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import { CheckCircle, Eye, EyeOff, XCircle } from 'lucide-react'
import { useSubmitQuestionAnswer } from '@/hooks/use-questions'
import { getApiErrorMessage } from '@/lib/api/client'
import { sanitizeStatement, sanitizeAnswer } from '@/lib/sanitize-statement'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
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

  const alternatives = useMemo(
    () => question.alternatives ?? question.answers ?? [],
    [question.alternatives, question.answers]
  )

  const isDiscursive = question.type === 'discursive' || alternatives.length === 0

  const [selectedId, setSelectedId] = useState<string | null>(
    review ? question.lastAnswer!.selectedAlternativeId : null
  )
  const [textAnswer, setTextAnswer] = useState('')
  const [result, setResult] = useState<AnswerQuestionResponse | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const correctAlternativeId =
    result?.correctAlternativeId ||
    (review ? question.lastAnswer!.correctAlternativeId : undefined) ||
    alternatives.find((alt) => alt.isCorrect)?.id ||
    (review && question.lastAnswer!.isCorrect
      ? question.lastAnswer!.selectedAlternativeId
      : undefined)

  const referenceAnswer =
    sanitizeAnswer(result?.referenceAnswer ?? question.referenceAnswer) || null
  const explanation =
    sanitizeAnswer(result?.explanation ?? question.explanation) || null

  const feedback = result ?? (review
    ? {
        isCorrect: question.lastAnswer!.isCorrect,
        correctAlternativeId: correctAlternativeId ?? '',
        referenceAnswer,
        explanation,
      }
    : null)

  const locked = !!feedback
  const showAnswer = revealed || !!feedback
  const hasModelAnswer = !!referenceAnswer || !!explanation
  const similarityPercent =
    typeof result?.similarityScore === 'number'
      ? Math.round(result.similarityScore * 100)
      : null

  const handleAnswer = useCallback(async () => {
    if (locked) return
    const trimmedText = textAnswer.trim()
    if (isDiscursive ? !trimmedText : !selectedId) return

    const timeSpentSeconds = Math.max(
      1,
      Math.round((Date.now() - startedAt.current) / 1000)
    )

    const payload = isDiscursive
      ? { textAnswer: trimmedText, timeSpentSeconds }
      : { selectedAlternativeId: selectedId!, timeSpentSeconds }

    setSubmitting(true)
    setSubmitError(null)
    try {
      const data = await submit(question.id, payload)
      setResult(data)
      onAnswered?.(question.id, data)
    } catch (err) {
      setSubmitError(getApiErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }, [isDiscursive, locked, onAnswered, question.id, selectedId, submit, textAnswer])

  return (
    <Card className="border-border">
      <CardContent className="p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {question.discipline && <Badge variant="outline">{question.discipline}</Badge>}
          {question.topic && <Badge variant="outline">{question.topic}</Badge>}
          <Badge variant="secondary">
            {DIFFICULTY_LABELS[question.difficulty as QuestionDifficulty]}
          </Badge>
          {isDiscursive && <Badge variant="outline">Discursiva</Badge>}
          {review && !result && (
            <Badge variant={question.lastAnswer!.isCorrect ? 'default' : 'destructive'}>
              {question.lastAnswer!.isCorrect ? 'Respondida · acerto' : 'Respondida · erro'}
            </Badge>
          )}
        </div>

        <p className="text-sm leading-relaxed whitespace-pre-wrap">{sanitizeStatement(question.statement)}</p>

        {isDiscursive ? (
          <Textarea
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            disabled={locked}
            rows={5}
            placeholder="Digite sua resposta..."
            className="resize-y"
          />
        ) : (
          <div className="space-y-2">
            {alternatives.map((alt) => {
              const isSelected = selectedId === alt.id
              const isCorrectAlt =
                showAnswer && !!correctAlternativeId && alt.id === correctAlternativeId
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
        )}

        {submitError && <p className="text-sm text-destructive">{submitError}</p>}

        {!feedback && (
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleAnswer}
              disabled={
                submitting || (isDiscursive ? !textAnswer.trim() : !selectedId)
              }
              className="w-full sm:w-auto"
            >
              {submitting ? <Spinner className="h-4 w-4" /> : 'Enviar resposta'}
            </Button>
            {isDiscursive && hasModelAnswer && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setRevealed((v) => !v)}
                className="w-full sm:w-auto"
              >
                {revealed ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Ocultar resposta
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Ver resposta-modelo
                  </>
                )}
              </Button>
            )}
          </div>
        )}

        {feedback && (
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
              {similarityPercent !== null && (
                <Badge variant="secondary">Similaridade: {similarityPercent}%</Badge>
              )}
            </div>
            {isDiscursive && referenceAnswer && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Resposta-modelo
                </p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{referenceAnswer}</p>
              </div>
            )}
            {explanation && (
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{explanation}</p>
            )}
          </div>
        )}

        {revealed && !feedback && (
          <div className="rounded-lg border border-[oklch(0.72_0.19_155)]/40 bg-[oklch(0.72_0.19_155)]/5 p-4 space-y-2">
            <div className="flex items-center gap-2 font-medium text-sm">
              <CheckCircle className="h-5 w-5 text-[oklch(0.72_0.19_155)]" />
              Resposta-modelo
            </div>
            {referenceAnswer && (
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{referenceAnswer}</p>
            )}
            {explanation && (
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{explanation}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
