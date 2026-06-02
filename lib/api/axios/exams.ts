import type { PaginationParams } from '../types'
import { axiosInstance } from '../client'
import { EXAMS } from '../endpoints'

export const examsApi = {
  list: (params: { groupId: string } & PaginationParams) =>
    axiosInstance.get(EXAMS.LIST, { params }),
  myAttempts: (params?: Record<string, unknown>) =>
    axiosInstance.get(EXAMS.MY_ATTEMPTS, { params }),
  getAttempt: (attemptId: string | number) => axiosInstance.get(EXAMS.GET_ATTEMPT(attemptId)),
  getById: (id: string | number) => axiosInstance.get(EXAMS.GET_BY_ID(id)),
  listQuestions: (
    examId: string | number,
    params?: { page?: number; limit?: number; attemptId?: string }
  ) => axiosInstance.get(EXAMS.LIST_QUESTIONS(examId), { params }),
  create: (data: Record<string, unknown>) => axiosInstance.post(EXAMS.CREATE, data),
  update: (id: string | number, data: Record<string, unknown>) =>
    axiosInstance.patch(EXAMS.UPDATE(id), data),
  delete: (id: string | number) => axiosInstance.delete(EXAMS.DELETE(id)),
  addSection: (id: string | number, data: Record<string, unknown>) =>
    axiosInstance.post(EXAMS.ADD_SECTION(id), data),
  deleteSection: (examId: string | number, sectionId: string | number) =>
    axiosInstance.delete(EXAMS.DELETE_SECTION(examId, sectionId)),
  start: (id: string | number) => axiosInstance.post(EXAMS.START(id)),
  submitAnswer: (attemptId: string | number, data: Record<string, unknown>) =>
    axiosInstance.post(EXAMS.SUBMIT_ANSWER(attemptId), data),
  finishAttempt: (attemptId: string | number, data: Record<string, unknown>) =>
    axiosInstance.post(EXAMS.FINISH_ATTEMPT(attemptId), data),
}
