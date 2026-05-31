'use client'

import { useCallback } from 'react'
import { studyPlansApi } from '@/lib/api/axios'
import { useApiQuery } from '@/hooks/use-api-query'
import { usePermissions } from '@/hooks/use-permissions'
import type { StudyPlanResponse } from '@/lib/api/types'

export function useStudyPlansList() {
  const { can } = usePermissions()

  const fetcher = useCallback(async () => {
    const { data } = await studyPlansApi.list()
    return data as StudyPlanResponse[]
  }, [])

  return useApiQuery(fetcher, {
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
