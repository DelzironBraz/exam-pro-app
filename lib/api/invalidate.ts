import { invalidateCache } from './cache'

export function invalidateNamespaces(...prefixes: string[]) {
  for (const prefix of prefixes) {
    invalidateCache(prefix)
  }
}
