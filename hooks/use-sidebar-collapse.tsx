'use client'

import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'ow_sidebar_collapsed'

export const SIDEBAR_WIDTH_EXPANDED = '16rem'
export const SIDEBAR_WIDTH_COLLAPSED = '4.5rem'

export function useSidebarCollapse() {
  const [collapsed, setCollapsed] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    setCollapsed(localStorage.getItem(STORAGE_KEY) === 'true')
    setReady(true)
  }, [])

  const toggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, String(next))
      }
      return next
    })
  }, [])

  const width = collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED

  return { collapsed, toggle, width, ready }
}
