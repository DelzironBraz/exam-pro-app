'use client'

import { use, useState, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react'
import { useQuestionDetail } from '@/hooks/use-questions'
import { questionsApi } from '@/lib/api/axios'
import { getApiErrorMessage } from '@/lib/api/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { DIFFICULTY_LABELS } from '@/lib/constants'
import type { AnswerQuestionResponse, QuestionDifficulty } from '@/lib/api/types'

export default function QuestaoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: question, loading, error } = useQuestionDetail(id)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [result, setResult] = useState<AnswerQuestionResponse | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [startedAt] = useState(Date.now())

  const handleAnswer = useCallback(async () => {
    if (!selectedId) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const { data } = await questionsApi.answer(id, {
        selectedAlternativeId: selectedId,
        timeSpentSeconds: Math.round((Date.now() - startedAt) / 1000),
      })
      setResult(data as AnswerQuestionResponse)
    } catch (err) {
      setSubmitError(getApiErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }, [id, selectedId, startedAt])

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (error || !question) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" asChild><Link href="/questoes"><ArrowLeft className="h-4 w-4 mr-2" /> Voltar</Link></Button>
        <p className="text-destructive">{error ?? 'Questão não encontrada'}</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" asChild>
        <Link href="/questoes"><ArrowLeft className="h-4 w-4 mr-2" /> Voltar à lista</Link>
      </Button>
      <div className="flex gap-2">
        {question.discipline && <Badge variant="outline">{question.discipline}</Badge>}
        <Badge variant="secondary">
          {DIFFICULTY_LABELS[question.difficulty as QuestionDifficulty]}
        </Badge>
      </div>
      <Card className="border-border">
        <CardContent className="p-6 space-y-6">
          <p className="text-base leading-relaxed">{question.statement}</p>
          <div className="space-y-2">
            {(question.alternatives ?? []).map((alt) => {
              const isSelected = selectedId === alt.id
              const isCorrectAlt = result && alt.id === result.correctAlternativeId
              const isWrong = result && isSelected && !result.isCorrect
              return (
                <button
                  key={alt.id}
                  type="button"
                  disabled={!!result}
                  onClick={() => setSelectedId(alt.id)}
                  className={`w-full text-left rounded-lg border p-4 transition-colors ${
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
          {submitError && <p className="text-sm text-destructive">{submitError}</p>}
          {!result ? (
            <Button onClick={handleAnswer} disabled={!selectedId || submitting} className="w-full">
              {submitting ? <Spinner className="h-4 w-4" /> : 'Confirmar resposta'}
            </Button>
          ) : (
            <div className="rounded-lg border border-border p-4 space-y-2">
              <div className="flex items-center gap-2 font-medium">
                {result.isCorrect ? (
                  <><CheckCircle className="h-5 w-5 text-[oklch(0.72_0.19_155)]" /> Resposta correta</>
                ) : (
                  <><XCircle className="h-5 w-5 text-destructive" /> Resposta incorreta</>
                )}
              </div>
              {result.explanation && (
                <p className="text-sm text-muted-foreground">{result.explanation}</p>
              )}
              <Button asChild variant="outline" className="mt-2">
                <Link href="/questoes">Próxima questão</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
