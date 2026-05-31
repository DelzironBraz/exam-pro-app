import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import type { ApiEnvelope, ApiErrorBody } from './types'

const TOKEN_KEY = 'ow_access_token'

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
})

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setStoredToken(token: string | null): void {
  if (typeof window === 'undefined') return
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getStoredToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosInstance.interceptors.response.use((response) => {
  const body = response.data as ApiEnvelope<unknown> | unknown
  if (
    body &&
    typeof body === 'object' &&
    'success' in body &&
    (body as ApiEnvelope<unknown>).success === true &&
    'data' in body
  ) {
    response.data = (body as ApiEnvelope<unknown>).data
  }
  return response
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const path = window.location.pathname
      if (!path.startsWith('/login')) {
        setStoredToken(null)
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('ow_user') // USER_STORAGE_KEY em use-auth
        }
        window.location.href = `/login?redirect=${encodeURIComponent(path)}`
      }
    }
    return Promise.reject(error)
  }
)

export function getApiErrorMessage(error: unknown, fallback = 'Erro na requisição'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorBody | { message?: string } | undefined
    if (data && typeof data === 'object' && 'message' in data && data.message) {
      return String(data.message)
    }
    return error.message || fallback
  }
  if (error instanceof Error) return error.message
  return fallback
}
