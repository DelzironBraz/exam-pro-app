'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { examsApi, simulationsApi } from '@/lib/api/axios'
import { getApiErrorMessage } from '@/lib/api/client'
import type {
  AssessmentQuestionListItem,
  AttemptAnswerResponse,
  ExamAttemptDetailResponse,
  SimulationAttemptDetailResponse,
} from '@/lib/api/types'
import {
  clearAttempt,
  loadAttempt,
  saveAttempt,
  type AttemptType,
  type StoredAttempt,
} from '@/lib/attempt-session'
import {
  createExamQuestionsFetcher,
  createSimulationQuestionsFetcher,
  fetchAllAssessmentQuestions,
  mergeAssessmentItemsWithAnswers,
} from '@/lib/assessment-questions'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { AttemptProgress } from '@/components/app/attempt-progress'
import { ExamTimer } from '@/components/app/exam-timer'
import { ViewAnswerPanel, type ViewAnswerData } from '@/components/assessment/view-answer-panel'
import { ArrowLeft, Check, Circle, Eye, EyeOff } from 'lucide-react'
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
  questionIds?: string[]
  durationMinutes?: number
  timerMode?: 'fixed' | 'free'
  backHref: string
  resultHref: string
}

export function AssessmentRunner({
  type,
  resourceId,
  title,
  questionIds: questionIdsProp,
  durationMinutes,
  timerMode,
  backHref,
  resultHref,
}: AssessmentRunnerProps) {
  const router = useRouter()
  const [attempt, setAttempt] = useState<StoredAttempt | null>(null)
  const [items, setItems] = useState<AssessmentQuestionListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [index, setIndex] = useState(0)
  const [selectedAlt, setSelectedAlt] = useState<string | null>(null)
  const [qStart, setQStart] = useState(Date.now())
  const [submitting, setSubmitting] = useState(false)
  const [finishing, setFinishing] = useState(false)
  const [viewAnswer, setViewAnswer] = useState<ViewAnswerData | null>(null)
  const [loadingView, setLoadingView] = useState(false)
  const [showViewPanel, setShowViewPanel] = useState(false)

  const listQuestions = useMemo(
    () =>
      type === 'simulation'
        ? createSimulationQuestionsFetcher(resourceId)
        : createExamQuestionsFetcher(resourceId),
    [type, resourceId]
  )

  const loadItems = useCallback(
    async (attemptId: string, answers: StoredAttempt['answers']) => {
      const loaded = await fetchAllAssessmentQuestions(listQuestions, attemptId)
      setItems(mergeAssessmentItemsWithAnswers(loaded, answers))
      return loaded
    },
    [listQuestions]
  )

  const init = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const stored = loadAttempt(type, resourceId)
      if (stored?.attemptId) {
        const loaded = await loadItems(stored.attemptId, stored.answers)
        const questionIds = loaded.map((i) => i.question.id)
        const next: StoredAttempt = {
          ...stored,
          questionIds: questionIds.length ? questionIds : stored.questionIds,
          totalQuestions: stored.totalQuestions || loaded.length,
        }
        saveAttempt(next)
        setAttempt(next)
        setIndex(next.currentIndex)
        const qid = next.questionIds[next.currentIndex]
        setSelectedAlt(next.answers[qid]?.alternativeId ?? null)
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

      const attemptId = startData.attempt.id
      const loaded = await loadItems(attemptId, {})
      const questionIds = loaded.map((i) => i.question.id)

      const newAttempt: StoredAttempt = {
        type,
        resourceId,
        attemptId,
        startedAt: startData.attempt.startedAt,
        totalQuestions:
          startData.attempt.totalQuestions || questionIds.length || questionIdsProp?.length || 0,
        questionIds: questionIds.length ? questionIds : (questionIdsProp ?? []),
        answers: {},
        currentIndex: 0,
        timerMode: type === 'simulation' ? (timerMode ?? 'free') : 'fixed',
        durationMinutes:
          type === 'exam'
            ? durationMinutes ?? startData.exam?.durationMinutes
            : startData.timer?.durationMinutes ?? durationMinutes,
      }
      saveAttempt(newAttempt)
      setAttempt(newAttempt)
      setIndex(0)
      setSelectedAlt(null)
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [type, resourceId, durationMinutes, timerMode, questionIdsProp, loadItems])

  useEffect(() => {
    void init()
  }, [init])

  const current = items[index]
  const answeredCount = attempt ? Object.keys(attempt.answers).length : 0
  const currentAnswered = current
    ? !!(attempt?.answers[current.question.id] ?? current.answered)
    : false

  const persistAttempt = (next: StoredAttempt) => {
    saveAttempt(next)
    setAttempt(next)
  }

  const syncItemAnswered = (questionId: string, alternativeId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.question.id === questionId
          ? { ...item, answered: true, selectedAlternativeId: alternativeId }
          : item
      )
    )
  }

  const goToIndex = (i: number) => {
    if (!attempt || i < 0 || i >= items.length) return
    const next = { ...attempt, currentIndex: i }
    persistAttempt(next)
    setIndex(i)
    const item = items[i]
    const saved = attempt.answers[item.question.id]
    setSelectedAlt(
      saved?.alternativeId ?? item.selectedAlternativeId ?? null
    )
    setQStart(Date.now())
    setViewAnswer(null)
    setShowViewPanel(false)
  }

  const submitCurrent = async () => {
    if (!attempt || !current || !selectedAlt) return
    setSubmitting(true)
    setError(null)
    setViewAnswer(null)
    setShowViewPanel(false)
    try {
      const timeSpent = Math.round((Date.now() - qStart) / 1000)
      const answerApi =
        type === 'simulation' ? simulationsApi.submitAnswer : examsApi.submitAnswer
      const { data } = await answerApi(attempt.attemptId, {
        questionId: current.question.id,
        selectedAlternativeId: selectedAlt,
        timeSpentSeconds: timeSpent,
      })
      const result = data as AttemptAnswerResponse
      const nextAnswers = {
        ...attempt.answers,
        [current.question.id]: {
          alternativeId: selectedAlt,
          timeSpentSeconds: timeSpent,
          isCorrect: result.isCorrect,
        },
      }
      persistAttempt({ ...attempt, answers: nextAnswers, currentIndex: index })
      syncItemAnswered(current.question.id, selectedAlt)
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleViewAnswer = async () => {
    if (!attempt || !current) return
    const saved = attempt.answers[current.question.id]
    const selectedId = saved?.alternativeId ?? current.selectedAlternativeId
    if (!selectedId) return

    setLoadingView(true)
    setError(null)
    try {
      let isCorrect = saved?.isCorrect ?? false
      let correctAlternativeId: string | undefined
      let explanation: string | null | undefined

      const attemptApi =
        type === 'simulation' ? simulationsApi.getAttempt : examsApi.getAttempt
      const { data } = await attemptApi(attempt.attemptId)
      const detail = data as SimulationAttemptDetailResponse | ExamAttemptDetailResponse
      const serverAnswer = detail.answers?.find(
        (a) => a.questionId === current.question.id
      )
      if (serverAnswer) {
        isCorrect = serverAnswer.isCorrect
      }

      if (isCorrect) {
        correctAlternativeId = selectedId
      }

      const payload: ViewAnswerData = {
        isCorrect,
        selectedAlternativeId: selectedId,
        correctAlternativeId,
        explanation: explanation ?? null,
      }
      setViewAnswer(payload)
      setShowViewPanel(true)
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoadingView(false)
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
    return (
      <div className="flex justify-center p-12">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (error && !current) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" asChild>
          <Link href={backHref}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
          </Link>
        </Button>
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  if (!attempt || !current || items.length === 0) {
    return <p className="text-muted-foreground">Nenhuma questão disponível.</p>
  }

  const showTimer =
    type === 'exam' ||
    (type === 'simulation' && attempt.timerMode === 'fixed' && attempt.durationMinutes)

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex flex-wrap justify-between gap-2 items-center">
        <Button variant="ghost" size="sm" asChild>
          <Link href={backHref}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Sair
          </Link>
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
        {items.map((item, i) => {
          const qid = item.question.id
          const answered = !!(attempt.answers[qid] ?? item.answered)
          const isCurrent = i === index
          return (
            <button
              key={qid}
              type="button"
              onClick={() => goToIndex(i)}
              className={`h-8 w-8 rounded text-xs font-medium border cursor-pointer ${
                isCurrent
                  ? 'border-primary bg-primary text-primary-foreground'
                  : answered
                    ? 'border-[oklch(0.55_0.17_155)] bg-[oklch(0.55_0.17_155)]/20'
                    : 'border-border hover:bg-secondary/50'
              }`}
            >
              {answered ? <Check className="h-3 w-3 mx-auto" /> : i + 1}
            </button>
          )
        })}
      </div>

      <Card className="border-border">
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">
              Questão {index + 1} de {items.length}
              {current.sectionId && (
                <span className="ml-2 text-xs">· Seção vinculada</span>
              )}
            </p>
            {currentAnswered && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2"
                disabled={loadingView}
                onClick={() => {
                  if (showViewPanel) {
                    setShowViewPanel(false)
                  } else {
                    void handleViewAnswer()
                  }
                }}
              >
                {loadingView ? (
                  <Spinner className="h-4 w-4" />
                ) : showViewPanel ? (
                  <>
                    <EyeOff className="h-4 w-4" /> Ocultar resposta
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" /> Visualizar resposta
                  </>
                )}
              </Button>
            )}
          </div>

          <p className="leading-relaxed">{current.question.statement}</p>

          {current.alternatives.map((alt) => {
            const saved = attempt.answers[current.question.id]
            const isSelected = selectedAlt === alt.id
            const wasAnswered =
              saved?.alternativeId === alt.id ||
              current.selectedAlternativeId === alt.id
            const revealed = showViewPanel && viewAnswer
            const isCorrectAlt =
              revealed && viewAnswer.correctAlternativeId === alt.id
            const isWrong =
              revealed &&
              viewAnswer.selectedAlternativeId === alt.id &&
              !viewAnswer.isCorrect

            return (
              <button
                key={alt.id}
                type="button"
                disabled={revealed}
                onClick={() => setSelectedAlt(alt.id)}
                className={`w-full text-left rounded-lg border p-3 flex gap-2 cursor-pointer transition-colors ${
                  isCorrectAlt
                    ? 'border-[oklch(0.55_0.17_155)] bg-[oklch(0.55_0.17_155)]/10'
                    : isWrong
                      ? 'border-destructive bg-destructive/10'
                      : isSelected || (wasAnswered && !revealed)
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:bg-secondary/50'
                }`}
              >
                {isSelected && !revealed && (
                  <Circle className="h-4 w-4 shrink-0 fill-primary text-primary" />
                )}
                <span className="flex-1">
                  <span className="font-medium">{alt.label}.</span> {alt.content}
                </span>
              </button>
            )
          })}

          {showViewPanel && viewAnswer && (
            <ViewAnswerPanel item={current} data={viewAnswer} />
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" disabled={index === 0} onClick={() => goToIndex(index - 1)}>
              Anterior
            </Button>
            <Button
              className="flex-1 min-w-[140px]"
              disabled={!selectedAlt || submitting}
              onClick={async () => {
                await submitCurrent()
              }}
            >
              {submitting ? (
                <Spinner className="h-4 w-4" />
              ) : currentAnswered ? (
                'Atualizar resposta'
              ) : (
                'Salvar resposta'
              )}
            </Button>
            {index < items.length - 1 && (
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
              Você respondeu {answeredCount} de {attempt.totalQuestions} questões. Após
              finalizar, verá o resultado consolidado.
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
