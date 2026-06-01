'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { simulationsApi } from '@/lib/api/axios'
import { getApiErrorMessage } from '@/lib/api/client'
import type { SimulationResponse } from '@/lib/api/types'
import { AssessmentRunner } from '@/components/assessment/assessment-runner'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft, Play } from 'lucide-react'

export default function SimuladoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [sim, setSim] = useState<SimulationResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    simulationsApi
      .getById(id)
      .then((res) => setSim(res.data as SimulationResponse))
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div className="flex justify-center p-12"><Spinner className="h-8 w-8" /></div>
  }

  if (error || !sim) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" asChild>
          <Link href="/simulados"><ArrowLeft className="h-4 w-4 mr-2" /> Voltar</Link>
        </Button>
        <p className="text-destructive">{error ?? 'Simulado não encontrado'}</p>
      </div>
    )
  }

  const questionIds = sim.questionIds ?? []

  if (!started) {
    return (
      <div className="max-w-lg mx-auto space-y-6 text-center py-12">
        <h1 className="text-2xl font-bold">{sim.title}</h1>
        {sim.description && <p className="text-muted-foreground">{sim.description}</p>}
        <p className="text-sm">
          {questionIds.length} questões
          {sim.timerMode === 'fixed' && sim.durationMinutes && ` · ${sim.durationMinutes} min`}
        </p>
        <Button
          size="lg"
          className="gap-2"
          disabled={questionIds.length === 0}
          onClick={() => setStarted(true)}
        >
          <Play className="h-5 w-5" /> Iniciar simulado
        </Button>
      </div>
    )
  }

  return (
    <AssessmentRunner
      type="simulation"
      resourceId={id}
      title={sim.title}
      questionIds={questionIds}
      timerMode={sim.timerMode}
      durationMinutes={sim.durationMinutes ?? undefined}
      backHref="/simulados"
      resultHref={`/simulado/${id}/resultado`}
    />
  )
}
