import type { PaginationParams } from '@/lib/api/types'

export const DEFAULT_PAGE = 1
export const DEFAULT_LIMIT = 20
export const MAX_LIMIT = 100

export function withPagination<T extends Record<string, unknown>>(
  params: T,
  pagination?: PaginationParams
): T & { page: number; limit: number } {
  return {
    ...params,
    page: pagination?.page ?? DEFAULT_PAGE,
    limit: Math.min(pagination?.limit ?? DEFAULT_LIMIT, MAX_LIMIT),
  }
}
