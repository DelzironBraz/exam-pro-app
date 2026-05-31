"use client"

import { useState } from "react"
import { FileText, ZoomIn, ZoomOut, AlertTriangle, CheckCircle, Pencil, Trash2, Filter, MoreVertical } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const mockDocument = {
  filename: "ENEM_2023_Caderno_Azul.pdf",
  status: "OCR em Progresso... (85%)",
  totalDetected: 45,
  failures: 2,
  pages: 12,
}

const mockQuestions = [
  {
    id: 1,
    confidence: 98,
    status: "success",
    statement: "A respeito das características do modelo atômico de Bohr, assinale a alternativa correta:",
    options: [
      { letter: "A", text: "Os elétrons movem-se em órbitas elípticas ao redor do núcleo." },
      { letter: "B", text: "Os elétrons ocupam níveis de energia bem definidos.", correct: true },
      { letter: "C", text: "O átomo é uma esfera maciça e indivisível." },
    ],
    suggestedTags: ["Química", "Atomística"],
  },
  {
    id: 2,
    confidence: 45,
    status: "warning",
    statement: "Um bloco de massa m desliza sobre um plano inclinado com atrito. Considerando a gravidade g e o ângulo θ, a força de a[]~^",
    truncated: true,
    options: [],
    suggestedTags: ["Física", "Mecânica"],
  },
  {
    id: 3,
    confidence: 92,
    status: "success",
    statement: "Na obra 'Dom Casmurro', de Machado de Assis, o narrador Bentinho apresenta uma visão...",
    options: [
      { letter: "A", text: "Objetiva e imparcial dos acontecimentos narrados." },
      { letter: "B", text: "Subjetiva e possivelmente enviesada.", correct: true },
      { letter: "C", text: "Completamente confiável e verificável." },
    ],
    suggestedTags: ["Literatura", "Machado de Assis"],
  },
]

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 90) return "text-[oklch(0.72_0.19_155)]"
  if (confidence >= 70) return "text-warning"
  return "text-destructive"
}

const getConfidenceBg = (confidence: number) => {
  if (confidence >= 90) return "bg-[oklch(0.72_0.19_155)]/20"
  if (confidence >= 70) return "bg-warning/20"
  return "bg-destructive/20"
}

export default function AdminParserPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
            <FileText className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">{mockDocument.filename}</h1>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className="text-primary">{mockDocument.status}</span>
              </div>
              <Progress value={85} className="w-32 h-2" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Detectado</p>
            <p className="text-2xl font-bold text-foreground">{mockDocument.totalDetected}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Falhas</p>
            <p className="text-2xl font-bold text-destructive">{mockDocument.failures}</p>
          </div>
          <Button variant="outline" className="gap-2 border-destructive text-destructive hover:bg-destructive/10">
            <AlertTriangle className="h-4 w-4" />
            Corrigir Erros
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <CheckCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-2 gap-6">
        {/* Document Preview */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Original Document (Page 1/{mockDocument.pages})
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">100%</span>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {/* Simulated PDF Preview */}
            <div className="aspect-[3/4] rounded-lg bg-white p-6 overflow-hidden">
              {/* Header placeholder */}
              <div className="h-6 w-48 rounded bg-gray-200 mb-4" />
              
              {/* Question 1 - High Confidence */}
              <div className="mb-4 relative">
                <Badge className="absolute -left-2 -top-2 bg-[oklch(0.72_0.19_155)]/90 text-white text-xs">
                  Q1 98%
                </Badge>
                <div className="h-3 w-full rounded bg-pink-100 mb-1" />
                <div className="h-3 w-3/4 rounded bg-pink-100 mb-1" />
                <div className="h-3 w-1/2 rounded bg-pink-100 mb-3" />
                <div className="space-y-1 pl-4">
                  <div className="h-2.5 w-full rounded bg-pink-50" />
                  <div className="h-2.5 w-5/6 rounded bg-pink-50" />
                  <div className="h-2.5 w-4/5 rounded bg-pink-50" />
                </div>
              </div>

              {/* Question 2 - Low Confidence */}
              <div className="mb-4 relative">
                <Badge className="absolute -left-2 -top-2 bg-warning/90 text-white text-xs flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Q2 45%
                </Badge>
                <div className="h-3 w-full rounded bg-yellow-100 mb-1" />
                <div className="h-3 w-2/3 rounded bg-yellow-100 mb-1" />
                <div className="h-3 w-3/4 rounded bg-yellow-100 mb-3" />
                <div className="space-y-1 pl-4">
                  <div className="h-2.5 w-full rounded bg-yellow-50" />
                  <div className="h-2.5 w-4/5 rounded bg-yellow-50" />
                </div>
              </div>

              {/* Question 3 - High Confidence */}
              <div className="relative">
                <Badge className="absolute -left-2 -top-2 bg-[oklch(0.72_0.19_155)]/90 text-white text-xs">
                  Q3 92%
                </Badge>
                <div className="h-3 w-full rounded bg-pink-100 mb-1" />
                <div className="h-3 w-5/6 rounded bg-pink-100 mb-1" />
                <div className="h-3 w-2/3 rounded bg-pink-100 mb-3" />
                <div className="space-y-1 pl-4">
                  <div className="h-2.5 w-full rounded bg-pink-50" />
                  <div className="h-2.5 w-3/4 rounded bg-pink-50" />
                  <div className="h-2.5 w-5/6 rounded bg-pink-50" />
                </div>
              </div>

              {/* Image placeholder */}
              <div className="mt-6 aspect-video rounded bg-gray-100 flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-gray-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Structured Data */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Structured Data
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
            {mockQuestions.map((question) => (
              <Card
                key={question.id}
                className={`border ${
                  question.status === "warning"
                    ? "border-warning/50 bg-warning/5"
                    : "border-border bg-card"
                }`}
              >
                <CardContent className="p-4">
                  {/* Question Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-secondary">
                        Questão {question.id}
                      </Badge>
                      <div className={`flex items-center gap-1 text-xs ${getConfidenceColor(question.confidence)}`}>
                        <CheckCircle className="h-3 w-3" />
                        Confiança: {question.confidence}%
                        {question.status === "warning" && (
                          <span className="text-warning ml-1">(Análise Manual Necessária)</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Truncation Warning */}
                  {question.truncated && (
                    <div className="flex items-center gap-2 mb-3 text-xs text-warning">
                      <AlertTriangle className="h-3 w-3" />
                      Enunciado (Texto possivelmente truncado)
                    </div>
                  )}

                  {/* Statement */}
                  <div className="rounded-lg bg-secondary/50 p-3 mb-3">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                      Enunciado
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">{question.statement}</p>
                  </div>

                  {/* Options */}
                  {question.options.length > 0 && (
                    <div className="space-y-2 mb-3">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Alternativas
                      </p>
                      {question.options.map((option) => (
                        <div
                          key={option.letter}
                          className={`flex items-start gap-2 rounded p-2 ${
                            option.correct
                              ? "bg-[oklch(0.72_0.19_155)]/10"
                              : "bg-secondary/30"
                          }`}
                        >
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                              option.correct
                                ? "bg-[oklch(0.72_0.19_155)] text-[oklch(0.15_0_0)]"
                                : "bg-secondary text-muted-foreground"
                            }`}
                          >
                            {option.letter}
                          </span>
                          <span className={`text-xs ${option.correct ? "text-[oklch(0.72_0.19_155)]" : "text-foreground"}`}>
                            {option.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex items-center gap-2">
                    <SparklesIcon className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Tags sugeridas:</span>
                    {question.suggestedTags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs border-border">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  {question.status === "success" ? (
                    <div className="flex justify-end mt-3">
                      <Button variant="outline" size="sm" className="border-border">
                        Aprovar Individual
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-2 mt-3">
                      <Button variant="outline" size="sm" className="border-border">
                        Descartar
                      </Button>
                      <Button size="sm" className="bg-destructive hover:bg-destructive/90">
                        Corrigir Manualmente
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ImageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  )
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  )
}
