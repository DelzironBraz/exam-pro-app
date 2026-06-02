import type { UserRole } from '@/lib/api/types'

export type AccessLevel = 'public' | 'authenticated' | 'admin'

export type PermissionAction =
  | 'users.manage'
  | 'groups.manage'
  | 'questions.manage'
  | 'questions.read'
  | 'questions.answer'
  | 'tags.manage'
  | 'tags.read'
  | 'simulations.manage'
  | 'simulations.read'
  | 'simulations.attempt'
  | 'flashcards.manage'
  | 'flashcards.read'
  | 'flashcards.review'
  | 'studyPlans.manage'
  | 'exams.manage'
  | 'exams.read'
  | 'exams.attempt'
  | 'pdfParser.manage'
  | 'pdfParser.read'
  | 'analytics.dashboard'
  | 'analytics.group'
  | 'analytics.question'
  | 'crawlers.manage'

const ACTION_ACCESS: Record<PermissionAction, AccessLevel> = {
  'users.manage': 'admin',
  'groups.manage': 'admin',
  'questions.manage': 'admin',
  'questions.read': 'authenticated',
  'questions.answer': 'authenticated',
  'tags.manage': 'admin',
  'tags.read': 'authenticated',
  'simulations.manage': 'admin',
  'simulations.read': 'authenticated',
  'simulations.attempt': 'authenticated',
  'flashcards.manage': 'admin',
  'flashcards.read': 'authenticated',
  'flashcards.review': 'authenticated',
  'studyPlans.manage': 'authenticated',
  'exams.manage': 'admin',
  'exams.read': 'authenticated',
  'exams.attempt': 'authenticated',
  'pdfParser.manage': 'admin',
  'pdfParser.read': 'authenticated',
  'analytics.dashboard': 'authenticated',
  'analytics.group': 'authenticated',
  'analytics.question': 'admin',
  'crawlers.manage': 'admin',
}

export type AppView =
  | 'student.dashboard'
  | 'student.questions'
  | 'student.exams'
  | 'student.simulations'
  | 'student.studyPlans'
  | 'student.history'
  | 'student.settings'
  | 'admin.dashboard'
  | 'admin.questions'
  | 'admin.exams'
  | 'admin.simulations'
  | 'admin.parser'
  | 'admin.users'
  | 'admin.groups'
  | 'admin.tags'
  | 'admin.settings'

export const VIEW_PERMISSIONS: Record<AppView, PermissionAction[]> = {
  'student.dashboard': ['analytics.dashboard'],
  'student.questions': ['questions.read', 'questions.answer'],
  'student.exams': ['exams.read', 'exams.attempt'],
  'student.simulations': ['simulations.read', 'simulations.attempt'],
  'student.studyPlans': ['studyPlans.manage'],
  'student.history': ['exams.read', 'simulations.read'],
  'student.settings': [],
  'admin.dashboard': ['analytics.dashboard', 'analytics.question'],
  'admin.questions': ['questions.manage', 'questions.read'],
  'admin.exams': ['exams.manage'],
  'admin.simulations': ['simulations.manage'],
  'admin.parser': ['pdfParser.manage'],
  'admin.users': ['users.manage'],
  'admin.groups': ['groups.manage'],
  'admin.tags': ['tags.manage', 'tags.read'],
  'admin.settings': [],
}

export const ROUTE_TO_VIEW: Record<string, AppView> = {
  '/dashboard': 'student.dashboard',
  '/questoes': 'student.questions',
  '/simulado': 'student.simulations',
  '/provas': 'student.exams',
  '/simulados': 'student.simulations',
  '/plano-estudos': 'student.studyPlans',
  '/historico': 'student.history',
  '/configuracoes': 'student.settings',
  '/admin': 'admin.dashboard',
  '/admin/questoes': 'admin.questions',
  '/admin/provas': 'admin.exams',
  '/admin/simulados': 'admin.simulations',
  '/admin/parser': 'admin.parser',
  '/admin/usuarios': 'admin.users',
  '/admin/grupos': 'admin.groups',
  '/admin/tags': 'admin.tags',
  '/admin/configuracoes': 'admin.settings',
  '/configuracoes': 'student.settings',
  '/suporte': 'student.dashboard',
}

function satisfiesLevel(role: UserRole | null, level: AccessLevel): boolean {
  if (level === 'public') return true
  if (!role) return false
  if (level === 'authenticated') return true
  return role === 'admin'
}

export function canPerformAction(role: UserRole | null, action: PermissionAction): boolean {
  const level = ACTION_ACCESS[action]
  return satisfiesLevel(role, level)
}

export function canAccessView(role: UserRole | null, view: AppView): boolean {
  const actions = VIEW_PERMISSIONS[view]
  if (actions.length === 0) return role !== null
  return actions.every((action) => canPerformAction(role, action))
}

export function isAdminRole(role: UserRole | null): boolean {
  return role === 'admin'
}

export function getDefaultHomePath(role: UserRole | null): string {
  if (role === 'admin') return '/admin'
  return '/dashboard'
}
