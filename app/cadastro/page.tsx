'use client'

import { GuestGuard } from '@/components/auth/guest-guard'
import { ComingSoonPage } from '@/components/app/coming-soon-page'
import { ThemeToggle } from '@/components/layout/theme-toggle'

export default function CadastroPage() {
  return (
    <GuestGuard>
      <div className="min-h-screen bg-background">
        <div className="absolute right-6 top-6">
          <ThemeToggle />
        </div>
        <div className="mx-auto max-w-2xl px-6 py-16">
          <ComingSoonPage
            title="Cadastro"
            description="O fluxo de criação de conta ainda não está disponível. Use o login com uma conta existente."
            backHref="/login"
            backLabel="Ir para login"
          />
        </div>
      </div>
    </GuestGuard>
  )
}
