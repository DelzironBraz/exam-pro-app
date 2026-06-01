'use client'

import { useCallback } from 'react'
import { groupsApi } from '@/lib/api/axios'
import { usePaginatedQuery } from '@/hooks/use-paginated-query'
import { usePermissions } from '@/hooks/use-permissions'
import type { GroupResponse, Paginated } from '@/lib/api/types'

export function useGroupsList(
  params?: Record<string, unknown>,
  enabledOverride?: boolean
) {
  const { can } = usePermissions()
  const enabled = enabledOverride ?? (can('groups.manage') || can('questions.read'))

  const fetcher = useCallback(async (p: Record<string, unknown> & { page: number; limit: number }) => {
    const { data } = await groupsApi.list(p)
    return data as Paginated<GroupResponse>
  }, [])

  return usePaginatedQuery(fetcher, {
    namespace: 'groups:list',
    baseParams: params ?? {},
    enabled,
    initialLimit: 50,
  })
}
