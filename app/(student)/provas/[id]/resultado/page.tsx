'use client'

import { use, useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { examsApi } from '@/lib/api/axios'
import { getApiErrorMessage } from '@/lib/api/client'
import type { ExamResultResponse } from '@/lib/api/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'

function ResultContent({ params }: { params: Promise<{ id: string }> }) {
  const { id: examId } = use(params)
  const searchParams = useSearchParams()
  const attemptId = searchParams.get('attemptId')
  const [result, setResult] = useState<ExamResultResponse | null>(null)
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
        setResult(JSON.parse(cached) as ExamResultResponse)
        setLoading(false)
        return
      } catch {
        /* fetch */
      }
    }
    examsApi
      .getAttempt(attemptId)
      .then((res) => setResult(res.data as ExamResultResponse))
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [attemptId])

  if (loading) return <div className="flex justify-center p-12"><Spinner className="h-8 w-8" /></div>
  if (error || !result) return <p className="text-destructive">{error ?? 'Resultado indisponível'}</p>

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle>{result.examTitle ?? 'Resultado da prova'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold">{result.score}</p>
              <p className="text-xs text-muted-foreground">Nota</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[oklch(0.72_0.19_155)]">{result.totalCorrect}</p>
              <p className="text-xs text-muted-foreground">Acertos</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{result.totalWrong}</p>
              <p className="text-xs text-muted-foreground">Erros</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex gap-2 justify-center">
        <Button asChild variant="outline">
          <Link href="/historico">Histórico</Link>
        </Button>
        <Button asChild>
          <Link href={`/provas/${examId}`}>Tentar novamente</Link>
        </Button>
      </div>
    </div>
  )
}

export default function ProvaResultadoPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<Spinner className="mx-auto mt-12" />}>
      <ResultContent params={params} />
    </Suspense>
  )
}
