'use client'

import { ComingSoonPage } from '@/components/app/coming-soon-page'
import { CanView } from '@/components/auth/can-view'

export default function AdminConfiguracoesPage() {
  return (
    <CanView view="admin.settings" fallback={<p>Sem permissão.</p>}>
      <ComingSoonPage
        title="Configurações"
        description="Configurações globais da plataforma em desenvolvimento."
        backHref="/admin"
      />
    </CanView>
  )
}
