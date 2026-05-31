'use client'

import { useCallback } from 'react'
import { analyticsApi } from '@/lib/api/axios'
import { useApiQuery } from '@/hooks/use-api-query'
import type { DashboardAnalytics } from '@/lib/api/types'

export function useDashboardAnalytics() {
  const fetcher = useCallback(async () => {
    const { data } = await analyticsApi.dashboard()
    return data as DashboardAnalytics
  }, [])

  return useApiQuery(fetcher, { namespace: 'analytics:dashboard' })
}

export function useGroupAnalytics(groupId: string | undefined) {
  const fetcher = useCallback(async () => {
    if (!groupId) throw new Error('groupId obrigatório')
    const { data } = await analyticsApi.byGroup(groupId)
    return data
  }, [groupId])

  return useApiQuery(fetcher, {
    namespace: 'analytics:group',
    params: { groupId },
    enabled: !!groupId,
  })
}
