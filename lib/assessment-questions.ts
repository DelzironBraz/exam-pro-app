import { examsApi, simulationsApi } from '@/lib/api/axios'
import { normalizePaginated } from '@/lib/pagination'
import type { AssessmentQuestionListItem, Paginated } from '@/lib/api/types'
import { MAX_LIMIT } from '@/lib/pagination'

type ListQuestionsFn = (params: {
  page: number
  limit: number
  attemptId?: string
}) => Promise<{ data: unknown }>

/** Carrega todas as páginas de questões da prova/simulado. */
export async function fetchAllAssessmentQuestions(
  listQuestions: ListQuestionsFn,
  attemptId?: string
): Promise<AssessmentQuestionListItem[]> {
  const limit = MAX_LIMIT
  let page = 1
  let totalPages = 1
  const all: AssessmentQuestionListItem[] = []

  while (page <= totalPages) {
    const { data } = await listQuestions({ page, limit, attemptId })
    const result = normalizePaginated<AssessmentQuestionListItem>(data, limit)
    all.push(...result.items)
    totalPages = result.totalPages
    page += 1
  }

  return all.sort((a, b) => a.sortOrder - b.sortOrder)
}

export function createExamQuestionsFetcher(examId: string): ListQuestionsFn {
  return (params) => examsApi.listQuestions(examId, params)
}

export function createSimulationQuestionsFetcher(simulationId: string): ListQuestionsFn {
  return (params) => simulationsApi.listQuestions(simulationId, params)
}

export function mergeAssessmentItemsWithAnswers(
  items: AssessmentQuestionListItem[],
  answers: Record<string, { alternativeId: string; timeSpentSeconds: number; isCorrect?: boolean }>
): AssessmentQuestionListItem[] {
  return items.map((item) => {
    const saved = answers[item.question.id]
    if (!saved) return item
    return {
      ...item,
      answered: true,
      selectedAlternativeId: saved.alternativeId,
    }
  })
}
