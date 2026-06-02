'use client'

import { ComingSoonPage } from '@/components/app/coming-soon-page'
import { CanView } from '@/components/auth/can-view'

export default function ConfiguracoesPage() {
  return (
    <CanView view="student.settings" fallback={<p>Sem permissão.</p>}>
      <ComingSoonPage
        title="Configurações"
        description="Preferências da conta, notificações e privacidade estarão disponíveis em breve."
        backHref="/dashboard"
      />
    </CanView>
  )
}
