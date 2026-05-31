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

export interface QuestionListItem {
  id: string
  statement: string
  groupId: string
  discipline: string | null
  topic: string | null
  difficulty: QuestionDifficulty
  tags: string[]
}

export interface QuestionResponse extends QuestionListItem {
  explanation?: string | null
  createdBy: string
  createdAt: string
  alternatives?: QuestionAlternative[]
}

export interface QuestionsListResponse {
  items: QuestionListItem[]
  total: number
}

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
  createdBy: string
  createdAt: string
  questionIds?: string[]
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
