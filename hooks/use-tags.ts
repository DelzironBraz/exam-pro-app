'use client'

import { useCallback } from 'react'
import { tagsApi } from '@/lib/api/axios'
import { useApiQuery } from '@/hooks/use-api-query'
import { usePermissions } from '@/hooks/use-permissions'
import type { TagResponse } from '@/lib/api/types'

export function useTagsList() {
  const { can } = usePermissions()

  const fetcher = useCallback(async () => {
    const { data } = await tagsApi.list()
    return data as TagResponse[]
  }, [])

  return useApiQuery(fetcher, {
    namespace: 'tags:list',
    enabled: can('tags.read'),
  })
}
