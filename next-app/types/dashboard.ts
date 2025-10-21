export type DashboardMode = 'worker' | 'client'

export type DashboardHeroVariant = 'default' | 'holiday' | 'firstVisit'

export interface DashboardCTA {
  label: string
  href: string
  ariaLabel?: string
}

export interface DashboardHeroCTASet {
  experimentKey?: string
  primary: DashboardCTA
  secondary: DashboardCTA
}

export type DashboardHeroCTAVariants = Partial<Record<DashboardHeroVariant, DashboardHeroCTASet>>

export interface DashboardSummary {
  userName: string
  headline?: string
  openProjects: number
  inProgressProjects: number
  unreadMessages: number
  pendingReviews: number
  nextActionText?: string
  variant?: DashboardHeroVariant
  specialMessage?: string
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
  priorityLabel?: string
  reminderLink?: string
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
  workload?: string
  rewardRange?: string
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
  ctaVariants: DashboardHeroCTAVariants
}
