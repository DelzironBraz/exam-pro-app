'use client'

import { ComingSoonPage } from '@/components/app/coming-soon-page'
import { CanView } from '@/components/auth/can-view'

export default function ComentariosAiPage() {
  return (
    <CanView view="admin.dashboard" fallback={<p>Sem permissão.</p>}>
      <ComingSoonPage
        title="Comentários AI"
        description="Gestão de feedback e comentários gerados por IA ainda não está disponível."
        backHref="/admin"
      />
    </CanView>
  )
}
