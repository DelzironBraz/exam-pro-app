'use client'

import { useCallback } from 'react'
import { examsApi } from '@/lib/api/axios'
import { useApiQuery } from '@/hooks/use-api-query'
import { usePaginatedQuery } from '@/hooks/use-paginated-query'
import { usePermissions } from '@/hooks/use-permissions'
import type { ExamAttemptResponse, ExamResponse, Paginated } from '@/lib/api/types'

export function useExamsList(groupId: string | undefined) {
  const { can } = usePermissions()

  const fetcher = useCallback(
    async (p: { groupId: string; page: number; limit: number }) => {
      const { data } = await examsApi.list({ groupId: p.groupId, page: p.page, limit: p.limit })
      return data as Paginated<ExamResponse>
    },
    []
  )

  return usePaginatedQuery(fetcher, {
    namespace: 'exams:list',
    baseParams: { groupId: groupId ?? '' },
    enabled: !!groupId && can('exams.read'),
  })
}

export function useMyExamAttempts() {
  const { can } = usePermissions()

  const fetcher = useCallback(async (p: { page: number; limit: number }) => {
    const { data } = await examsApi.myAttempts({ page: p.page, limit: p.limit })
    return data as Paginated<ExamAttemptResponse>
  }, [])

  return usePaginatedQuery(fetcher, {
    namespace: 'exams:my-attempts',
    enabled: can('exams.read'),
    initialLimit: 10,
  })
}

export function useExamDetail(id: string | undefined) {
  const fetcher = useCallback(async () => {
    const { data } = await examsApi.getById(id!)
    return data as ExamResponse
  }, [id])

  return useApiQuery(fetcher, {
    namespace: 'exams:detail',
    params: { id },
    enabled: !!id,
  })
}
