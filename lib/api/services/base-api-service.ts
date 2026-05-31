import type { AxiosResponse } from 'axios'
import { axiosInstance } from '../client'

export interface CrudPaths {
  LIST: string
  CREATE: string
  GET_BY_ID: (id: string | number) => string
  UPDATE: (id: string | number) => string
  DELETE: (id: string | number) => string
}

/**
 * Classe base para recursos CRUD da API.
 * Módulos axios podem estender ou delegar para instâncias desta classe.
 */
export class BaseApiService<TListParams = Record<string, unknown>> {
  constructor(protected readonly paths: CrudPaths) {}

  list(params?: TListParams): Promise<AxiosResponse<unknown>> {
    return axiosInstance.get(this.paths.LIST, { params })
  }

  getById(id: string | number): Promise<AxiosResponse<unknown>> {
    return axiosInstance.get(this.paths.GET_BY_ID(id))
  }

  create(data: Record<string, unknown>): Promise<AxiosResponse<unknown>> {
    return axiosInstance.post(this.paths.CREATE, data)
  }

  update(id: string | number, data: Record<string, unknown>): Promise<AxiosResponse<unknown>> {
    return axiosInstance.patch(this.paths.UPDATE(id), data)
  }

  delete(id: string | number): Promise<AxiosResponse<unknown>> {
    return axiosInstance.delete(this.paths.DELETE(id))
  }
}

export class BasePatchCrudService<TListParams = Record<string, unknown>> extends BaseApiService<TListParams> {
  override update(id: string | number, data: Record<string, unknown>): Promise<AxiosResponse<unknown>> {
    return axiosInstance.patch(this.paths.UPDATE(id), data)
  }
}
