'use client'

import { useCallback } from 'react'
import { questionsApi } from '@/lib/api/axios'
import { useApiQuery } from '@/hooks/use-api-query'
import { usePaginatedQuery } from '@/hooks/use-paginated-query'
import { usePermissions } from '@/hooks/use-permissions'
import { normalizePaginated } from '@/lib/pagination'
import type {
  AnswerQuestionResponse,
  Paginated,
  QuestionListItem,
  QuestionResponse,
} from '@/lib/api/types'

export interface QuestionsListParams {
  groupId?: string
  discipline?: string
  topic?: string
  difficulty?: string
  tags?: string
}

export function useQuestionsList(params: QuestionsListParams = {}) {
  const { can } = usePermissions()
  const enabled = can('questions.read')

  const fetcher = useCallback(
    async (p: QuestionsListParams & { page: number; limit: number }) => {
      const { data } = await questionsApi.list(p as Record<string, unknown>)
      return normalizePaginated<QuestionListItem>(data, p.limit)
    },
    []
  )

  return usePaginatedQuery(fetcher, {
    namespace: 'questions:list',
    baseParams: params,
    enabled,
  })
}

export function useQuestionDetail(id: string | undefined) {
  const { can } = usePermissions()
  const enabled = !!id && can('questions.read')

  const fetcher = useCallback(async () => {
    const { data } = await questionsApi.getById(id!)
    return data as QuestionResponse
  }, [id])

  return useApiQuery(fetcher, {
    namespace: 'questions:detail',
    params: { id },
    enabled,
  })
}

export interface SubmitAnswerPayload {
  selectedAlternativeId?: string
  textAnswer?: string
  timeSpentSeconds: number
}

export function useSubmitQuestionAnswer() {
  const submit = useCallback(
    async (questionId: string, payload: SubmitAnswerPayload) => {
      const { data } = await questionsApi.answer(
        questionId,
        payload as unknown as Record<string, unknown>
      )
      return data as AnswerQuestionResponse
    },
    []
  )

  return { submit }
}
