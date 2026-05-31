'use client'

import { useCallback } from 'react'
import { simulationsApi } from '@/lib/api/axios'
import { useApiQuery } from '@/hooks/use-api-query'
import { usePermissions } from '@/hooks/use-permissions'
import type { SimulationResponse } from '@/lib/api/types'

export function useSimulationsList(groupId: string | undefined) {
  const { can } = usePermissions()

  const fetcher = useCallback(async () => {
    const { data } = await simulationsApi.list({ groupId: groupId! })
    return data as SimulationResponse[]
  }, [groupId])

  return useApiQuery(fetcher, {
    namespace: 'simulations:list',
    params: { groupId },
    enabled: !!groupId && can('simulations.read'),
  })
}
