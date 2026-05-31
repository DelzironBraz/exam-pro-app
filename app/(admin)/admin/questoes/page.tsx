"use client"

import { useMemo, useState } from "react"
import { CanView } from "@/components/auth/can-view"
import { useQuestionsList } from "@/hooks/use-questions"
import { Spinner } from "@/components/ui/spinner"
import { Download, Plus, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, X } from "lucide-react"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const mockQuestions = [
  {
    id: "#Q-8021",
    discipline: "Matemática",
    subject: "Análise Combinatória",
    difficulty: "Difícil",
    status: "Publicado",
    updatedAt: "Hoje, 14:30",
  },
  {
    id: "#Q-8020",
    discipline: "Física",
    subject: "Cinemática",
    difficulty: "Médio",
    status: "Publicado",
    updatedAt: "Ontem, 09:15",
  },
  {
    id: "#Q-8019",
    discipline: "Química",
    subject: "Estequiometria",
    difficulty: "Fácil",
    status: "Rascunho",
    updatedAt: "12 Mai, 2024",
  },
]

const previewQuestion = {
  id: "#Q-8021",
  discipline: "Matemática",
  tags: ["Análise Combinatória"],
  difficulty: "Difícil",
  statement: "Em um congresso de tecnologia, há 8 palestrantes convidados. O comitê organizador precisa formar uma mesa redonda com exatamente 5 desses palestrantes. Sabendo que os palestrantes A e B se recusam a participar da mesma mesa juntos, de quantas maneiras distintas essa mesa redonda pode ser formada?",
  options: [
    { letter: "A", text: "36 maneiras" },
    { letter: "B", text: "40 maneiras" },
    { letter: "C", text: "42 maneiras", correct: true },
    { letter: "D", text: "56 maneiras" },
  ],
  solution: "Total de formas de escolher 5 entre 8: C(8,5) = 56.\nTotal de formas em que A e B estão JUNTOS na mesa: Como A e B já estão escolhidos, restam 3 vagas para 6 palestrantes: C(6,3) = 20.\nPortanto, as formas onde eles NÃO estão juntos é o total menos as formas em que estão juntos: 56 - 20 = 36. Nota: A alternativa correta foi marcada erroneamente no gabarito provisório, requer revisão.",
}

const difficultyColors: Record<string, string> = {
  "Fácil": "bg-[oklch(0.72_0.19_155)]/20 text-[oklch(0.72_0.19_155)]",
  "Médio": "bg-warning/20 text-warning",
  "Difícil": "bg-destructive/20 text-destructive",
}

const statusColors: Record<string, string> = {
  "Publicado": "text-[oklch(0.72_0.19_155)]",
  "Rascunho": "text-muted-foreground",
}

const difficultyLabels: Record<string, string> = {
  easy: "Fácil",
  medium: "Médio",
  hard: "Difícil",
}

export default function AdminQuestoesPage() {
  const [selectedQuestion, setSelectedQuestion] = useState(previewQuestion)
  const [previewOpen, setPreviewOpen] = useState(true)
  const { data: questionsData, loading, error } = useQuestionsList()

  const apiQuestions = useMemo(() => questionsData?.items ?? [], [questionsData])

  return (
    <CanView view="admin.questions" fallback={<p className="text-muted-foreground">Acesso restrito a administradores.</p>}>
    <div className="flex gap-6">
      {error && <p className="text-sm text-destructive w-full">{error}</p>}
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Banco de Questões</h1>
            <p className="mt-1 text-muted-foreground">
              Gerencie, filtre e crie novo conteúdo para as provas.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2 border-border">
              <Download className="h-4 w-4" />
              Importar Lote
            </Button>
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              Nova Questão
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Select defaultValue="todas">
                <SelectTrigger className="w-[180px] bg-secondary border-border">
                  <SelectValue placeholder="Disciplina" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Disciplina: Todas</SelectItem>
                  <SelectItem value="matematica">Matemática</SelectItem>
                  <SelectItem value="portugues">Português</SelectItem>
                  <SelectItem value="fisica">Física</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="todas">
                <SelectTrigger className="w-[180px] bg-secondary border-border">
                  <SelectValue placeholder="Dificuldade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Dificuldade: Todas</SelectItem>
                  <SelectItem value="facil">Fácil</SelectItem>
                  <SelectItem value="medio">Médio</SelectItem>
                  <SelectItem value="dificil">Difícil</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="todos">
                <SelectTrigger className="w-[180px] bg-secondary border-border">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Status: Todos</SelectItem>
                  <SelectItem value="publicado">Publicado</SelectItem>
                  <SelectItem value="rascunho">Rascunho</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="ghost" size="icon" className="ml-auto text-muted-foreground">
                <FilterIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="bg-card border-border">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">ID</TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Disciplina / Assunto</TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Dificuldade</TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Atualizado em</TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Spinner className="mx-auto h-6 w-6" />
                  </TableCell>
                </TableRow>
              )}
              {!loading && apiQuestions.length > 0 && apiQuestions.map((question) => (
                <TableRow
                  key={question.id}
                  className="border-border cursor-pointer hover:bg-secondary/50"
                  onClick={() => setPreviewOpen(true)}
                >
                  <TableCell className="font-medium text-foreground">{question.id.slice(0, 8)}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{question.discipline ?? "—"}</p>
                      <p className="text-sm text-muted-foreground">{question.topic ?? question.statement.slice(0, 40)}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={difficultyColors[difficultyLabels[question.difficulty] ?? "Médio"] ?? ""}>
                      {difficultyLabels[question.difficulty] ?? question.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={statusColors["Publicado"]}>Publicado</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">—</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && apiQuestions.length === 0 && mockQuestions.map((question) => (
                <TableRow
                  key={question.id}
                  className="border-border cursor-pointer hover:bg-secondary/50"
                  onClick={() => setPreviewOpen(true)}
                >
                  <TableCell className="font-medium text-foreground">{question.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{question.discipline}</p>
                      <p className="text-sm text-muted-foreground">{question.subject}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={difficultyColors[question.difficulty]}>
                      {question.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${question.status === "Publicado" ? "bg-[oklch(0.72_0.19_155)]" : "bg-muted-foreground"}`} />
                      <span className={statusColors[question.status]}>{question.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{question.updatedAt}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Mostrando 1-3 de 1,204 questões
            </p>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Preview Panel */}
      {previewOpen && (
        <Card className="w-[420px] shrink-0 bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base font-medium">Preview: {selectedQuestion.id}</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
              onClick={() => setPreviewOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-secondary text-foreground">
                {selectedQuestion.discipline}
              </Badge>
              {selectedQuestion.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-secondary text-foreground">
                  {tag}
                </Badge>
              ))}
              <Badge className={difficultyColors[selectedQuestion.difficulty]}>
                {selectedQuestion.difficulty}
              </Badge>
            </div>

            {/* Statement */}
            <div className="rounded-lg bg-secondary/50 p-4">
              <p className="text-sm text-foreground leading-relaxed">{selectedQuestion.statement}</p>
            </div>

            {/* Options */}
            <div className="space-y-2">
              {selectedQuestion.options.map((option) => (
                <div
                  key={option.letter}
                  className={`flex items-center gap-3 rounded-lg border p-3 ${
                    option.correct
                      ? "border-[oklch(0.72_0.19_155)] bg-[oklch(0.72_0.19_155)]/10"
                      : "border-border bg-card"
                  }`}
                >
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                      option.correct
                        ? "bg-[oklch(0.72_0.19_155)] text-[oklch(0.15_0_0)]"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {option.letter}
                  </div>
                  <span className={`text-sm ${option.correct ? "text-[oklch(0.72_0.19_155)]" : "text-foreground"}`}>
                    {option.text}
                  </span>
                  {option.correct && (
                    <CheckIcon className="ml-auto h-4 w-4 text-[oklch(0.72_0.19_155)]" />
                  )}
                </div>
              ))}
            </div>

            {/* Solution */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                Resolução
              </p>
              <div className="rounded-lg bg-secondary/30 border border-border p-3">
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                  {selectedQuestion.solution}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1 border-border">
                Editar Questão
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
    </CanView>
  )
}

function FilterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
