export type DashboardMode = 'worker' | 'client'

export interface DashboardSummary {
  userName: string
  headline?: string
  openProjects: number
  inProgressProjects: number
  unreadMessages: number
  pendingReviews: number
  nextActionText?: string
}

export type DashboardTaskType = 'message' | 'milestone' | 'submission' | 'review' | 'reminder'

export interface DashboardTask {
  id: string
  title: string
  description?: string
  dueDate?: string
  type: DashboardTaskType
  ctaLabel?: string
  ctaHref?: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'completed'
}

export interface DashboardRecommendation {
  id: string
  title: string
  summary: string
  budgetRange?: string
  dueDate?: string
  skills?: string[]
  href: string
  isNew?: boolean
}

export interface SupportResource {
  id: string
  title: string
  description?: string
  href: string
  category: 'guide' | 'webinar' | 'faq' | 'support'
}

export interface DashboardData {
  mode: DashboardMode
  summary: DashboardSummary
  todayTasks: DashboardTask[]
  recommendations: DashboardRecommendation[]
  savedProjects: DashboardRecommendation[]
  supportResources: SupportResource[]
}
