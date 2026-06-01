import { axiosInstance } from '../client'
import { STUDY_PLANS } from '../endpoints'

export const studyPlansApi = {
  list: (params?: Record<string, unknown>) => axiosInstance.get(STUDY_PLANS.LIST, { params }),
  getById: (id: string | number) => axiosInstance.get(STUDY_PLANS.GET_BY_ID(id)),
  create: (data: Record<string, unknown>) => axiosInstance.post(STUDY_PLANS.CREATE, data),
  update: (id: string | number, data: Record<string, unknown>) =>
    axiosInstance.patch(STUDY_PLANS.UPDATE(id), data),
  delete: (id: string | number) => axiosInstance.delete(STUDY_PLANS.DELETE(id)),
  addItem: (id: string | number, data: Record<string, unknown>) =>
    axiosInstance.post(STUDY_PLANS.ADD_ITEM(id), data),
  completeItem: (itemId: string | number) => axiosInstance.post(STUDY_PLANS.COMPLETE_ITEM(itemId)),
}
