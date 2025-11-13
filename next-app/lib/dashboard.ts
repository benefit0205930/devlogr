import api from './api'
import type { AxiosResponse } from 'axios'
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

const unwrap = <T>(response: AxiosResponse<T>) => response.data

const withMode = (mode: DashboardMode) => ({ params: { mode } })

export const getDashboardSummary = async (mode: DashboardMode): Promise<SummaryResponse> => {
  const response = await api.get<SummaryResponse>('/api/dashboard/summary', withMode(mode))
  return unwrap(response)
}

export const getDashboardTasks = async (mode: DashboardMode): Promise<DashboardTask[]> => {
  const response = await api.get<ListResponse<DashboardTask>>(
    '/api/dashboard/tasks',
    withMode(mode)
  )
  return unwrap(response).data
}

export const getDashboardRecommendations = async (
  mode: DashboardMode
): Promise<DashboardRecommendation[]> => {
  const response = await api.get<ListResponse<DashboardRecommendation>>(
    '/api/dashboard/recommendations',
    withMode(mode)
  )
  return unwrap(response).data
}

export const getDashboardSavedProjects = async (
  mode: DashboardMode
): Promise<DashboardRecommendation[]> => {
  const response = await api.get<ListResponse<DashboardRecommendation>>(
    '/api/dashboard/saved-projects',
    withMode(mode)
  )
  return unwrap(response).data
}

export const getDashboardSupportResources = async (
  mode: DashboardMode
): Promise<SupportResource[]> => {
  const response = await api.get<ListResponse<SupportResource>>(
    '/api/dashboard/resources',
    withMode(mode)
  )
  return unwrap(response).data
}

export const fetchDashboardData = async (mode: DashboardMode): Promise<DashboardData> => {
  try {
    const [summary, tasks, recommendations, savedProjects, supportResources] = await Promise.all([
      getDashboardSummary(mode),
      getDashboardTasks(mode),
      getDashboardRecommendations(mode),
      getDashboardSavedProjects(mode),
      getDashboardSupportResources(mode),
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
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
    throw error
  }
}
