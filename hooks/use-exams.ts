'use client'

import { useCallback } from 'react'
import { examsApi } from '@/lib/api/axios'
import { useApiQuery } from '@/hooks/use-api-query'
import { usePermissions } from '@/hooks/use-permissions'
import type { ExamAttemptResponse, ExamResponse } from '@/lib/api/types'

export function useExamsList(groupId: string | undefined) {
  const { can } = usePermissions()

  const fetcher = useCallback(async () => {
    const { data } = await examsApi.list({ groupId: groupId! })
    return data as ExamResponse[]
  }, [groupId])

  return useApiQuery(fetcher, {
    namespace: 'exams:list',
    params: { groupId },
    enabled: !!groupId && can('exams.read'),
  })
}

export function useMyExamAttempts() {
  const { can } = usePermissions()

  const fetcher = useCallback(async () => {
    const { data } = await examsApi.myAttempts()
    return data as ExamAttemptResponse[]
  }, [])

  return useApiQuery(fetcher, {
    namespace: 'exams:my-attempts',
    enabled: can('exams.read'),
  })
}
