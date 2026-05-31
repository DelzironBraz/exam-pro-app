'use client'

import { useCallback } from 'react'
import { usersApi } from '@/lib/api/axios'
import { useApiQuery } from '@/hooks/use-api-query'
import { usePermissions } from '@/hooks/use-permissions'
import type { UserResponse } from '@/lib/api/types'

export function useUsersList() {
  const { can } = usePermissions()

  const fetcher = useCallback(async () => {
    const { data } = await usersApi.list()
    return data as UserResponse[]
  }, [])

  return useApiQuery(fetcher, {
    namespace: 'users:list',
    enabled: can('users.manage'),
  })
}
