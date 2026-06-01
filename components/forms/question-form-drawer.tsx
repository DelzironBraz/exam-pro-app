'use client'

import { useState } from 'react'
import { questionsApi } from '@/lib/api/axios'
import { getApiErrorMessage } from '@/lib/api/client'
import { invalidateNamespaces } from '@/lib/api/invalidate'
import { FormDrawer } from '@/components/app/form-drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSelectedGroup } from '@/hooks/use-selected-group'
import { Plus, Trash2 } from 'lucide-react'

interface Alt {
  label: string
  content: string
  isCorrect: boolean
}

interface QuestionFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const defaultAlts: Alt[] = [
  { label: 'A', content: '', isCorrect: false },
  { label: 'B', content: '', isCorrect: true },
]

export function QuestionFormDrawer({ open, onOpenChange, onSuccess }: QuestionFormDrawerProps) {
  const { groupId } = useSelectedGroup()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [statement, setStatement] = useState('')
  const [discipline, setDiscipline] = useState('')
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const [explanation, setExplanation] = useState('')
  const [tags, setTags] = useState('')
  const [alternatives, setAlternatives] = useState<Alt[]>(defaultAlts)

  const setCorrect = (index: number) => {
    setAlternatives((alts) =>
      alts.map((a, i) => ({ ...a, isCorrect: i === index }))
    )
  }

  const handleSubmit = async () => {
    if (!groupId) {
      setError('Selecione um grupo antes de criar a questão.')
      return
    }
    const correctCount = alternatives.filter((a) => a.isCorrect).length
    if (alternatives.length < 2) {
      setError('Informe pelo menos 2 alternativas.')
      return
    }
    if (correctCount !== 1) {
      setError('Marque exatamente uma alternativa como correta.')
      return
    }
    const labels = alternatives.map((a) => a.label.trim())
    if (new Set(labels).size !== labels.length) {
      setError('Labels das alternativas devem ser únicos.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await questionsApi.create({
        statement,
        groupId,
        discipline: discipline || undefined,
        topic: topic || undefined,
        difficulty,
        explanation: explanation || undefined,
        alternatives,
        tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
      })
      invalidateNamespaces('questions')
      onOpenChange(false)
      onSuccess?.()
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <FormDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Nova questão"
      description="Alternativas: marque uma como correta."
      onSubmit={handleSubmit}
      loading={loading}
      wide
    >
      <div className="space-y-4">
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="space-y-2">
          <Label>Enunciado</Label>
          <Textarea value={statement} onChange={(e) => setStatement(e.target.value)} required rows={4} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Disciplina</Label>
            <Input value={discipline} onChange={(e) => setDiscipline(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Tópico</Label>
            <Input value={topic} onChange={(e) => setTopic(e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Dificuldade</Label>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Fácil</SelectItem>
              <SelectItem value="medium">Médio</SelectItem>
              <SelectItem value="hard">Difícil</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Explicação</Label>
          <Textarea value={explanation} onChange={(e) => setExplanation(e.target.value)} rows={2} />
        </div>
        <div className="space-y-2">
          <Label>Tags</Label>
          <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="enem, matematica" />
        </div>
        <div className="space-y-3">
          <Label>Alternativas</Label>
          {alternatives.map((alt, i) => (
            <div key={i} className="flex gap-2 items-start">
              <Input
                className="w-12"
                value={alt.label}
                onChange={(e) => {
                  const next = [...alternatives]
                  next[i] = { ...alt, label: e.target.value }
                  setAlternatives(next)
                }}
              />
              <Input
                className="flex-1"
                placeholder="Texto da alternativa"
                value={alt.content}
                onChange={(e) => {
                  const next = [...alternatives]
                  next[i] = { ...alt, content: e.target.value }
                  setAlternatives(next)
                }}
              />
              <Button type="button" size="sm" variant={alt.isCorrect ? 'default' : 'outline'} onClick={() => setCorrect(i)}>
                ✓
              </Button>
              {alternatives.length > 2 && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => setAlternatives(alternatives.filter((_, j) => j !== i))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setAlternatives([
                ...alternatives,
                { label: String.fromCharCode(65 + alternatives.length), content: '', isCorrect: false },
              ])
            }
          >
            <Plus className="h-4 w-4 mr-1" /> Alternativa
          </Button>
        </div>
      </div>
    </FormDrawer>
  )
}
