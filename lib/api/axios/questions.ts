import { axiosInstance } from '../client'
import { QUESTIONS } from '../endpoints'

export const questionsApi = {
  list: (params?: Record<string, unknown>) => axiosInstance.get(QUESTIONS.LIST, { params }),
  getById: (id: string | number) => axiosInstance.get(QUESTIONS.GET_BY_ID(id)),
  create: (data: Record<string, unknown>) => axiosInstance.post(QUESTIONS.CREATE, data),
  update: (id: string | number, data: Record<string, unknown>) =>
    axiosInstance.patch(QUESTIONS.UPDATE(id), data),
  delete: (id: string | number) => axiosInstance.delete(QUESTIONS.DELETE(id)),
  answer: (id: string | number, data: Record<string, unknown>) =>
    axiosInstance.post(QUESTIONS.ANSWER(id), data),
}
