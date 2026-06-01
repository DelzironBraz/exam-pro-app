import { axiosInstance } from '../client'
import { TAGS } from '../endpoints'

export const tagsApi = {
  list: (params?: Record<string, unknown>) => axiosInstance.get(TAGS.LIST, { params }),
  getById: (id: string | number) => axiosInstance.get(TAGS.GET_BY_ID(id)),
  create: (data: Record<string, unknown>) => axiosInstance.post(TAGS.CREATE, data),
  delete: (id: string | number) => axiosInstance.delete(TAGS.DELETE(id)),
  byQuestion: (questionId: string | number) => axiosInstance.get(TAGS.BY_QUESTION(questionId)),
  syncQuestion: (questionId: string | number, data: Record<string, unknown>) =>
    axiosInstance.put(TAGS.SYNC_QUESTION(questionId), data),
  attachQuestion: (questionId: string | number, data: Record<string, unknown>) =>
    axiosInstance.post(TAGS.ATTACH_QUESTION(questionId), data),
  detachQuestion: (questionId: string | number, tagId: string | number) =>
    axiosInstance.delete(TAGS.DETACH_QUESTION(questionId, tagId)),
  byGroup: (groupId: string | number) => axiosInstance.get(TAGS.BY_GROUP(groupId)),
  syncGroup: (groupId: string | number, data: Record<string, unknown>) =>
    axiosInstance.put(TAGS.SYNC_GROUP(groupId), data),
  attachGroup: (groupId: string | number, data: Record<string, unknown>) =>
    axiosInstance.post(TAGS.ATTACH_GROUP(groupId), data),
  detachGroup: (groupId: string | number, tagId: string | number) =>
    axiosInstance.delete(TAGS.DETACH_GROUP(groupId, tagId)),
}
