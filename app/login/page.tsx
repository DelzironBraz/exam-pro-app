"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Lightbulb, BarChart3, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState<"email" | "password">("email");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (step === "email" && email) {
            setStep("password");
        } else if (step === "password" && password) {
            router.push("/dashboard");
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Left Side - Login Form */}
            <div className="flex w-full flex-col justify-between bg-background p-8 lg:w-1/2 lg:p-12">
                <div className="flex flex-col">
                    {/* Logo */}
                    <div className="mb-12 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-xs">
                                E
                            </div>
                        </div>
                        <span className="text-xl font-semibold text-foreground">
                            ExamPro
                        </span>
                    </div>

                    {/* Form Content */}
                    <div className="max-w-sm">
                        <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
                            Entre na sua conta
                        </h1>
                        <p className="mb-8 text-muted-foreground">
                            Ainda não tem uma conta?{" "}
                            <Link
                                href="/cadastro"
                                className="font-medium text-primary hover:underline"
                            >
                                Cadastre-se
                            </Link>
                        </p>

                        {/* OAuth Buttons */}
                        <div className="space-y-3">
                            <Button
                                variant="outline"
                                className="w-full justify-center gap-3 bg-secondary/50 border-border hover:bg-secondary"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Continuar com Google
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full justify-center gap-3 bg-secondary/50 border-border hover:bg-secondary"
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                                Continuar com GitHub
                            </Button>
                        </div>

                        {/* Divider */}
                        <div className="my-8 flex items-center gap-4">
                            <Separator className="flex-1" />
                            <span className="text-xs text-muted-foreground">
                                Ou com email e senha
                            </span>
                            <Separator className="flex-1" />
                        </div>

                        {/* Email/Password Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="text-sm text-muted-foreground"
                                >
                                    Endereço de Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="nome@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-12 bg-secondary/50 border-border"
                                />
                            </div>

                            {step === "password" && (
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="password"
                                        className="text-sm text-muted-foreground"
                                    >
                                        Senha
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Digite sua senha"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            className="h-12 bg-secondary/50 border-border pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="h-12 w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                            >
                                {step === "email" ? "Próximo" : "Entrar"}
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 flex items-center justify-between text-sm text-muted-foreground">
                    <span>v4.12.0</span>
                    <div className="flex gap-6">
                        <Link
                            href="/privacidade"
                            className="hover:text-foreground transition-colors"
                        >
                            Privacidade
                        </Link>
                        <Link
                            href="/termos"
                            className="hover:text-foreground transition-colors"
                        >
                            Termos
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Side - Hero */}
            <div className="relative hidden w-1/2 overflow-hidden lg:block">
                {/* Background with gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5" />

                {/* Grid pattern overlay */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `linear-gradient(rgba(var(--primary), 0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(var(--primary), 0.1) 1px, transparent 1px)`,
                        backgroundSize: "60px 60px",
                    }}
                />

                {/* Radial glow effect */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent" />

                {/* Content */}
                <div className="relative flex h-full flex-col items-center justify-center p-12">
                    <div className="max-w-md text-center">
                        {/* Badge */}
                        <div className="mb-8 inline-flex items-center rounded-full bg-primary/20 px-4 py-2 text-sm font-medium text-primary">
                            INTELIGENCIA ARTIFICIAL
                        </div>

                        {/* Main Heading */}
                        <h2 className="mb-6 text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
                            Prepare-se com Inteligencia
                        </h2>

                        {/* Description */}
                        <p className="mb-10 text-lg text-muted-foreground leading-relaxed">
                            A plataforma definitiva para conquistar sua
                            aprovacao com IA e simulados reais. Analisamos seu
                            desempenho para criar o caminho mais rapido ate o
                            sucesso.
                        </p>

                        {/* Features */}
                        <div className="flex items-center justify-center gap-8">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                                    <Lightbulb className="h-5 w-5 text-primary" />
                                </div>
                                <span className="text-sm font-medium text-foreground">
                                    Feedback por IA
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                                    <BarChart3 className="h-5 w-5 text-primary" />
                                </div>
                                <span className="text-sm font-medium text-foreground">
                                    Analise Preditiva
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Status */}
                <div className="absolute bottom-6 right-6">
                    <div className="flex items-center gap-2 rounded-full bg-card/80 backdrop-blur-sm px-4 py-2 text-sm">
                        <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-muted-foreground">
                            System Status:
                        </span>
                        <span className="font-medium text-foreground">
                            Optimal
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
