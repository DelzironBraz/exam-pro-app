'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { questionsApi, examsApi, simulationsApi } from '@/lib/api/axios'
import { getApiErrorMessage } from '@/lib/api/client'
import type { QuestionResponse } from '@/lib/api/types'
import {
  clearAttempt,
  loadAttempt,
  saveAttempt,
  type AttemptType,
  type StoredAttempt,
} from '@/lib/attempt-session'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { AttemptProgress } from '@/components/app/attempt-progress'
import { ExamTimer } from '@/components/app/exam-timer'
import { ArrowLeft, Check, Circle } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface AssessmentRunnerProps {
  type: AttemptType
  resourceId: string
  title: string
  questionIds: string[]
  durationMinutes?: number
  timerMode?: 'fixed' | 'free'
  backHref: string
  resultHref: string
}

export function AssessmentRunner({
  type,
  resourceId,
  title,
  questionIds,
  durationMinutes,
  timerMode,
  backHref,
  resultHref,
}: AssessmentRunnerProps) {
  const router = useRouter()
  const [attempt, setAttempt] = useState<StoredAttempt | null>(null)
  const [questions, setQuestions] = useState<Record<string, QuestionResponse>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [index, setIndex] = useState(0)
  const [selectedAlt, setSelectedAlt] = useState<string | null>(null)
  const [qStart, setQStart] = useState(Date.now())
  const [submitting, setSubmitting] = useState(false)
  const [finishing, setFinishing] = useState(false)

  const loadQuestions = useCallback(async (ids: string[]) => {
    const map: Record<string, QuestionResponse> = {}
    for (const qid of ids) {
      const { data } = await questionsApi.getById(qid)
      map[qid] = data as QuestionResponse
    }
    setQuestions(map)
  }, [])

  const init = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const stored = loadAttempt(type, resourceId)
      if (stored?.attemptId && stored.questionIds.length > 0) {
        setAttempt(stored)
        setIndex(stored.currentIndex)
        await loadQuestions(stored.questionIds)
        setLoading(false)
        return
      }

      const startApi = type === 'simulation' ? simulationsApi.start : examsApi.start
      const startRes = await startApi(resourceId)
      const startData = startRes.data as {
        attempt: { id: string; startedAt: string; totalQuestions: number }
        timer?: { mode: string; durationMinutes?: number }
        exam?: { durationMinutes?: number }
      }

      const newAttempt: StoredAttempt = {
        type,
        resourceId,
        attemptId: startData.attempt.id,
        startedAt: startData.attempt.startedAt,
        totalQuestions: startData.attempt.totalQuestions ?? questionIds.length,
        questionIds,
        answers: {},
        currentIndex: 0,
        timerMode: type === 'simulation' ? (timerMode ?? 'free') : 'fixed',
        durationMinutes:
          type === 'exam'
            ? durationMinutes
            : startData.timer?.durationMinutes ?? durationMinutes,
      }
      saveAttempt(newAttempt)
      setAttempt(newAttempt)
      await loadQuestions(questionIds)
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [type, resourceId, questionIds, durationMinutes, timerMode, loadQuestions])

  useEffect(() => {
    init()
  }, [init])

  const currentId = attempt?.questionIds[index]
  const current = currentId ? questions[currentId] : undefined
  const answeredCount = attempt ? Object.keys(attempt.answers).length : 0

  const persistAttempt = (next: StoredAttempt) => {
    saveAttempt(next)
    setAttempt(next)
  }

  const goToIndex = (i: number) => {
    if (!attempt) return
    const next = { ...attempt, currentIndex: i }
    persistAttempt(next)
    setIndex(i)
    const prev = attempt.answers[attempt.questionIds[i]]
    setSelectedAlt(prev?.alternativeId ?? null)
    setQStart(Date.now())
  }

  const submitCurrent = async () => {
    if (!attempt || !current || !selectedAlt) return
    setSubmitting(true)
    setError(null)
    try {
      const timeSpent = Math.round((Date.now() - qStart) / 1000)
      const answerApi =
        type === 'simulation' ? simulationsApi.submitAnswer : examsApi.submitAnswer
      const { data } = await answerApi(attempt.attemptId, {
        questionId: current.id,
        selectedAlternativeId: selectedAlt,
        timeSpentSeconds: timeSpent,
      })
      const isCorrect = (data as { isCorrect: boolean }).isCorrect
      const nextAnswers = {
        ...attempt.answers,
        [current.id]: { alternativeId: selectedAlt, timeSpentSeconds: timeSpent, isCorrect },
      }
      persistAttempt({ ...attempt, answers: nextAnswers, currentIndex: index })
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const finish = async () => {
    if (!attempt) return
    setFinishing(true)
    try {
      const correct = Object.values(attempt.answers).filter((a) => a.isCorrect).length
      const wrong = Object.values(attempt.answers).filter((a) => a.isCorrect === false).length
      const totalTime = Math.round((Date.now() - new Date(attempt.startedAt).getTime()) / 1000)
      const finishApi =
        type === 'simulation' ? simulationsApi.finishAttempt : examsApi.finishAttempt
      const { data } = await finishApi(attempt.attemptId, {
        totalCorrect: correct,
        totalWrong: wrong,
        totalTimeSeconds: totalTime,
      })
      clearAttempt(type, resourceId)
      sessionStorage.setItem(`ow_result_${attempt.attemptId}`, JSON.stringify(data))
      router.push(`${resultHref}?attemptId=${attempt.attemptId}`)
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setFinishing(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-12"><Spinner className="h-8 w-8" /></div>
  }

  if (error && !current) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" asChild>
          <Link href={backHref}><ArrowLeft className="h-4 w-4 mr-2" /> Voltar</Link>
        </Button>
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  if (!attempt || !current) {
    return <p className="text-muted-foreground">Nenhuma questão disponível.</p>
  }

  const showTimer =
    type === 'exam' ||
    (type === 'simulation' && attempt.timerMode === 'fixed' && attempt.durationMinutes)

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex flex-wrap justify-between gap-2 items-center">
        <Button variant="ghost" size="sm" asChild>
          <Link href={backHref}><ArrowLeft className="h-4 w-4 mr-1" /> Sair</Link>
        </Button>
        <h2 className="font-semibold text-sm truncate max-w-md">{title}</h2>
        {showTimer && attempt.durationMinutes && (
          <ExamTimer
            durationMinutes={attempt.durationMinutes}
            startedAt={attempt.startedAt}
            onExpire={() => void finish()}
          />
        )}
      </div>

      <AttemptProgress answered={answeredCount} total={attempt.totalQuestions} />

      <div className="flex flex-wrap gap-1">
        {attempt.questionIds.map((qid, i) => {
          const answered = !!attempt.answers[qid]
          const isCurrent = i === index
          return (
            <button
              key={qid}
              type="button"
              onClick={() => goToIndex(i)}
              className={`h-8 w-8 rounded text-xs font-medium border ${
                isCurrent
                  ? 'border-primary bg-primary text-primary-foreground'
                  : answered
                    ? 'border-[oklch(0.72_0.19_155)] bg-[oklch(0.72_0.19_155)]/20'
                    : 'border-border'
              }`}
            >
              {answered ? <Check className="h-3 w-3 mx-auto" /> : i + 1}
            </button>
          )
        })}
      </div>

      <Card className="border-border">
        <CardContent className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground">Questão {index + 1}</p>
          <p className="leading-relaxed">{current.statement}</p>
          {(current.alternatives ?? []).map((alt) => {
            const saved = attempt.answers[current.id]
            const isSelected = selectedAlt === alt.id
            const wasAnswered = saved?.alternativeId === alt.id
            return (
              <button
                key={alt.id}
                type="button"
                onClick={() => setSelectedAlt(alt.id)}
                className={`w-full text-left rounded-lg border p-3 flex gap-2 ${
                  isSelected || wasAnswered
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:bg-secondary/50'
                }`}
              >
                {isSelected && <Circle className="h-4 w-4 shrink-0 fill-primary text-primary" />}
                <span>
                  <span className="font-medium">{alt.label}.</span> {alt.content}
                </span>
              </button>
            )
          })}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={index === 0}
              onClick={() => goToIndex(index - 1)}
            >
              Anterior
            </Button>
            <Button
              className="flex-1"
              disabled={!selectedAlt || submitting}
              onClick={async () => {
                await submitCurrent()
                if (index < attempt.questionIds.length - 1) {
                  goToIndex(index + 1)
                }
              }}
            >
              {submitting ? <Spinner className="h-4 w-4" /> : 'Salvar resposta'}
            </Button>
            {index < attempt.questionIds.length - 1 && (
              <Button variant="outline" onClick={() => goToIndex(index + 1)}>
                Próxima
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="w-full" variant="default" disabled={finishing}>
            Finalizar {type === 'simulation' ? 'simulado' : 'prova'}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Finalizar avaliação?</AlertDialogTitle>
            <AlertDialogDescription>
              Você respondeu {answeredCount} de {attempt.totalQuestions} questões. Após finalizar,
              verá o resultado consolidado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar</AlertDialogCancel>
            <AlertDialogAction onClick={() => void finish()} disabled={finishing}>
              {finishing ? 'Finalizando…' : 'Confirmar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
