import { axiosInstance } from '../client'
import { USERS } from '../endpoints'

export const usersApi = {
  list: () => axiosInstance.get(USERS.LIST),
  getById: (id: string | number) => axiosInstance.get(USERS.GET_BY_ID(id)),
  create: (data: Record<string, unknown>) => axiosInstance.post(USERS.CREATE, data),
  update: (id: string | number, data: Record<string, unknown>) =>
    axiosInstance.patch(USERS.UPDATE(id), data),
  delete: (id: string | number) => axiosInstance.delete(USERS.DELETE(id)),
}
