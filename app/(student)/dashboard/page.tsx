"use client"

import { useMemo } from "react"
import { TrendingUp, Play, Clock, CheckCircle, Target, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Spinner } from "@/components/ui/spinner"
import { CanView } from "@/components/auth/can-view"
import { useAuth } from "@/hooks/use-auth"
import { useDashboardAnalytics } from "@/hooks/use-analytics"
import { useStudyPlansList } from "@/hooks/use-study-plans"
import { useMyExamAttempts } from "@/hooks/use-exams"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

const performanceData = [
  { week: "Sem 1", score: 65 },
  { week: "Sem 2", score: 72 },
  { week: "Sem 3", score: 68 },
  { week: "Sem 4", score: 85 },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const { data: analytics, loading: analyticsLoading, error: analyticsError } = useDashboardAnalytics()
  const { items: studyPlans } = useStudyPlansList()
  const { items: examAttempts } = useMyExamAttempts()

  const accuracyPercent = useMemo(
    () => (analytics ? Math.round(analytics.accuracy * 100) : 0),
    [analytics]
  )

  const studyPlanTasks = useMemo(() => {
    const plan = studyPlans?.[0]
    if (!plan?.items?.length) return []
    return plan.items.slice(0, 3).map((item) => ({
      id: item.id,
      subject: plan.title,
      task: item.title,
      duration: item.estimatedHours ? `${item.estimatedHours}h` : null,
      completed: item.completed,
    }))
  }, [studyPlans])

  const recentExams = useMemo(() => {
    if (!examAttempts?.length) return []
    return examAttempts
      .filter((a) => a.finishedAt)
      .slice(0, 2)
      .map((a) => ({
        id: a.id,
        title: `Prova ${a.examId.slice(0, 8)}`,
        score: `${a.totalCorrect}/${a.totalQuestions}`,
        percentage: `${Math.round((a.totalCorrect / Math.max(a.totalQuestions, 1)) * 100)}%`,
        daysAgo: new Date(a.finishedAt!).toLocaleDateString('pt-BR'),
      }))
  }, [examAttempts])

  const weakTopics = analytics?.weakTopics ?? []

  return (
    <CanView view="student.dashboard" fallback={<p className="text-muted-foreground">Sem permissão para este painel.</p>}>
    <div className="space-y-6">
      {analyticsError && (
        <p className="text-sm text-destructive">{analyticsError}</p>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Bom dia, {user?.name?.split(' ')[0] ?? 'estudante'}!
          </h1>
          <div className="mt-2 flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4 text-primary" />
            {analyticsLoading ? (
              <Spinner className="h-4 w-4" />
            ) : (
            <span>
              Taxa de acerto geral: <span className="font-semibold text-primary">{accuracyPercent}%</span>
              {analytics?.recommendations?.[0] && ` — ${analytics.recommendations[0]}`}
            </span>
            )}
          </div>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Play className="h-4 w-4" />
          Continuar Estudos
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Progresso Geral</p>
                <p className="mt-2 text-4xl font-bold text-foreground">{accuracyPercent}%</p>
              </div>
              <div className="relative h-16 w-16">
                <svg className="h-16 w-16 -rotate-90 transform">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    className="text-secondary"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={`${accuracyPercent * 1.76} ${176}`}
                    className="text-primary"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Tempo Médio</p>
                <p className="mt-2 text-4xl font-bold text-foreground">
                  {analytics ? Math.round(analytics.averageTime) : 0}{' '}
                  <span className="text-lg font-normal text-muted-foreground">s</span>
                </p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Questões Resolvidas</p>
                <p className="mt-2 text-4xl font-bold text-foreground">
                  {analytics?.totalQuestions?.toLocaleString('pt-BR') ?? '—'}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Taxa de Acerto</p>
                <p className="mt-2 text-4xl font-bold text-[oklch(0.72_0.19_155)]">{accuracyPercent}%</p>
              </div>
              <Target className="h-8 w-8 text-[oklch(0.72_0.19_155)]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Performance Chart */}
        <Card className="col-span-2 bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Gráfico de Desempenho</CardTitle>
            <Select defaultValue="4weeks">
              <SelectTrigger className="w-[160px] h-9 bg-secondary border-border">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4weeks">Últimas 4 semanas</SelectItem>
                <SelectItem value="month">Último mês</SelectItem>
                <SelectItem value="3months">Últimos 3 meses</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.65 0.2 280)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="oklch(0.65 0.2 280)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="week"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }}
                  />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.16 0.005 285)",
                      border: "1px solid oklch(0.28 0.005 285)",
                      borderRadius: "8px",
                      color: "oklch(0.95 0 0)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="oklch(0.65 0.2 280)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorScore)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Current Study Plan */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Plano de Estudo Atual</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {studyPlanTasks.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum plano de estudo ativo.</p>
            )}
            {studyPlanTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-3 rounded-lg border border-border bg-secondary/50 p-4"
              >
                <Checkbox
                  checked={task.completed}
                  className="mt-0.5 border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">{task.subject}</p>
                  <p className={`text-sm font-medium ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {task.task}
                  </p>
                  {task.duration && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {task.duration}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-3 gap-6">
        {/* Recent Exams */}
        <Card className="col-span-2 bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Últimas Provas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentExams.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhuma prova finalizada ainda.</p>
            )}
            {recentExams.map((exam) => (
              <div
                key={exam.id}
                className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                    <FileIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{exam.title}</p>
                    <p className="text-sm text-muted-foreground">{exam.daysAgo}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-[oklch(0.72_0.19_155)]">{exam.score}</p>
                  <p className="text-sm text-muted-foreground">{exam.percentage}</p>
                </div>
              </div>
            ))}
            <Button variant="link" className="w-full text-muted-foreground hover:text-foreground">
              Ver Histórico Completo
            </Button>
          </CardContent>
        </Card>

        {/* Recommended Questions */}
        <Card className="bg-[oklch(0.16_0.02_280)] border-[oklch(0.28_0.02_280)]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <SparklesIcon className="h-5 w-5 text-primary" />
              Questões Recomendadas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {weakTopics.length > 0 ? (
                <>
                  Pontos de melhoria:{' '}
                  <span className="font-medium text-foreground">{weakTopics.join(', ')}</span>
                </>
              ) : (
                'Continue praticando para receber recomendações personalizadas.'
              )}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {weakTopics.slice(0, 2).map((topic) => (
                <div key={topic} className="rounded-lg border border-border bg-card p-3">
                  <p className="text-xs text-[oklch(0.72_0.19_155)]">Tópico fraco</p>
                  <p className="mt-1 text-sm font-medium text-foreground">{topic}</p>
                  <Button variant="link" className="mt-2 h-auto p-0 text-xs text-primary hover:text-primary/80" asChild>
                    <a href="/questoes">Iniciar →</a>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </CanView>
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

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  )
}
