'use client'

import { useCallback, useMemo } from 'react'
import { questionsApi } from '@/lib/api/axios'
import { useApiQuery } from '@/hooks/use-api-query'
import { usePermissions } from '@/hooks/use-permissions'
import type { QuestionResponse, QuestionsListResponse } from '@/lib/api/types'

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

  const stableParams = useMemo(() => params, [JSON.stringify(params)])

  const fetcher = useCallback(async () => {
    const { data } = await questionsApi.list(stableParams as Record<string, unknown>)
    return data as QuestionsListResponse
  }, [stableParams])

  return useApiQuery(fetcher, {
    namespace: 'questions:list',
    params: stableParams,
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
