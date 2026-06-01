'use client'

import { useCallback } from 'react'
import { studyPlansApi } from '@/lib/api/axios'
import { useApiQuery } from '@/hooks/use-api-query'
import { usePaginatedQuery } from '@/hooks/use-paginated-query'
import { usePermissions } from '@/hooks/use-permissions'
import type { Paginated, StudyPlanResponse } from '@/lib/api/types'

export function useStudyPlansList() {
  const { can } = usePermissions()

  const fetcher = useCallback(async (p: { page: number; limit: number }) => {
    const { data } = await studyPlansApi.list({ page: p.page, limit: p.limit })
    return data as Paginated<StudyPlanResponse>
  }, [])

  return usePaginatedQuery(fetcher, {
    namespace: 'study-plans:list',
    enabled: can('studyPlans.manage'),
  })
}

export function useStudyPlanDetail(id: string | undefined) {
  const { can } = usePermissions()

  const fetcher = useCallback(async () => {
    const { data } = await studyPlansApi.getById(id!)
    return data as StudyPlanResponse
  }, [id])

  return useApiQuery(fetcher, {
    namespace: 'study-plans:detail',
    params: { id },
    enabled: !!id && can('studyPlans.manage'),
  })
}
