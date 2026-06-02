import type { PaginationParams } from '../types'
import { axiosInstance } from '../client'
import { SIMULATIONS } from '../endpoints'

export const simulationsApi = {
  list: (params: { groupId: string } & PaginationParams) =>
    axiosInstance.get(SIMULATIONS.LIST, { params }),
  getById: (id: string | number) => axiosInstance.get(SIMULATIONS.GET_BY_ID(id)),
  create: (data: Record<string, unknown>) => axiosInstance.post(SIMULATIONS.CREATE, data),
  delete: (id: string | number) => axiosInstance.delete(SIMULATIONS.DELETE(id)),
  start: (id: string | number) => axiosInstance.post(SIMULATIONS.START(id)),
  submitAnswer: (attemptId: string | number, data: Record<string, unknown>) =>
    axiosInstance.post(SIMULATIONS.SUBMIT_ANSWER(attemptId), data),
  finishAttempt: (attemptId: string | number, data: Record<string, unknown>) =>
    axiosInstance.post(SIMULATIONS.FINISH_ATTEMPT(attemptId), data),
  getAttempt: (attemptId: string | number) => axiosInstance.get(SIMULATIONS.GET_ATTEMPT(attemptId)),
}
