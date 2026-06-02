import { ComingSoonPage } from '@/components/app/coming-soon-page'

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <ComingSoonPage
          title="Termos de uso"
          description="Os termos de uso da plataforma serão publicados em breve."
          backHref="/login"
          backLabel="Ir para login"
        />
      </div>
    </div>
  )
}
