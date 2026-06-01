'use client'

import { useCallback } from 'react'
import { tagsApi } from '@/lib/api/axios'
import { usePaginatedQuery } from '@/hooks/use-paginated-query'
import { usePermissions } from '@/hooks/use-permissions'
import type { Paginated, TagResponse } from '@/lib/api/types'

export function useTagsList() {
  const { can } = usePermissions()

  const fetcher = useCallback(async (p: { page: number; limit: number }) => {
    const { data } = await tagsApi.list({ page: p.page, limit: p.limit })
    return data as Paginated<TagResponse>
  }, [])

  return usePaginatedQuery(fetcher, {
    namespace: 'tags:list',
    enabled: can('tags.read'),
    initialLimit: 50,
  })
}
