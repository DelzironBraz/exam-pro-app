'use client'

import { useCallback, useContext, useEffect, useState } from 'react'
import { ThemeProviderContext } from '@/components/theme-provider'

export type ThemeMode = 'light' | 'dark' | 'system'

export function useTheme() {
  const context = useContext(ThemeProviderContext)

  if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider')
  }

  const { theme, setTheme, resolvedTheme } = context

  const isDark = resolvedTheme === 'dark'

  const toggleTheme = useCallback(() => {
    setTheme(isDark ? 'light' : 'dark')
  }, [isDark, setTheme])

  return {
    theme: theme as ThemeMode,
    setTheme,
    resolvedTheme,
    isDark,
    toggleTheme,
  }
}

/** Evita flash de tema errado antes da hidratação do next-themes */
export function useThemeMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}
