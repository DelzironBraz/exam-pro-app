'use client'

import { use, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { simulationsApi, questionsApi } from '@/lib/api/axios'
import { getApiErrorMessage } from '@/lib/api/client'
import type { SimulationResponse, QuestionResponse } from '@/lib/api/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft } from 'lucide-react'

export default function SimuladoExecucaoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: simulationId } = use(params)
  const router = useRouter()
  const [sim, setSim] = useState<SimulationResponse | null>(null)
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [durationSec, setDurationSec] = useState<number | null>(null)
  const [questions, setQuestions] = useState<QuestionResponse[]>([])
  const [index, setIndex] = useState(0)
  const [selectedAlt, setSelectedAlt] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [qStart, setQStart] = useState(Date.now())
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)

  const init = useCallback(async () => {
    setLoading(true)
    try {
      const simRes = await simulationsApi.getById(simulationId)
      const simData = simRes.data as SimulationResponse
      setSim(simData)
      const startRes = await simulationsApi.start(simulationId)
      const startData = startRes.data as {
        attempt: { id: string }
        timer: { mode: string; durationMinutes?: number }
      }
      setAttemptId(startData.attempt.id)
      if (startData.timer.mode === 'fixed' && startData.timer.durationMinutes) {
        setDurationSec(startData.timer.durationMinutes * 60)
        setTimeLeft(startData.timer.durationMinutes * 60)
      }
      const ids = simData.questionIds ?? []
      const loaded: QuestionResponse[] = []
      for (const qid of ids) {
        const qRes = await questionsApi.getById(qid)
        loaded.push(qRes.data as QuestionResponse)
      }
      setQuestions(loaded)
      setQStart(Date.now())
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [simulationId])

  useEffect(() => {
    init()
  }, [init])

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return
    const t = setInterval(() => setTimeLeft((s) => (s !== null && s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [timeLeft])

  const current = questions[index]

  const finish = async (finalCorrect: number, finalWrong: number) => {
    if (!attemptId) return
    await simulationsApi.finishAttempt(attemptId, {
      totalCorrect: finalCorrect,
      totalWrong: finalWrong,
      totalTimeSeconds: durationSec ? durationSec - (timeLeft ?? 0) : 0,
    })
    router.push('/historico')
  }

  const submitAnswer = async () => {
    if (!attemptId || !current || !selectedAlt) return
    try {
      const { data } = await simulationsApi.submitAnswer(attemptId, {
        questionId: current.id,
        selectedAlternativeId: selectedAlt,
        timeSpentSeconds: Math.round((Date.now() - qStart) / 1000),
      })
      const ok = (data as { isCorrect: boolean }).isCorrect
      const newCorrect = correct + (ok ? 1 : 0)
      const newWrong = wrong + (ok ? 0 : 1)
      setCorrect(newCorrect)
      setWrong(newWrong)
      if (index < questions.length - 1) {
        setIndex(index + 1)
        setSelectedAlt(null)
        setQStart(Date.now())
      } else {
        await finish(newCorrect, newWrong)
      }
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  if (loading) {
    return <div className="flex justify-center p-12"><Spinner className="h-8 w-8" /></div>
  }

  if (error || !current) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" asChild><Link href="/simulados"><ArrowLeft className="h-4 w-4 mr-2" /> Voltar</Link></Button>
        <p className="text-destructive">{error ?? 'Simulado sem questões'}</p>
      </div>
    )
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{sim?.title}</span>
        <span>
          {index + 1}/{questions.length}
          {timeLeft !== null && ` · ${formatTime(timeLeft)}`}
        </span>
      </div>
      <Card className="border-border">
        <CardContent className="p-6 space-y-4">
          <p>{current.statement}</p>
          {(current.alternatives ?? []).map((alt) => (
            <button
              key={alt.id}
              type="button"
              onClick={() => setSelectedAlt(alt.id)}
              className={`w-full text-left rounded-lg border p-3 ${
                selectedAlt === alt.id ? 'border-primary bg-primary/10' : 'border-border'
              }`}
            >
              <span className="font-medium">{alt.label}.</span> {alt.content}
            </button>
          ))}
          <Button className="w-full" disabled={!selectedAlt} onClick={submitAnswer}>
            {index < questions.length - 1 ? 'Próxima' : 'Finalizar'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
