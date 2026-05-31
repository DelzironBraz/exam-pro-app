import { axiosInstance } from '../client'
import { ANALYTICS } from '../endpoints'

export const analyticsApi = {
  dashboard: () => axiosInstance.get(ANALYTICS.DASHBOARD),
  byGroup: (groupId: string | number) => axiosInstance.get(ANALYTICS.BY_GROUP(groupId)),
  byQuestion: (questionId: string | number) => axiosInstance.get(ANALYTICS.BY_QUESTION(questionId)),
}
