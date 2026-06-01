'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { examsApi } from '@/lib/api/axios'
import { getApiErrorMessage } from '@/lib/api/client'
import type { ExamResponse } from '@/lib/api/types'
import { AssessmentRunner } from '@/components/assessment/assessment-runner'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Play } from 'lucide-react'

export default function ProvaExecucaoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [exam, setExam] = useState<ExamResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    examsApi
      .getById(id)
      .then((res) => setExam(res.data as ExamResponse))
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div className="flex justify-center p-12"><Spinner className="h-8 w-8" /></div>
  }

  if (error || !exam) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" asChild>
          <Link href="/provas"><ArrowLeft className="h-4 w-4 mr-2" /> Voltar</Link>
        </Button>
        <p className="text-destructive">{error ?? 'Prova não encontrada'}</p>
      </div>
    )
  }

  const questionIds =
    exam.questionIds ??
    exam.sections?.flatMap((s) => s.questionIds) ??
    []

  if (!started) {
    return (
      <div className="max-w-lg mx-auto space-y-6 py-8">
        <h1 className="text-2xl font-bold">{exam.title}</h1>
        <p className="text-muted-foreground">
          {exam.institution} · {exam.organization} · {exam.year}
        </p>
        <p className="text-sm">{exam.roleName}</p>
        <div className="flex gap-2">
          <Badge>{exam.durationMinutes} min</Badge>
          <Badge variant="secondary">{questionIds.length} questões</Badge>
        </div>
        {exam.sections && exam.sections.length > 0 && (
          <ul className="text-sm space-y-1 text-muted-foreground">
            {exam.sections.map((s) => (
              <li key={s.id}>
                {s.name} — {s.questionIds.length} questões (peso {s.weight})
              </li>
            ))}
          </ul>
        )}
        <Button
          size="lg"
          className="w-full gap-2"
          disabled={questionIds.length === 0}
          onClick={() => setStarted(true)}
        >
          <Play className="h-5 w-5" /> Iniciar prova
        </Button>
      </div>
    )
  }

  return (
    <AssessmentRunner
      type="exam"
      resourceId={id}
      title={exam.title}
      questionIds={questionIds}
      durationMinutes={exam.durationMinutes}
      backHref="/provas"
      resultHref={`/provas/${id}/resultado`}
    />
  )
}
