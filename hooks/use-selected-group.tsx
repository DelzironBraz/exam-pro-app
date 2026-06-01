'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useGroupsList } from '@/hooks/use-groups'
import { useStudyPlansList } from '@/hooks/use-study-plans'
import { usePermissions } from '@/hooks/use-permissions'

const STORAGE_KEY = 'ow_selected_group_id'

export interface GroupOption {
  id: string
  name: string
}

interface SelectedGroupContextValue {
  groupId: string | null
  setGroupId: (id: string | null) => void
  options: GroupOption[]
  loading: boolean
}

const SelectedGroupContext = createContext<SelectedGroupContextValue | null>(null)

export function SelectedGroupProvider({ children }: { children: ReactNode }) {
  const { can } = usePermissions()
  const isAdmin = can('groups.manage')
  const {
    items: groups,
    loading: groupsLoading,
    refetch: refetchGroups,
  } = useGroupsList({ page: 1, limit: 100 }, isAdmin)
  const { items: plans, loading: plansLoading } = useStudyPlansList()

  const [groupId, setGroupIdState] = useState<string | null>(null)

  const options = useMemo<GroupOption[]>(() => {
    if (isAdmin && groups.length) {
      return groups.map((g) => ({ id: g.id, name: g.name }))
    }
    if (plans?.length) {
      const map = new Map<string, string>()
      for (const p of plans) {
        if (!map.has(p.groupId)) map.set(p.groupId, p.title)
      }
      return [...map.entries()].map(([id, name]) => ({
        id,
        name: name.length > 40 ? `${name.slice(0, 40)}…` : name,
      }))
    }
    return []
  }, [isAdmin, groups, plans])

  useEffect(() => {
    if (!isAdmin) return
    const handler = () => void refetchGroups(true)
    window.addEventListener('ow-groups-updated', handler)
    return () => window.removeEventListener('ow-groups-updated', handler)
  }, [isAdmin, refetchGroups])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && options.some((o) => o.id === stored)) {
      setGroupIdState(stored)
      return
    }
    if (options[0] && !groupId) {
      setGroupIdState(options[0].id)
      localStorage.setItem(STORAGE_KEY, options[0].id)
    }
  }, [options, groupId])

  const setGroupId = useCallback((id: string | null) => {
    setGroupIdState(id)
    if (typeof window !== 'undefined') {
      if (id) localStorage.setItem(STORAGE_KEY, id)
      else localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  const value = useMemo(
    () => ({
      groupId,
      setGroupId,
      options,
      loading: isAdmin ? groupsLoading : plansLoading,
    }),
    [groupId, setGroupId, options, isAdmin, groupsLoading, plansLoading]
  )

  return (
    <SelectedGroupContext.Provider value={value}>{children}</SelectedGroupContext.Provider>
  )
}

export function useSelectedGroup() {
  const ctx = useContext(SelectedGroupContext)
  if (!ctx) throw new Error('useSelectedGroup deve ser usado dentro de SelectedGroupProvider')
  return ctx
}
