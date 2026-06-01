'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { simulationsApi } from '@/lib/api/axios'
import { getApiErrorMessage } from '@/lib/api/client'
import type { SimulationResultResponse } from '@/lib/api/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ResultContent({ params }: { params: Promise<{ id: string }> }) {
  const { id: simulationId } = use(params)
  const searchParams = useSearchParams()
  const attemptId = searchParams.get('attemptId')
  const [result, setResult] = useState<SimulationResultResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!attemptId) {
      setError('Tentativa não informada')
      setLoading(false)
      return
    }
    const cached = sessionStorage.getItem(`ow_result_${attemptId}`)
    if (cached) {
      try {
        setResult(JSON.parse(cached) as SimulationResultResponse)
        setLoading(false)
        return
      } catch {
        /* fetch */
      }
    }
    simulationsApi
      .getAttempt(attemptId)
      .then((res) => setResult(res.data as SimulationResultResponse))
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [attemptId])

  if (loading) return <div className="flex justify-center p-12"><Spinner className="h-8 w-8" /></div>
  if (error || !result) return <p className="text-destructive">{error ?? 'Resultado indisponível'}</p>

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Resultado do simulado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-[oklch(0.72_0.19_155)]">{result.scorePercent}%</p>
              <p className="text-xs text-muted-foreground">Aproveitamento</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{result.totalCorrect}</p>
              <p className="text-xs text-muted-foreground">Acertos</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{result.totalWrong}</p>
              <p className="text-xs text-muted-foreground">Erros</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Tempo total: {Math.floor(result.totalTimeSeconds / 60)} min
          </p>
        </CardContent>
      </Card>
      <div className="flex gap-2 justify-center">
        <Button asChild variant="outline">
          <Link href="/simulados">Voltar aos simulados</Link>
        </Button>
        <Button asChild>
          <Link href={`/simulado/${simulationId}`}>Refazer</Link>
        </Button>
      </div>
    </div>
  )
}

export default function SimuladoResultadoPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<Spinner className="mx-auto mt-12" />}>
      <ResultContent params={params} />
    </Suspense>
  )
}
