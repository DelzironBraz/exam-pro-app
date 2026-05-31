import type { QuestionDifficulty } from '@/lib/api/types'

export const DIFFICULTY_LABELS: Record<QuestionDifficulty, string> = {
  easy: 'Fácil',
  medium: 'Médio',
  hard: 'Difícil',
}

export const GROUP_TYPES = [
  { value: 'contest', label: 'Concurso' },
  { value: 'technology', label: 'Tecnologia' },
  { value: 'language', label: 'Idioma' },
  { value: 'custom', label: 'Personalizado' },
] as const

export const GROUP_VISIBILITIES = [
  { value: 'public', label: 'Público' },
  { value: 'private', label: 'Privado' },
] as const
