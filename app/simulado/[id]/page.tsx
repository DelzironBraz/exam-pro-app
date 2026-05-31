"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Clock, Flag, Pause, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const mockExam = {
  title: "Auditor Fiscal - Receita Federal",
  totalQuestions: 100,
  timeLimit: 4 * 60 * 60, // 4 hours in seconds
  questions: Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    discipline: i < 20 ? "Direito Tributário" : i < 40 ? "Direito Constitucional" : i < 60 ? "Português" : i < 80 ? "Matemática Financeira" : "Informática",
    banca: "FGV 2023",
    statement: "A Constituição Federal estabelece limitações ao poder de tributar, visando proteger os contribuintes contra abusos do Estado. Entre esses princípios, destaca-se a vedação à cobrança de tributos no mesmo exercício financeiro em que haja sido publicada a lei que os instituiu ou aumentou.",
    complementaryText: "Com base na jurisprudência do Supremo Tribunal Federal (STF) sobre a anterioridade tributária, assinale a alternativa correta referente às exceções a este princípio.",
    options: [
      { letter: "A", text: "O Imposto sobre a Renda e Proventos de Qualquer Natureza (IR) sujeita-se à anterioridade nonagesimal, mas não à anterioridade de exercício." },
      { letter: "B", text: "A alteração da base de cálculo do Imposto sobre a Propriedade de Veículos Automotores (IPVA) constitui exceção apenas à anterioridade nonagesimal." },
      { letter: "C", text: "O Imposto sobre Produtos Industrializados (IPI) constitui exceção à anterioridade de exercício, sujeitando-se, contudo, à anterioridade nonagesimal." },
      { letter: "D", text: "As contribuições de intervenção no domínio econômico (CIDE) não se sujeitam a nenhuma das regras de anterioridade." },
      { letter: "E", text: "O restabelecimento de alíquotas do ICMS deve obediência irrestrita a ambas as regras de anterioridade." },
    ],
    correctAnswer: "C",
    answered: i < 41 ? (i % 3 === 0 ? "C" : i % 3 === 1 ? "A" : "B") : null,
    flagged: i === 3 || i === 8,
  })),
}

export default function SimuladoPage() {
  const [currentQuestion, setCurrentQuestion] = useState(5) // 0-indexed, showing question 6
  const [timeRemaining, setTimeRemaining] = useState(mockExam.timeLimit)
  const [answers, setAnswers] = useState<Record<number, string>>(() => {
    const initial: Record<number, string> = {}
    mockExam.questions.forEach((q, i) => {
      if (q.answered) initial[i] = q.answered
    })
    return initial
  })
  const [flagged, setFlagged] = useState<Set<number>>(() => {
    const initial = new Set<number>()
    mockExam.questions.forEach((q, i) => {
      if (q.flagged) initial.add(i)
    })
    return initial
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  const question = mockExam.questions[currentQuestion]
  const answeredCount = Object.keys(answers).length
  const pendingCount = mockExam.totalQuestions - answeredCount

  const handleSelectAnswer = (letter: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: letter }))
  }

  const toggleFlag = () => {
    setFlagged((prev) => {
      const next = new Set(prev)
      if (next.has(currentQuestion)) {
        next.delete(currentQuestion)
      } else {
        next.add(currentQuestion)
      }
      return next
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FileIcon className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Simulado</p>
                <p className="text-sm font-medium text-foreground">{mockExam.title}</p>
              </div>
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="font-mono text-lg font-semibold text-foreground">
              {formatTime(timeRemaining)}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2 border-border">
              <Pause className="h-4 w-4" />
              Pausar
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              Finalizar Prova
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Question Navigation Sidebar */}
        <aside className="sticky top-[61px] h-[calc(100vh-61px)] w-64 shrink-0 overflow-y-auto border-r border-border bg-card p-4">
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progresso</span>
              <span className="font-medium text-foreground">{answeredCount} / {mockExam.totalQuestions}</span>
            </div>
          </div>

          {/* Legend */}
          <div className="mb-4 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="h-2.5 w-2.5 rounded-full bg-primary" />
              <span className="text-muted-foreground">Respondida</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2.5 w-2.5 rounded-full border border-muted-foreground" />
              <span className="text-muted-foreground">Pendente</span>
            </div>
            <div className="flex items-center gap-1">
              <Flag className="h-2.5 w-2.5 text-warning" />
              <span className="text-muted-foreground">Marcada</span>
            </div>
          </div>

          {/* Question Grid */}
          <div className="grid grid-cols-5 gap-1.5">
            {mockExam.questions.map((q, i) => {
              const isAnswered = answers[i] !== undefined
              const isFlagged = flagged.has(i)
              const isCurrent = i === currentQuestion

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(i)}
                  className={`relative flex h-9 w-9 items-center justify-center rounded text-sm font-medium transition-colors ${
                    isCurrent
                      ? "bg-primary text-primary-foreground"
                      : isAnswered
                      ? "bg-primary/20 text-primary"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  }`}
                >
                  {q.id}
                  {isFlagged && (
                    <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-warning" />
                  )}
                </button>
              )
            })}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="mx-auto max-w-3xl">
            {/* Question Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Questão {String(question.id).padStart(2, "0")}</h1>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="secondary" className="bg-secondary text-muted-foreground">
                    {question.discipline}
                  </Badge>
                  <Badge variant="secondary" className="bg-secondary text-muted-foreground">
                    {question.banca}
                  </Badge>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFlag}
                className={`gap-2 border-border ${flagged.has(currentQuestion) ? "text-warning" : "text-muted-foreground"}`}
              >
                <Flag className="h-4 w-4" />
                Marcar
              </Button>
            </div>

            {/* Question Content */}
            <Card className="mb-8 bg-card border-border">
              <CardContent className="p-6">
                <p className="text-foreground leading-relaxed">{question.statement}</p>
                <p className="mt-4 text-foreground leading-relaxed">{question.complementaryText}</p>
              </CardContent>
            </Card>

            {/* Options */}
            <div className="space-y-3 mb-8">
              {question.options.map((option) => {
                const isSelected = answers[currentQuestion] === option.letter

                return (
                  <button
                    key={option.letter}
                    onClick={() => handleSelectAnswer(option.letter)}
                    className={`w-full flex items-start gap-4 rounded-lg border p-4 text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:bg-secondary/50"
                    }`}
                  >
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold ${
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground text-muted-foreground"
                      }`}
                    >
                      {option.letter}
                    </div>
                    <span className="text-foreground leading-relaxed pt-0.5">{option.text}</span>
                  </button>
                )
              })}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
                className="gap-2 border-border"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <Button
                onClick={() => setCurrentQuestion((prev) => Math.min(mockExam.totalQuestions - 1, prev + 1))}
                disabled={currentQuestion === mockExam.totalQuestions - 1}
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                Próxima
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function FileIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}
