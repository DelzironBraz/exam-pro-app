"use client"

import { TrendingUp, Plus, ChevronRight, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

const usageData = [
  { day: "Seg", value: 65 },
  { day: "Ter", value: 75 },
  { day: "Qua", value: 85 },
  { day: "Qui", value: 70 },
  { day: "Sex", value: 95 },
  { day: "Sáb", value: 80 },
  { day: "Dom", value: 60 },
]

const mostMissedQuestions = [
  { id: "#Q-8492", discipline: "Direito Constitucional", errorRate: "82%" },
  { id: "#Q-1102", discipline: "Matemática Financeira", errorRate: "78%" },
  { id: "#Q-5531", discipline: "Língua Portuguesa", errorRate: "65%" },
  { id: "#Q-9920", discipline: "Informática", errorRate: "61%" },
]

const parserLogs = [
  { filename: "PDF_TRE_2023_v2.pdf", status: "success", message: "Processed: 120 questions parsed." },
  { filename: "Simulado_INSS_04.pdf", status: "success", message: "Processed: 50 questions parsed." },
  { filename: "Apostila_Geral_scan.pdf", status: "error", message: "Failed: OCR unreadable text detected." },
]

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Admin</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Dashboard</span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Users</p>
              <Badge className="bg-[oklch(0.72_0.19_155)]/20 text-[oklch(0.72_0.19_155)]">
                <TrendingUp className="mr-1 h-3 w-3" />
                +12.5%
              </Badge>
            </div>
            <p className="mt-2 text-4xl font-bold text-foreground">42,891</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Questions</p>
            <p className="mt-2 text-4xl font-bold text-foreground">154K</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Exams</p>
            <p className="mt-2 text-4xl font-bold text-foreground">3,402</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Platform Growth</p>
            <div className="mt-2 flex gap-1">
              {[40, 60, 80, 90].map((h, i) => (
                <div
                  key={i}
                  className="w-8 rounded bg-primary/60"
                  style={{ height: `${h * 0.4}px` }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Most Missed Questions */}
        <Card className="col-span-2 bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Questões mais erradas</CardTitle>
            <Button variant="link" className="text-muted-foreground hover:text-foreground p-0 h-auto">
              Ver todas
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="grid grid-cols-3 gap-4 px-4 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <span>ID Questão</span>
                <span>Disciplina</span>
                <span className="text-right">Taxa Erro</span>
              </div>
              {mostMissedQuestions.map((q) => (
                <div
                  key={q.id}
                  className="grid grid-cols-3 gap-4 rounded-lg px-4 py-3 hover:bg-secondary/50 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground">{q.id}</span>
                  <span className="text-sm text-muted-foreground">{q.discipline}</span>
                  <span className="text-sm text-right font-medium text-destructive">{q.errorRate}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Parser Logs */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Logs Parser AI</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
              <Plus className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {parserLogs.map((log, i) => (
              <div
                key={i}
                className={`rounded-lg border p-3 ${
                  log.status === "success"
                    ? "border-[oklch(0.72_0.19_155)]/30 bg-[oklch(0.72_0.19_155)]/5"
                    : "border-destructive/30 bg-destructive/5"
                }`}
              >
                <div className="flex items-center gap-2">
                  {log.status === "success" ? (
                    <CheckCircle className="h-4 w-4 text-[oklch(0.72_0.19_155)]" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  )}
                  <span className="text-sm font-medium text-foreground">{log.filename}</span>
                </div>
                <p className={`mt-1 text-xs ${log.status === "success" ? "text-muted-foreground" : "text-destructive"}`}>
                  {log.message}
                </p>
              </div>
            ))}
            <Button variant="outline" className="w-full border-border text-muted-foreground">
              View All Logs
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-3 gap-6">
        {/* Daily Usage Chart */}
        <Card className="col-span-2 bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Uso diário</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={usageData}>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.16 0.005 285)",
                      border: "1px solid oklch(0.28 0.005 285)",
                      borderRadius: "8px",
                      color: "oklch(0.95 0 0)",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="oklch(0.65 0.2 280)"
                    radius={[4, 4, 0, 0]}
                    opacity={0.8}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Retention */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Retenção (M1)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24">
                <svg className="h-24 w-24 -rotate-90 transform">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-secondary"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${72 * 2.51} ${251}`}
                    className="text-primary"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-foreground">
                  72%
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Coorte: Setembro 2023</p>
                <p className="mt-1 text-sm font-medium text-[oklch(0.72_0.19_155)]">Saudável (+4% vs M-1)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
