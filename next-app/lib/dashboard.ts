import api from './api'
import type {
  DashboardData,
  DashboardHeroCTAVariants,
  DashboardMode,
  DashboardRecommendation,
  DashboardSummary,
  DashboardTask,
  SupportResource,
} from '@/types/dashboard'

type SummaryResponse = {
  mode: DashboardMode
  summary: DashboardSummary
  ctaVariants?: DashboardHeroCTAVariants
}

type ListResponse<T> = {
  data: T[]
}

const unwrap = <T>(response: { data: T }) => response.data

export const getDashboardSummary = async (): Promise<SummaryResponse> => {
  const response = await api.get<{ data: SummaryResponse }>('/api/dashboard/summary')
  return unwrap(response).data
}

export const getDashboardTasks = async (): Promise<DashboardTask[]> => {
  const response = await api.get<ListResponse<DashboardTask>>('/api/dashboard/tasks')
  return unwrap(response).data
}

export const getDashboardRecommendations = async (): Promise<DashboardRecommendation[]> => {
  const response = await api.get<ListResponse<DashboardRecommendation>>(
    '/api/dashboard/recommendations'
  )
  return unwrap(response).data
}

export const getDashboardSavedProjects = async (): Promise<DashboardRecommendation[]> => {
  const response = await api.get<ListResponse<DashboardRecommendation>>(
    '/api/dashboard/saved-projects'
  )
  return unwrap(response).data
}

export const getDashboardSupportResources = async (): Promise<SupportResource[]> => {
  const response = await api.get<ListResponse<SupportResource>>('/api/dashboard/resources')
  return unwrap(response).data
}

export const fetchDashboardData = async (): Promise<DashboardData> => {
  const [summary, tasks, recommendations, savedProjects, supportResources] = await Promise.all([
    getDashboardSummary(),
    getDashboardTasks(),
    getDashboardRecommendations(),
    getDashboardSavedProjects(),
    getDashboardSupportResources(),
  ])

  return {
    mode: summary.mode,
    summary: summary.summary,
    todayTasks: tasks,
    recommendations,
    savedProjects,
    supportResources,
    ctaVariants: summary.ctaVariants ?? {},
  }
}
