import { axiosInstance } from '../client'
import { GROUPS } from '../endpoints'

export const groupsApi = {
  list: (params?: Record<string, unknown>) => axiosInstance.get(GROUPS.LIST, { params }),
  getById: (id: string | number) => axiosInstance.get(GROUPS.GET_BY_ID(id)),
  create: (data: Record<string, unknown>) => axiosInstance.post(GROUPS.CREATE, data),
  update: (id: string | number, data: Record<string, unknown>) =>
    axiosInstance.patch(GROUPS.UPDATE(id), data),
  delete: (id: string | number) => axiosInstance.delete(GROUPS.DELETE(id)),
}
