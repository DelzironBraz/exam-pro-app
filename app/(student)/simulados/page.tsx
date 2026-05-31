"use client"

import { useState } from "react"
import Link from "next/link"
import { Clock, FileText, Play, Plus, Filter, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const mockSimulados = [
  {
    id: 1,
    title: "Simulado Nacional TRT - 2024",
    questions: 100,
    duration: "4h",
    difficulty: "Difícil",
    disciplines: ["Direito do Trabalho", "Direito Processual", "Português"],
    participants: 2340,
    avgScore: 72,
  },
  {
    id: 2,
    title: "Prova PF - Conhecimentos Específicos",
    questions: 80,
    duration: "3h",
    difficulty: "Médio",
    disciplines: ["Direito Penal", "Direito Constitucional", "Informática"],
    participants: 5621,
    avgScore: 68,
  },
  {
    id: 3,
    title: "Simulado INSS - Técnico",
    questions: 60,
    duration: "2h30",
    difficulty: "Fácil",
    disciplines: ["Direito Previdenciário", "Português", "Raciocínio Lógico"],
    participants: 8934,
    avgScore: 75,
  },
  {
    id: 4,
    title: "Auditor Fiscal - Receita Federal",
    questions: 120,
    duration: "5h",
    difficulty: "Difícil",
    disciplines: ["Direito Tributário", "Contabilidade", "Economia"],
    participants: 1256,
    avgScore: 64,
  },
]

const difficultyColors: Record<string, string> = {
  "Fácil": "bg-[oklch(0.72_0.19_155)]/20 text-[oklch(0.72_0.19_155)]",
  "Médio": "bg-warning/20 text-warning",
  "Difícil": "bg-destructive/20 text-destructive",
}

export default function SimuladosPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Simulados</h1>
          <p className="mt-1 text-muted-foreground">
            Pratique com simulados completos e acompanhe seu desempenho
          </p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Criar Simulado Personalizado
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar simulados..."
            className="pl-10 bg-secondary border-border"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px] bg-secondary border-border">
            <SelectValue placeholder="Dificuldade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="easy">Fácil</SelectItem>
            <SelectItem value="medium">Médio</SelectItem>
            <SelectItem value="hard">Difícil</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px] bg-secondary border-border">
            <SelectValue placeholder="Disciplina" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="direito">Direito</SelectItem>
            <SelectItem value="portugues">Português</SelectItem>
            <SelectItem value="matematica">Matemática</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" className="border-border">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Simulados Grid */}
      <div className="grid grid-cols-2 gap-6">
        {mockSimulados.map((simulado) => (
          <Card key={simulado.id} className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg font-semibold text-foreground">
                  {simulado.title}
                </CardTitle>
                <Badge className={difficultyColors[simulado.difficulty]}>
                  {simulado.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stats */}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>{simulado.questions} questões</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{simulado.duration}</span>
                </div>
              </div>

              {/* Disciplines */}
              <div className="flex flex-wrap gap-2">
                {simulado.disciplines.map((disc) => (
                  <Badge key={disc} variant="secondary" className="bg-secondary text-muted-foreground">
                    {disc}
                  </Badge>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{simulado.participants.toLocaleString()}</span> participantes
                  <span className="mx-2">•</span>
                  Média: <span className="font-medium text-foreground">{simulado.avgScore}%</span>
                </div>
                <Link href={`/simulado/${simulado.id}`}>
                  <Button className="gap-2 bg-primary hover:bg-primary/90">
                    <Play className="h-4 w-4" />
                    Iniciar
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
