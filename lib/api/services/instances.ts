import { GROUPS, QUESTIONS, USERS } from '../endpoints'
import { BaseApiService } from './base-api-service'

export const usersCrudService = new BaseApiService(USERS)
export const groupsCrudService = new BaseApiService(GROUPS)
export const questionsCrudService = new BaseApiService(QUESTIONS)
