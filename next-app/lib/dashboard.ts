import type { AxiosResponse } from 'axios'
import { CanceledError } from 'axios'
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

interface DashboardRequestOptions {
  signal?: AbortSignal
}

const unwrap = <T>(response: AxiosResponse<T>) => response.data

const buildRequestConfig = (mode: DashboardMode, options?: DashboardRequestOptions) => {
  const config: { params: { mode: DashboardMode }; signal?: AbortSignal } = {
    params: { mode },
  }

  if (options?.signal) {
    config.signal = options.signal
  }

  return config
}

const createListFetcher =
  <T>(endpoint: string) =>
  async (mode: DashboardMode, options?: DashboardRequestOptions): Promise<T[]> => {
    const response = await api.get<ListResponse<T>>(endpoint, buildRequestConfig(mode, options))
    return unwrap(response).data
  }

export const getDashboardSummary = async (
  mode: DashboardMode,
  options?: DashboardRequestOptions
): Promise<SummaryResponse> => {
  const response = await api.get<SummaryResponse>(
    '/api/dashboard/summary',
    buildRequestConfig(mode, options)
  )
  return unwrap(response)
}

export const getDashboardTasks = createListFetcher<DashboardTask>('/api/dashboard/tasks')

export const getDashboardRecommendations = createListFetcher<DashboardRecommendation>(
  '/api/dashboard/recommendations'
)

export const getDashboardSavedProjects = createListFetcher<DashboardRecommendation>(
  '/api/dashboard/saved-projects'
)

export const getDashboardSupportResources = createListFetcher<SupportResource>(
  '/api/dashboard/resources'
)

export const fetchDashboardData = async (
  mode: DashboardMode,
  options?: DashboardRequestOptions
): Promise<DashboardData> => {
  try {
    const [summary, tasks, recommendations, savedProjects, supportResources] = await Promise.all([
      getDashboardSummary(mode, options),
      getDashboardTasks(mode, options),
      getDashboardRecommendations(mode, options),
      getDashboardSavedProjects(mode, options),
      getDashboardSupportResources(mode, options),
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
    if (error instanceof CanceledError) {
      throw error
    }

    console.error('Failed to fetch dashboard data:', error)
    throw error
  }
}
