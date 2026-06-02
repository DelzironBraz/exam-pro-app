'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  useTheme as useNextTheme,
} from 'next-themes'

export type Theme = 'light' | 'dark' | 'system'

export interface ThemeProviderState {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: string | undefined
}

export const ThemeProviderContext = React.createContext<ThemeProviderState | null>(null)

const STORAGE_KEY = 'ow_theme'

function ThemeProviderBridge({ children }: { children: React.ReactNode }) {
  const { theme, setTheme, resolvedTheme } = useNextTheme()

  const value = React.useMemo(
    () => ({
      theme: (theme ?? 'light') as Theme,
      setTheme: (t: Theme) => setTheme(t),
      resolvedTheme,
    }),
    [theme, setTheme, resolvedTheme]
  )

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      storageKey={STORAGE_KEY}
      disableTransitionOnChange
    >
      <ThemeProviderBridge>{children}</ThemeProviderBridge>
    </NextThemesProvider>
  )
}
