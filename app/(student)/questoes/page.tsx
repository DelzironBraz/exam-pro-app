"use client"

import { useState } from "react"
import { Bookmark, SkipForward, Sparkles, Flag, Type, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const mockQuestion = {
  id: "849201",
  discipline: "Direito Constitucional",
  banca: "CESPE / CEBRASPE",
  year: "2023",
  institution: "Polícia Federal",
  position: "Agente",
  statement: "Acerca dos direitos e garantias fundamentais previstos na Constituição Federal de 1988, julgue o item subsequente.",
  complementaryText: "A inviolabilidade do domicílio é garantia absoluta, não admitindo, em qualquer hipótese, o ingresso de autoridade policial sem o consentimento do morador durante o período noturno, mesmo havendo mandado judicial.",
  type: "certo-errado",
  correctAnswer: "errado",
  stats: { correct: 25, wrong: 75 },
}

const disciplines = [
  "Direito Constitucional",
  "Direito Administrativo",
  "Português",
  "Matemática Financeira",
  "Informática",
  "Direito Penal",
]

const bancas = [
  "Todas as Bancas",
  "CESPE / CEBRASPE",
  "FGV",
  "FCC",
  "VUNESP",
  "IBFC",
]

const difficulties = [
  { id: "facil", label: "Fácil" },
  { id: "media", label: "Média" },
  { id: "dificil", label: "Difícil" },
]

export default function QuestoesPage() {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>(["media"])
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(["Direitos Fundamentais"])

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer)
    setShowResult(true)
  }

  const isCorrect = selectedAnswer === mockQuestion.correctAnswer

  return (
    <div className="flex gap-6">
      {/* Filters Sidebar */}
      <div className="w-72 shrink-0">
        <div className="sticky top-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Filtros</h2>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
              <FilterIcon className="h-4 w-4" />
            </Button>
          </div>

          {/* Banca */}
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Banca
            </Label>
            <Select defaultValue="todas">
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue placeholder="Selecione a banca" />
              </SelectTrigger>
              <SelectContent>
                {bancas.map((banca) => (
                  <SelectItem key={banca} value={banca.toLowerCase().replace(/\s/g, "-")}>
                    {banca}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Disciplina */}
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Disciplina
            </Label>
            <Select defaultValue="direito-constitucional">
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue placeholder="Selecione a disciplina" />
              </SelectTrigger>
              <SelectContent>
                {disciplines.map((disc) => (
                  <SelectItem key={disc} value={disc.toLowerCase().replace(/\s/g, "-")}>
                    {disc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Assunto */}
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Assunto
            </Label>
            <Input
              placeholder="Buscar assunto..."
              className="bg-secondary border-border"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedSubjects.map((subject) => (
                <Badge
                  key={subject}
                  variant="secondary"
                  className="bg-secondary text-foreground hover:bg-secondary/80 cursor-pointer"
                >
                  {subject}
                  <button className="ml-1 hover:text-destructive">×</button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Dificuldade */}
          <div className="space-y-3">
            <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Dificuldade
            </Label>
            <div className="space-y-2">
              {difficulties.map((diff) => (
                <div key={diff.id} className="flex items-center gap-2">
                  <Checkbox
                    id={diff.id}
                    checked={selectedDifficulties.includes(diff.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedDifficulties([...selectedDifficulties, diff.id])
                      } else {
                        setSelectedDifficulties(selectedDifficulties.filter((d) => d !== diff.id))
                      }
                    }}
                    className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <label htmlFor={diff.id} className="text-sm text-foreground cursor-pointer">
                    {diff.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1 border-border">
              Limpar
            </Button>
            <Button className="flex-1 bg-primary hover:bg-primary/90">
              Aplicar
            </Button>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 max-w-3xl">
        {/* Question Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-border text-muted-foreground">
              QID: {mockQuestion.id}
            </Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FolderIcon className="h-4 w-4" />
              {mockQuestion.discipline}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Flag className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Type className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tags */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-secondary text-foreground">
            {mockQuestion.banca}
          </Badge>
          <Badge variant="secondary" className="bg-secondary text-foreground">
            {mockQuestion.year}
          </Badge>
          <Badge variant="secondary" className="bg-secondary text-foreground">
            {mockQuestion.institution}
          </Badge>
          <Badge variant="secondary" className="bg-secondary text-foreground">
            {mockQuestion.position}
          </Badge>
        </div>

        {/* Question Statement */}
        <div className="mb-8">
          <p className="text-foreground leading-relaxed">{mockQuestion.statement}</p>
          <div className="mt-4 border-l-4 border-muted pl-4">
            <p className="text-foreground leading-relaxed">{mockQuestion.complementaryText}</p>
          </div>
        </div>

        {/* Answer Options */}
        <div className="space-y-3 mb-8">
          <button
            onClick={() => !showResult && handleAnswer("certo")}
            disabled={showResult}
            className={`w-full flex items-center gap-4 rounded-lg border p-4 text-left transition-all ${
              showResult && selectedAnswer === "certo"
                ? isCorrect
                  ? "border-[oklch(0.72_0.19_155)] bg-[oklch(0.72_0.19_155)]/10"
                  : "border-destructive bg-destructive/10"
                : showResult && mockQuestion.correctAnswer === "certo"
                ? "border-[oklch(0.72_0.19_155)] bg-[oklch(0.72_0.19_155)]/10"
                : "border-border bg-secondary/50 hover:bg-secondary"
            }`}
          >
            <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
              showResult && mockQuestion.correctAnswer === "certo"
                ? "border-[oklch(0.72_0.19_155)] bg-[oklch(0.72_0.19_155)]"
                : selectedAnswer === "certo"
                ? "border-primary bg-primary"
                : "border-muted-foreground"
            }`}>
              {showResult && mockQuestion.correctAnswer === "certo" && (
                <CheckCircle className="h-4 w-4 text-[oklch(0.15_0_0)]" />
              )}
            </div>
            <span className="font-medium text-foreground">Certo</span>
          </button>

          <button
            onClick={() => !showResult && handleAnswer("errado")}
            disabled={showResult}
            className={`w-full flex items-center gap-4 rounded-lg border p-4 text-left transition-all ${
              showResult && selectedAnswer === "errado"
                ? isCorrect
                  ? "border-[oklch(0.72_0.19_155)] bg-[oklch(0.72_0.19_155)]/10"
                  : "border-destructive bg-destructive/10"
                : showResult && mockQuestion.correctAnswer === "errado"
                ? "border-[oklch(0.72_0.19_155)] bg-[oklch(0.72_0.19_155)]/10"
                : "border-border bg-secondary/50 hover:bg-secondary"
            }`}
          >
            <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
              showResult && mockQuestion.correctAnswer === "errado"
                ? "border-[oklch(0.72_0.19_155)] bg-[oklch(0.72_0.19_155)]"
                : selectedAnswer === "errado"
                ? "border-primary bg-primary"
                : "border-muted-foreground"
            }`}>
              {showResult && mockQuestion.correctAnswer === "errado" && (
                <CheckCircle className="h-4 w-4 text-[oklch(0.15_0_0)]" />
              )}
            </div>
            <span className="font-medium text-foreground">Errado</span>
          </button>
        </div>

        {/* Result Feedback */}
        {showResult && (
          <Card className={`mb-8 border ${isCorrect ? "border-[oklch(0.72_0.19_155)] bg-[oklch(0.72_0.19_155)]/5" : "border-destructive bg-destructive/5"}`}>
            <CardContent className="flex items-center gap-3 p-4">
              {isCorrect ? (
                <CheckCircle className="h-5 w-5 text-[oklch(0.72_0.19_155)]" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
              <span className={`font-semibold ${isCorrect ? "text-[oklch(0.72_0.19_155)]" : "text-destructive"}`}>
                {isCorrect ? "Resposta Correta!" : "Resposta Incorreta"}
              </span>
            </CardContent>
          </Card>
        )}

        {/* Question Stats */}
        {showResult && (
          <div className="mb-8">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
              Estatísticas da Questão
            </p>
            <div className="flex items-center gap-4">
              <Progress 
                value={mockQuestion.stats.correct} 
                className="flex-1 h-2 bg-destructive"
              />
              <div className="flex items-center gap-4 text-sm">
                <span className="text-[oklch(0.72_0.19_155)]">{mockQuestion.stats.correct}% C</span>
                <span className="text-muted-foreground">/</span>
                <span className="text-destructive">{mockQuestion.stats.wrong}% E</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
              <Bookmark className="h-4 w-4" />
              Salvar
            </Button>
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
              <SkipForward className="h-4 w-4" />
              Pular
            </Button>
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
              <Sparkles className="h-4 w-4" />
              AI Tutor
            </Button>
          </div>
          <Button 
            className="gap-2 bg-[oklch(0.72_0.19_155)]/20 text-[oklch(0.72_0.19_155)] hover:bg-[oklch(0.72_0.19_155)]/30"
            onClick={() => {
              setSelectedAnswer(null)
              setShowResult(false)
            }}
          >
            {showResult ? "Próxima" : "Responder"}
            <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function FilterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="4" x2="4" y1="21" y2="14" />
      <line x1="4" x2="4" y1="10" y2="3" />
      <line x1="12" x2="12" y1="21" y2="12" />
      <line x1="12" x2="12" y1="8" y2="3" />
      <line x1="20" x2="20" y1="21" y2="16" />
      <line x1="20" x2="20" y1="12" y2="3" />
      <line x1="2" x2="6" y1="14" y2="14" />
      <line x1="10" x2="14" y1="8" y2="8" />
      <line x1="18" x2="22" y1="16" y2="16" />
    </svg>
  )
}

function FolderIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>
  )
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}
