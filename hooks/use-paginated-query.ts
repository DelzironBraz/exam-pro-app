'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Paginated, PaginationParams } from '@/lib/api/types'
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@/lib/pagination'
import { useApiQuery } from '@/hooks/use-api-query'

export interface UsePaginatedQueryOptions<TParams extends Record<string, unknown>> {
  namespace: string
  baseParams?: TParams
  enabled?: boolean
  initialPage?: number
  initialLimit?: number
}

export function usePaginatedQuery<TItem, TParams extends Record<string, unknown> = Record<string, unknown>>(
  fetcher: (params: TParams & { page: number; limit: number }) => Promise<Paginated<TItem>>,
  options: UsePaginatedQueryOptions<TParams>
) {
  const { namespace, baseParams, enabled = true, initialPage = DEFAULT_PAGE, initialLimit = DEFAULT_LIMIT } =
    options

  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)

  const baseKey = JSON.stringify(baseParams ?? {})

  useEffect(() => {
    setPage(initialPage)
  }, [baseKey, initialPage])

  const params = useMemo(() => {
    const parsed = baseKey === '{}' ? ({} as TParams) : (JSON.parse(baseKey) as TParams)
    return {
      ...parsed,
      page,
      limit,
    }
  }, [baseKey, page, limit])

  const stableFetcher = useCallback(
    () => fetcher(params as TParams & { page: number; limit: number }),
    [fetcher, params]
  )

  const query = useApiQuery(stableFetcher, {
    namespace,
    params,
    enabled,
  })

  const goToPage = useCallback((p: number) => {
    setPage(Math.max(1, p))
  }, [])

  const setPageSize = useCallback((l: number) => {
    setLimit(l)
    setPage(1)
  }, [])

  return {
    ...query,
    page,
    limit,
    setPage: goToPage,
    setLimit: setPageSize,
    pagination: query.data
      ? {
          page: query.data.page,
          limit: query.data.limit,
          total: query.data.total,
          totalPages: query.data.totalPages,
        }
      : null,
    items: query.data?.items ?? [],
  }
}
