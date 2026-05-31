'use client'

import { useCallback } from 'react'
import { groupsApi } from '@/lib/api/axios'
import { useApiQuery } from '@/hooks/use-api-query'
import { usePermissions } from '@/hooks/use-permissions'
import type { GroupResponse } from '@/lib/api/types'

export function useGroupsList(params?: Record<string, unknown>) {
  const { can } = usePermissions()

  const fetcher = useCallback(async () => {
    const { data } = await groupsApi.list(params)
    return data as GroupResponse[]
  }, [JSON.stringify(params)])

  return useApiQuery(fetcher, {
    namespace: 'groups:list',
    params,
    enabled: can('groups.manage') || can('questions.read'),
  })
}
