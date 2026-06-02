import { ComingSoonPage } from '@/components/app/coming-soon-page'

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <ComingSoonPage
          title="Privacidade"
          description="A política de privacidade será publicada em breve."
          backHref="/login"
          backLabel="Ir para login"
        />
      </div>
    </div>
  )
}
