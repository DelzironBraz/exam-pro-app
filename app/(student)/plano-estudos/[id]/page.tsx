'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'
import { useStudyPlanDetail } from '@/hooks/use-study-plans'
import { FormDrawer } from '@/components/app/form-drawer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/ui/spinner'
import { Progress } from '@/components/ui/progress'
import { studyPlansApi } from '@/lib/api/axios'
import { getApiErrorMessage } from '@/lib/api/client'
import { invalidateNamespaces } from '@/lib/api/invalidate'

export default function PlanoDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: plan, loading, error, refetch } = useStudyPlanDetail(id)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [itemLoading, setItemLoading] = useState(false)
  const [itemError, setItemError] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [hours, setHours] = useState('2')

  const addItem = async () => {
    setItemLoading(true)
    setItemError(null)
    try {
      await studyPlansApi.addItem(id, {
        title,
        description: description || undefined,
        estimatedHours: Number(hours),
      })
      invalidateNamespaces('study-plans')
      setDrawerOpen(false)
      refetch(true)
    } catch (err) {
      setItemError(getApiErrorMessage(err))
    } finally {
      setItemLoading(false)
    }
  }

  const completeItem = async (itemId: string) => {
    await studyPlansApi.completeItem(itemId)
    invalidateNamespaces('study-plans')
    refetch(true)
  }

  if (loading) return <div className="flex justify-center p-12"><Spinner className="h-8 w-8" /></div>
  if (error || !plan) return <p className="text-destructive">{error ?? 'Plano não encontrado'}</p>

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" asChild>
        <Link href="/plano-estudos"><ArrowLeft className="h-4 w-4 mr-2" /> Voltar</Link>
      </Button>
      <h1 className="text-2xl font-bold">{plan.title}</h1>
      {plan.progress && (
        <Progress value={plan.progress.completionPercent} className="h-2" />
      )}
      <Button onClick={() => setDrawerOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" /> Adicionar item
      </Button>
      <div className="space-y-2">
        {(plan.items ?? []).map((item) => (
          <Card key={item.id} className="border-border">
            <CardContent className="p-4 flex gap-3 items-start">
              <Checkbox
                checked={item.completed}
                onCheckedChange={() => !item.completed && completeItem(item.id)}
              />
              <div className="flex-1">
                <p className={item.completed ? 'line-through text-muted-foreground' : 'font-medium'}>
                  {item.title}
                </p>
                {item.description && (
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">{item.estimatedHours}h estimadas</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <FormDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title="Novo item"
        onSubmit={addItem}
        loading={itemLoading}
      >
        {itemError && <p className="text-sm text-destructive mb-2">{itemError}</p>}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Título</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Horas estimadas</Label>
            <Input type="number" value={hours} onChange={(e) => setHours(e.target.value)} />
          </div>
        </div>
      </FormDrawer>
    </div>
  )
}
