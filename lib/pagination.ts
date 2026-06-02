import type { Paginated, PaginationParams } from '@/lib/api/types'

export const DEFAULT_PAGE = 1
export const DEFAULT_LIMIT = 20
export const MAX_LIMIT = 100

/** Normaliza respostas paginadas, arrays legados ou envelope duplo da API. */
export function normalizePaginated<T>(data: unknown, fallbackLimit = DEFAULT_LIMIT): Paginated<T> {
  const empty: Paginated<T> = {
    items: [],
    total: 0,
    page: DEFAULT_PAGE,
    limit: fallbackLimit,
    totalPages: 0,
  }

  if (data == null) return empty

  if (Array.isArray(data)) {
    const items = data as T[]
    return {
      items,
      total: items.length,
      page: DEFAULT_PAGE,
      limit: items.length || fallbackLimit,
      totalPages: items.length ? 1 : 0,
    }
  }

  if (typeof data !== 'object') return empty

  const record = data as Record<string, unknown>

  if (record.success === true && record.data != null) {
    return normalizePaginated<T>(record.data, fallbackLimit)
  }

  if (record.data != null && typeof record.data === 'object' && !Array.isArray(record.items)) {
    return normalizePaginated<T>(record.data, fallbackLimit)
  }

  if (Array.isArray(record.items)) {
    const items = record.items as T[]
    const limit = Number(record.limit) || fallbackLimit
    const total = Number(record.total) || items.length
    const page = Number(record.page) || DEFAULT_PAGE
    const totalPages = Number(record.totalPages) || (limit > 0 ? Math.ceil(total / limit) : 0)
    return { items, total, page, limit, totalPages }
  }

  return empty
}

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
