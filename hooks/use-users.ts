'use client'

import { useCallback } from 'react'
import { usersApi } from '@/lib/api/axios'
import { usePaginatedQuery } from '@/hooks/use-paginated-query'
import { usePermissions } from '@/hooks/use-permissions'
import type { Paginated, UserResponse } from '@/lib/api/types'

export function useUsersList() {
  const { can } = usePermissions()

  const fetcher = useCallback(async (p: { page: number; limit: number }) => {
    const { data } = await usersApi.list({ page: p.page, limit: p.limit })
    return data as Paginated<UserResponse>
  }, [])

  return usePaginatedQuery(fetcher, {
    namespace: 'users:list',
    enabled: can('users.manage'),
  })
}
