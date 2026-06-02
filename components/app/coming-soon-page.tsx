'use client'

import Link from 'next/link'
import { Construction, ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/components/app/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getDefaultHomePath } from '@/lib/permissions/rules'
import { useAuth } from '@/hooks/use-auth'

export interface ComingSoonPageProps {
  title: string
  description?: string
  backHref?: string
  backLabel?: string
}

export function ComingSoonPage({
  title,
  description = 'Esta área ainda não está disponível. Estamos trabalhando nela.',
  backHref,
  backLabel = 'Voltar',
}: ComingSoonPageProps) {
  const { user } = useAuth()
  const home = backHref ?? getDefaultHomePath(user?.role ?? null)

  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />
      <Card className="border-border border-dashed">
        <CardContent className="flex flex-col items-center justify-center gap-6 py-16 px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <Construction className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="max-w-md space-y-2">
            <h2 className="text-xl font-semibold">Ainda não existe</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <Button asChild variant="outline" className="gap-2">
            <Link href={home}>
              <ArrowLeft className="h-4 w-4" />
              {backLabel}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
