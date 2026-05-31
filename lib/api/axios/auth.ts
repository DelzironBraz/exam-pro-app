import { axiosInstance } from '../client'
import { AUTH } from '../endpoints'

export const authApi = {
  login: (data: { email: string; password: string }) => axiosInstance.post(AUTH.LOGIN, data),
}
