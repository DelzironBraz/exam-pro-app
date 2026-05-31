import { axiosInstance } from '../client'
import { CRAWLERS } from '../endpoints'

export const crawlersApi = {
  juriswaySyncAll: () => axiosInstance.post(CRAWLERS.JURISWAY_SYNC_ALL),
  juriswaySyncMateria: (materia: string) =>
    axiosInstance.post(CRAWLERS.JURISWAY_SYNC_MATERIA(materia)),
}
