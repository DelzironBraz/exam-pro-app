export type UserRole = 'admin' | 'instructor' | 'student'

export interface ApiEnvelope<T> {
  success: boolean
  data: T
  timestamp: string
}

export interface ApiErrorBody {
  success: false
  message: string
  statusCode: number
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
}

export interface LoginResponse {
  accessToken: string
  user: AuthUser
}

export interface UserResponse {
  id: string
  name: string
  email: string
  role: UserRole
  avatarUrl: string | null
  createdAt: string
  updatedAt: string
}

export type GroupType = 'contest' | 'technology' | 'language' | 'custom'
export type GroupVisibility = 'public' | 'private'
export type QuestionDifficulty = 'easy' | 'medium' | 'hard'

export interface GroupResponse {
  id: string
  name: string
  slug: string
  description: string | null
  type: GroupType
  visibility: GroupVisibility
  ownerId: string
  createdAt: string
  updatedAt: string
  tags?: string[]
}

export interface QuestionAlternative {
  id: string
  label: string
  content: string
  isCorrect?: boolean
}

export interface QuestionLastAnswer {
  selectedAlternativeId: string
  isCorrect: boolean
  answeredAt: string
}

export interface QuestionListItem {
  id: string
  statement: string
  groupId: string
  discipline: string | null
  topic: string | null
  difficulty: QuestionDifficulty
  createdBy?: string
  createdAt?: string
  tags: string[]
  alternatives?: QuestionAlternative[]
  completed?: boolean
  lastAnswer?: QuestionLastAnswer | null
}

export interface QuestionResponse extends QuestionListItem {
  explanation?: string | null
  createdBy: string
  createdAt: string
  alternatives?: QuestionAlternative[]
}

/** @deprecated Use Paginated<QuestionListItem> */
export type QuestionsListResponse = Paginated<QuestionListItem>

export interface AnswerQuestionResponse {
  isCorrect: boolean
  correctAlternativeId: string
  explanation?: string | null
}

export interface TagResponse {
  id: string
  name: string
}

export interface SimulationResponse {
  id: string
  title: string
  description: string | null
  groupId: string
  timerMode: 'fixed' | 'free'
  durationMinutes: number | null
  createdBy?: string
  createdAt: string
  questionIds?: string[]
  totalQuestions?: number
}

export interface SimulationAttemptResponse {
  id: string
  simulationId: string
  userId: string
  startedAt: string
  finishedAt: string | null
  totalCorrect: number
  totalWrong: number
  totalTimeSeconds: number
  totalQuestions: number
}

export interface SimulationAnswerResult {
  questionId: string
  selectedAlternativeId: string
  timeSpentSeconds: number
  isCorrect: boolean
  answeredAt: string
}

export interface SimulationResultResponse extends SimulationAttemptResponse {
  scorePercent: number
  answers: SimulationAnswerResult[]
}

export interface AttemptAnswerResponse {
  isCorrect: boolean
  correctAlternativeId?: string
  explanation?: string | null
}

export interface AssessmentQuestionSummary {
  id: string
  statement: string
  discipline: string | null
  topic: string | null
  difficulty: QuestionDifficulty
}

export interface AssessmentQuestionListItem {
  sortOrder: number
  sectionId?: string | null
  question: AssessmentQuestionSummary
  alternatives: QuestionAlternative[]
  answered: boolean
  selectedAlternativeId?: string
  answeredAt?: string
}

export interface SimulationAttemptDetailResponse extends SimulationAttemptResponse {
  answers?: SimulationAnswerResult[]
}

export interface ExamAttemptDetailResponse extends ExamAttemptResponse {
  answers?: SimulationAnswerResult[]
}

export interface FlashcardResponse {
  id: string
  groupId: string
  frontContent: string
  backContent: string
  difficulty: number
}

export interface FlashcardStudyResponse {
  id: string
  groupId: string
  frontContent: string
  difficulty: number
}

export interface StudyPlanItemResponse {
  id: string
  studyPlanId: string
  title: string
  description: string | null
  estimatedHours: number
  order: number
  completed: boolean
}

export interface StudyPlanProgress {
  totalItems: number
  completedItems: number
  totalEstimatedHours: number
  completedEstimatedHours: number
  completionPercent: number
}

export interface StudyPlanResponse {
  id: string
  userId: string
  groupId: string
  title: string
  createdAt: string
  items?: StudyPlanItemResponse[]
  progress?: StudyPlanProgress
}

export interface ExamSectionResponse {
  id: string
  name: string
  weight: number
  questionIds: string[]
}

export interface ExamResponse {
  id: string
  groupId: string
  title: string
  institution: string
  organization: string
  year: number
  roleName: string
  durationMinutes: number
  questionIds?: string[]
  totalQuestions?: number
  sections?: ExamSectionResponse[]
}

export interface ExamAttemptResponse {
  id: string
  examId: string
  userId: string
  startedAt: string
  finishedAt: string | null
  score: number
  totalCorrect: number
  totalWrong: number
  totalTimeSeconds: number
  totalQuestions: number
}

export interface ExamResultResponse extends ExamAttemptResponse {
  examTitle?: string
  institution?: string
  year?: number
}

export interface DashboardAnalytics {
  totalQuestions: number
  totalCorrect: number
  totalWrong: number
  accuracy: number
  averageTime: number
  weakTopics: string[]
  strongTopics: string[]
  recommendations: string[]
}

export interface ImportJobResponse {
  id: string
  uploadedBy: string
  fileUrl: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  type: 'exam' | 'study_plan'
  createdAt: string
  errorMessage: string | null
  approvedRefId: string | null
}

export interface MessageResponse {
  message: string
}
