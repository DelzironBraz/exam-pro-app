'use client'

import { use, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { examsApi, questionsApi } from '@/lib/api/axios'
import { getApiErrorMessage } from '@/lib/api/client'
import type { ExamResponse, QuestionResponse } from '@/lib/api/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react'

export default function ProvaExecucaoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: examId } = use(params)
  const router = useRouter()
  const [exam, setExam] = useState<ExamResponse | null>(null)
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [questions, setQuestions] = useState<QuestionResponse[]>([])
  const [index, setIndex] = useState(0)
  const [selectedAlt, setSelectedAlt] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [qStart, setQStart] = useState(Date.now())
  const [stats, setStats] = useState({ correct: 0, wrong: 0 })

  const init = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const examRes = await examsApi.getById(examId)
      const examData = examRes.data as ExamResponse
      setExam(examData)
      const startRes = await examsApi.start(examId)
      const startData = startRes.data as { attempt: { id: string } }
      setAttemptId(startData.attempt.id)
      const ids = examData.questionIds ?? []
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
  }, [examId])

  useEffect(() => {
    init()
  }, [init])

  const current = questions[index]

  const submitAnswer = async () => {
    if (!attemptId || !current || !selectedAlt) return
    try {
      const { data } = await examsApi.submitAnswer(attemptId, {
        questionId: current.id,
        selectedAlternativeId: selectedAlt,
        timeSpentSeconds: Math.round((Date.now() - qStart) / 1000),
      })
      const ok = (data as { isCorrect: boolean }).isCorrect
      setStats((s) => ({
        correct: s.correct + (ok ? 1 : 0),
        wrong: s.wrong + (ok ? 0 : 1),
      }))
      const newCorrect = stats.correct + (ok ? 1 : 0)
      const newWrong = stats.wrong + (ok ? 0 : 1)
      if (index < questions.length - 1) {
        setStats({ correct: newCorrect, wrong: newWrong })
        setIndex(index + 1)
        setSelectedAlt(null)
        setQStart(Date.now())
      } else {
        await examsApi.finishAttempt(attemptId, {
          totalCorrect: newCorrect,
          totalWrong: newWrong,
          totalTimeSeconds: 0,
        })
        router.push('/historico')
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
        <Button variant="ghost" asChild><Link href="/provas"><ArrowLeft className="h-4 w-4 mr-2" /> Voltar</Link></Button>
        <p className="text-destructive">{error ?? 'Prova sem questões'}</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>{exam?.title}</span>
        <span>Questão {index + 1} / {questions.length}</span>
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
            {index < questions.length - 1 ? 'Próxima' : 'Finalizar prova'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
