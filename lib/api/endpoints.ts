const id = (value: string | number) => String(value)

export const AUTH = {
  LOGIN: '/auth/login',
} as const

export const USERS = {
  LIST: '/users',
  CREATE: '/users',
  GET_BY_ID: (userId: string | number) => `/users/${id(userId)}`,
  UPDATE: (userId: string | number) => `/users/${id(userId)}`,
  DELETE: (userId: string | number) => `/users/${id(userId)}`,
} as const

export const GROUPS = {
  LIST: '/groups',
  CREATE: '/groups',
  GET_BY_ID: (groupId: string | number) => `/groups/${id(groupId)}`,
  UPDATE: (groupId: string | number) => `/groups/${id(groupId)}`,
  DELETE: (groupId: string | number) => `/groups/${id(groupId)}`,
} as const

export const QUESTIONS = {
  LIST: '/questions',
  CREATE: '/questions',
  GET_BY_ID: (questionId: string | number) => `/questions/${id(questionId)}`,
  UPDATE: (questionId: string | number) => `/questions/${id(questionId)}`,
  DELETE: (questionId: string | number) => `/questions/${id(questionId)}`,
  ANSWER: (questionId: string | number) => `/questions/${id(questionId)}/answer`,
} as const

export const TAGS = {
  LIST: '/tags',
  CREATE: '/tags',
  GET_BY_ID: (tagId: string | number) => `/tags/${id(tagId)}`,
  DELETE: (tagId: string | number) => `/tags/${id(tagId)}`,
  BY_QUESTION: (questionId: string | number) => `/tags/questions/${id(questionId)}`,
  SYNC_QUESTION: (questionId: string | number) => `/tags/questions/${id(questionId)}`,
  ATTACH_QUESTION: (questionId: string | number) => `/tags/questions/${id(questionId)}`,
  DETACH_QUESTION: (questionId: string | number, tagId: string | number) =>
    `/tags/questions/${id(questionId)}/${id(tagId)}`,
  BY_GROUP: (groupId: string | number) => `/tags/groups/${id(groupId)}`,
  SYNC_GROUP: (groupId: string | number) => `/tags/groups/${id(groupId)}`,
  ATTACH_GROUP: (groupId: string | number) => `/tags/groups/${id(groupId)}`,
  DETACH_GROUP: (groupId: string | number, tagId: string | number) =>
    `/tags/groups/${id(groupId)}/${id(tagId)}`,
} as const

export const SIMULATIONS = {
  LIST: '/simulations',
  CREATE: '/simulations',
  GET_BY_ID: (simulationId: string | number) => `/simulations/${id(simulationId)}`,
  DELETE: (simulationId: string | number) => `/simulations/${id(simulationId)}`,
  START: (simulationId: string | number) => `/simulations/${id(simulationId)}/start`,
  SUBMIT_ANSWER: (attemptId: string | number) =>
    `/simulations/attempts/${id(attemptId)}/answers`,
  FINISH_ATTEMPT: (attemptId: string | number) =>
    `/simulations/attempts/${id(attemptId)}/finish`,
  GET_ATTEMPT: (attemptId: string | number) => `/simulations/attempts/${id(attemptId)}`,
} as const

export const FLASHCARDS = {
  LIST: '/flashcards',
  CREATE: '/flashcards',
  PENDING: '/flashcards/pending',
  GET_BY_ID: (flashcardId: string | number) => `/flashcards/${id(flashcardId)}`,
  UPDATE: (flashcardId: string | number) => `/flashcards/${id(flashcardId)}`,
  DELETE: (flashcardId: string | number) => `/flashcards/${id(flashcardId)}`,
  REVIEW: (flashcardId: string | number) => `/flashcards/${id(flashcardId)}/review`,
} as const

export const STUDY_PLANS = {
  LIST: '/study-plans',
  CREATE: '/study-plans',
  GET_BY_ID: (planId: string | number) => `/study-plans/${id(planId)}`,
  UPDATE: (planId: string | number) => `/study-plans/${id(planId)}`,
  DELETE: (planId: string | number) => `/study-plans/${id(planId)}`,
  ADD_ITEM: (planId: string | number) => `/study-plans/${id(planId)}/items`,
  COMPLETE_ITEM: (itemId: string | number) => `/study-plans/items/${id(itemId)}/complete`,
} as const

export const EXAMS = {
  LIST: '/exams',
  CREATE: '/exams',
  MY_ATTEMPTS: '/exams/attempts/me',
  GET_ATTEMPT: (attemptId: string | number) => `/exams/attempts/${id(attemptId)}`,
  GET_BY_ID: (examId: string | number) => `/exams/${id(examId)}`,
  UPDATE: (examId: string | number) => `/exams/${id(examId)}`,
  DELETE: (examId: string | number) => `/exams/${id(examId)}`,
  ADD_SECTION: (examId: string | number) => `/exams/${id(examId)}/sections`,
  DELETE_SECTION: (examId: string | number, sectionId: string | number) =>
    `/exams/${id(examId)}/sections/${id(sectionId)}`,
  START: (examId: string | number) => `/exams/${id(examId)}/start`,
  SUBMIT_ANSWER: (attemptId: string | number) => `/exams/attempts/${id(attemptId)}/answers`,
  FINISH_ATTEMPT: (attemptId: string | number) => `/exams/attempts/${id(attemptId)}/finish`,
} as const

export const PDF_PARSER = {
  LIST_JOBS: '/pdf-parser/jobs',
  PREVIEW: (jobId: string | number) => `/pdf-parser/jobs/${id(jobId)}/preview`,
  UPLOAD_EXAM: '/pdf-parser/exams/upload',
  PROCESS_EXAM: (jobId: string | number) => `/pdf-parser/exams/${id(jobId)}/process`,
  APPROVE_EXAM: (jobId: string | number) => `/pdf-parser/exams/${id(jobId)}/approve`,
  UPLOAD_STUDY_PLAN: '/pdf-parser/study-plans/upload',
  PROCESS_STUDY_PLAN: (jobId: string | number) => `/pdf-parser/study-plans/${id(jobId)}/process`,
  APPROVE_STUDY_PLAN: (jobId: string | number) => `/pdf-parser/study-plans/${id(jobId)}/approve`,
} as const

export const ANALYTICS = {
  DASHBOARD: '/analytics/dashboard',
  BY_GROUP: (groupId: string | number) => `/analytics/groups/${id(groupId)}`,
  BY_QUESTION: (questionId: string | number) => `/analytics/questions/${id(questionId)}`,
} as const

export const CRAWLERS = {
  JURISWAY_SYNC_ALL: '/crawlers/jurisway/sync',
  JURISWAY_SYNC_MATERIA: (materia: string) => `/crawlers/jurisway/sync/${materia}`,
} as const
