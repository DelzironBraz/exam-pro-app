'use client'

import { useCallback } from 'react'
import { simulationsApi } from '@/lib/api/axios'
import { useApiQuery } from '@/hooks/use-api-query'
import { usePaginatedQuery } from '@/hooks/use-paginated-query'
import { usePermissions } from '@/hooks/use-permissions'
import type { Paginated, SimulationResponse } from '@/lib/api/types'

export function useSimulationsList(groupId: string | undefined) {
  const { can } = usePermissions()

  const fetcher = useCallback(
    async (p: { groupId: string; page: number; limit: number }) => {
      const { data } = await simulationsApi.list({ groupId: p.groupId, page: p.page, limit: p.limit })
      return data as Paginated<SimulationResponse>
    },
    []
  )

  return usePaginatedQuery(fetcher, {
    namespace: 'simulations:list',
    baseParams: { groupId: groupId ?? '' },
    enabled: !!groupId && can('simulations.read'),
  })
}

export function useSimulationDetail(id: string | undefined) {
  const fetcher = useCallback(async () => {
    const { data } = await simulationsApi.getById(id!)
    return data as SimulationResponse
  }, [id])

  return useApiQuery(fetcher, {
    namespace: 'simulations:detail',
    params: { id },
    enabled: !!id,
  })
}
