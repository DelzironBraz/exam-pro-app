"use client"

import { useState } from "react"
import { Upload, FileText, Sparkles, Clock, CheckCircle, ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"]
const weeklyTasks = [
  { status: "todo", count: 5 },
  { status: "focus", count: 1 },
  { status: "done", count: 0 },
]

const sampleTopics = `Ex:
1. Direito Constitucional
1.1 Direitos e Garantias Fundamentais
1.2 Organização do Estado
2. Língua Portuguesa...`

export default function PlanoEstudosPage() {
  const [planGenerated, setPlanGenerated] = useState(true)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
          <Sparkles className="h-4 w-4" />
          Inteligência Artificial
        </div>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground">
          Plano de Estudos com IA
        </h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          Faça upload do seu edital ou cole os tópicos. Nossa IA estruturará um cronograma otimizado, distribuindo disciplinas com base na complexidade e tempo disponível.
        </p>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* PDF Upload */}
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/30 p-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-secondary">
                <FileText className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                Arraste seu Edital (PDF)
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                ou clique para selecionar o arquivo no seu computador
              </p>
              <Button variant="outline" className="mt-4 border-border">
                Procurar Arquivo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Text Input */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              <ListIcon className="h-4 w-4 text-muted-foreground" />
              Colar Texto / Tópicos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={sampleTopics}
              className="min-h-[200px] bg-secondary border-border resize-none"
            />
          </CardContent>
        </Card>
      </div>

      {/* Settings */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex items-end gap-6">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Horas Diárias</Label>
              <Input
                type="text"
                defaultValue="4 horas"
                className="w-32 bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Data da Prova</Label>
              <div className="relative">
                <Input
                  type="date"
                  className="w-40 bg-secondary border-border"
                />
              </div>
            </div>
            <div className="flex-1" />
            <Button className="gap-2 bg-[oklch(0.72_0.19_155)] hover:bg-[oklch(0.72_0.19_155)]/90 text-[oklch(0.15_0_0)]">
              <Sparkles className="h-4 w-4" />
              Gerar Plano com IA
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Visão Gerada (Exemplo)
          </span>
        </div>
      </div>

      {/* Generated Plan Preview */}
      {planGenerated && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <Card className="bg-card border-border">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                  <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tempo Estimado</p>
                  <p className="text-3xl font-bold text-foreground">450h</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                  <CheckCircle className="h-6 w-6 text-[oklch(0.72_0.19_155)]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tópicos Mapeados</p>
                  <p className="text-3xl font-bold text-foreground">124</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Progresso Total Previsto</p>
                  <span className="text-sm font-medium text-[oklch(0.72_0.19_155)]">0%</span>
                </div>
                <Progress value={0} className="mt-3 h-2" />
              </CardContent>
            </Card>
          </div>

          {/* Weekly Roadmap */}
          <div className="grid grid-cols-3 gap-6">
            <Card className="col-span-2 bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                  Roadmap Semanal
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Badge variant="secondary" className="bg-secondary text-foreground">
                    Semana 1
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-muted-foreground" />
                    <span className="text-sm text-muted-foreground">A Estudar</span>
                    <span className="text-sm font-medium text-foreground">5</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                    <span className="text-sm text-muted-foreground">Em Foco</span>
                    <span className="text-sm font-medium text-foreground">1</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-[oklch(0.72_0.19_155)]" />
                    <span className="text-sm text-muted-foreground">Concluído</span>
                    <span className="text-sm font-medium text-foreground">0</span>
                  </div>
                </div>

                {/* Roadmap Bars */}
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <span className="w-32 text-sm text-foreground">Direito Constitucional</span>
                    <div className="flex-1 h-6 rounded bg-warning/60" />
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="w-32 text-sm text-foreground">Português</span>
                    <div className="flex-1 h-6 rounded bg-primary/60 max-w-[60%]" />
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="w-32 text-sm text-foreground">Matemática</span>
                    <div className="flex-1 h-6 rounded bg-[oklch(0.72_0.19_155)]/60 max-w-[40%]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Calendar */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-medium">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Intensidade Sugerida
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((day, i) => (
                    <div key={i} className="text-center">
                      <span className="text-xs text-muted-foreground">{day}</span>
                    </div>
                  ))}
                  {weekDays.map((_, i) => (
                    <div
                      key={i}
                      className={`h-8 rounded ${
                        i === 0 || i === 6
                          ? "bg-secondary"
                          : i === 4
                          ? "bg-primary"
                          : "bg-warning/60"
                      }`}
                    />
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Menos intenso</span>
                  <div className="flex gap-1">
                    <div className="h-3 w-3 rounded bg-secondary" />
                    <div className="h-3 w-3 rounded bg-warning/40" />
                    <div className="h-3 w-3 rounded bg-warning/60" />
                    <div className="h-3 w-3 rounded bg-primary/80" />
                    <div className="h-3 w-3 rounded bg-primary" />
                  </div>
                  <span>Mais intenso</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

function ListIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
  )
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  )
}
