/**
 * Chamadas minimalistas aos endpoints da Offensive World API.
 * Cada módulo expõe funções que retornam a Promise do axiosInstance.
 */
export { authApi } from './axios/auth'
export { usersApi } from './axios/users'
export { groupsApi } from './axios/groups'
export { questionsApi } from './axios/questions'
export { tagsApi } from './axios/tags'
export { simulationsApi } from './axios/simulations'
export { flashcardsApi } from './axios/flashcards'
export { studyPlansApi } from './axios/study-plans'
export { examsApi } from './axios/exams'
export { pdfParserApi } from './axios/pdf-parser'
export { analyticsApi } from './axios/analytics'
export { crawlersApi } from './axios/crawlers'

export { axiosInstance, getStoredToken, setStoredToken, getApiErrorMessage } from './client'
export { BaseApiService } from './services/base-api-service'
export * from './endpoints'
export * from './types'
