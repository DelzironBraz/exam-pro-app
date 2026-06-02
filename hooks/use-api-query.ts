'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { buildCacheKey, fetchWithDedup, invalidateCache } from '@/lib/api/cache'
import { getApiErrorMessage } from '@/lib/api/client'

export interface UseApiQueryOptions {
  enabled?: boolean
  ttlMs?: number
  namespace: string
  params?: unknown
}

export interface UseApiQueryResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: (force?: boolean) => Promise<void>
  invalidate: () => void
}

export function useApiQuery<T>(
  fetcher: () => Promise<T>,
  options: UseApiQueryOptions
): UseApiQueryResult<T> {
  const { enabled = true, ttlMs, namespace, params } = options

  const cacheKey = useMemo(
    () => buildCacheKey(namespace, params),
    [namespace, params]
  )

  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(
    async (force = false) => {
      if (!enabled) {
        setLoading(false)
        setData(null)
        return
      }
      setLoading(true)
      setError(null)
      try {
        const result = await fetchWithDedup(
          cacheKey,
          () => fetcherRef.current(),
          { ttlMs, force }
        )
        setData(result)
      } catch (err) {
        setError(getApiErrorMessage(err))
      } finally {
        setLoading(false)
      }
    },
    [cacheKey, enabled, ttlMs]
  )

  const refetch = useCallback(async (force = true) => run(force), [run])

  const invalidate = useCallback(() => {
    invalidateCache(namespace)
  }, [namespace])

  useEffect(() => {
    void run(false)
  }, [cacheKey, enabled, run])

  return useMemo(
    () => ({ data, loading, error, refetch, invalidate }),
    [data, loading, error, refetch, invalidate]
  )
}
