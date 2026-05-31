import { axiosInstance } from '../client'
import { FLASHCARDS } from '../endpoints'

export const flashcardsApi = {
  list: (params: { groupId: string }) => axiosInstance.get(FLASHCARDS.LIST, { params }),
  pending: (params?: { groupId?: string }) => axiosInstance.get(FLASHCARDS.PENDING, { params }),
  getById: (id: string | number) => axiosInstance.get(FLASHCARDS.GET_BY_ID(id)),
  create: (data: Record<string, unknown>) => axiosInstance.post(FLASHCARDS.CREATE, data),
  update: (id: string | number, data: Record<string, unknown>) =>
    axiosInstance.patch(FLASHCARDS.UPDATE(id), data),
  delete: (id: string | number) => axiosInstance.delete(FLASHCARDS.DELETE(id)),
  review: (id: string | number, data: Record<string, unknown>) =>
    axiosInstance.post(FLASHCARDS.REVIEW(id), data),
}
