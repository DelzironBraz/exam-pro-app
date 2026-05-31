'use client'

import { useCallback } from 'react'
import { groupsApi } from '@/lib/api/axios'
import { useApiQuery } from '@/hooks/use-api-query'
import { usePermissions } from '@/hooks/use-permissions'
import type { GroupResponse } from '@/lib/api/types'

export function useGroupsList(params?: Record<string, unknown>, enabledOverride?: boolean) {
  const { can } = usePermissions()
  const enabled =
    enabledOverride ?? (can('groups.manage') || can('questions.read'))

  const paramsKey = JSON.stringify(params ?? {})

  const fetcher = useCallback(async () => {
    const { data } = await groupsApi.list(params)
    return data as GroupResponse[]
  }, [paramsKey])

  return useApiQuery(fetcher, {
    namespace: 'groups:list',
    params,
    enabled,
  })
}
