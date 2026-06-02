"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Lightbulb, BarChart3, Eye, EyeOff } from "lucide-react"
import { useAuthLogin } from "@/hooks/use-auth"
import { GuestGuard } from "@/components/auth/guest-guard"
import { ThemeToggle } from "@/components/layout/theme-toggle"

function LoginForm() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") ?? undefined
  const { submit, loading, error } = useAuthLogin()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState<"email" | "password">("email")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step === "email" && email) {
      setStep("password")
      return
    }
    if (step === "password" && password) {
      await submit(email, password, redirect)
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex w-full flex-col justify-between bg-background p-8 lg:w-1/2 lg:p-12">
        <div className="flex flex-col">
          <div className="mb-12 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-xs">
                OW
              </div>
            </div>
            <span className="text-xl font-semibold text-foreground">Offensive World</span>
          </div>

          <div className="max-w-sm">
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
              Entre na sua conta
            </h1>
            <p className="mb-8 text-muted-foreground">
              Ainda não tem uma conta?{" "}
              <Link href="/cadastro" className="font-medium text-primary hover:underline">
                Cadastre-se
              </Link>
            </p>

            <div className="my-8 flex items-center gap-4">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">Email e senha</span>
              <Separator className="flex-1" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-muted-foreground">
                  Endereço de Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nome@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-secondary/50 border-border"
                  required
                  autoComplete="email"
                />
              </div>

              {step === "password" && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm text-muted-foreground">
                    Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 bg-secondary/50 border-border pr-10"
                      required
                      autoComplete="current-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button
                type="submit"
                className="h-12 w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                disabled={loading}
              >
                {loading ? (
                  <Spinner className="h-4 w-4" />
                ) : step === "email" ? (
                  "Próximo"
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>v0.1.0</span>
            <ThemeToggle />
          </div>
          <div className="flex gap-6">
            <Link href="/privacidade" className="hover:text-foreground transition-colors">
              Privacidade
            </Link>
            <Link href="/termos" className="hover:text-foreground transition-colors">
              Termos
            </Link>
          </div>
        </div>
      </div>

      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5" />
        <div className="relative flex h-full flex-col items-center justify-center p-12">
          <div className="max-w-md text-center">
            <div className="mb-8 inline-flex items-center rounded-full bg-primary/20 px-4 py-2 text-sm font-medium text-primary">
              INTELIGENCIA ARTIFICIAL
            </div>
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
              Prepare-se com Inteligencia
            </h2>
            <p className="mb-10 text-lg text-muted-foreground leading-relaxed">
              A plataforma definitiva para conquistar sua aprovacao com IA e simulados reais.
            </p>
            <div className="flex items-center justify-center gap-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                  <Lightbulb className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">Feedback por IA</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">Analise Preditiva</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <GuestGuard>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <Spinner className="h-8 w-8" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </GuestGuard>
  )
}
