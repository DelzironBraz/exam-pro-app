interface CacheEntry<T> {
  data: T
  fetchedAt: number
}

const store = new Map<string, CacheEntry<unknown>>()
const inflight = new Map<string, Promise<unknown>>()

const DEFAULT_TTL_MS = 60_000

export function buildCacheKey(namespace: string, params?: unknown): string {
  if (params === undefined) return namespace
  try {
    return `${namespace}:${JSON.stringify(params)}`
  } catch {
    return `${namespace}:${String(params)}`
  }
}

export function getCached<T>(key: string, ttlMs = DEFAULT_TTL_MS): T | undefined {
  const entry = store.get(key) as CacheEntry<T> | undefined
  if (!entry) return undefined
  if (Date.now() - entry.fetchedAt > ttlMs) {
    store.delete(key)
    return undefined
  }
  return entry.data
}

export function setCached<T>(key: string, data: T): void {
  store.set(key, { data, fetchedAt: Date.now() })
}

export function invalidateCache(prefix?: string): void {
  if (!prefix) {
    store.clear()
    inflight.clear()
    return
  }
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) store.delete(key)
  }
  for (const key of inflight.keys()) {
    if (key.startsWith(prefix)) inflight.delete(key)
  }
}

export async function fetchWithDedup<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: { ttlMs?: number; force?: boolean }
): Promise<T> {
  const ttlMs = options?.ttlMs ?? DEFAULT_TTL_MS

  if (!options?.force) {
    const cached = getCached<T>(key, ttlMs)
    if (cached !== undefined) return cached
  }

  const pending = inflight.get(key) as Promise<T> | undefined
  if (pending) return pending

  const promise = fetcher()
    .then((data) => {
      setCached(key, data)
      return data
    })
    .finally(() => {
      inflight.delete(key)
    })

  inflight.set(key, promise)
  return promise
}
