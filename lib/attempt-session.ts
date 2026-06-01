export type AttemptType = 'simulation' | 'exam'

export interface StoredAnswer {
  alternativeId: string
  timeSpentSeconds: number
  isCorrect?: boolean
}

export interface StoredAttempt {
  type: AttemptType
  resourceId: string
  attemptId: string
  startedAt: string
  durationMinutes?: number
  timerMode?: 'fixed' | 'free'
  totalQuestions: number
  questionIds: string[]
  answers: Record<string, StoredAnswer>
  currentIndex: number
}

function key(type: AttemptType, resourceId: string) {
  return `ow_attempt_${type}_${resourceId}`
}

export function saveAttempt(attempt: StoredAttempt): void {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(key(attempt.type, attempt.resourceId), JSON.stringify(attempt))
}

export function loadAttempt(type: AttemptType, resourceId: string): StoredAttempt | null {
  if (typeof window === 'undefined') return null
  const raw = sessionStorage.getItem(key(type, resourceId))
  if (!raw) return null
  try {
    return JSON.parse(raw) as StoredAttempt
  } catch {
    return null
  }
}

export function clearAttempt(type: AttemptType, resourceId: string): void {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(key(type, resourceId))
}
