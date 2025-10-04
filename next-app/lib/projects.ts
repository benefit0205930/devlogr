import api from './api'
import { ProjectsResponse, ProjectsFilterParams, Project } from '@/types/project'

export const getProjects = async (page: number = 1, params?: ProjectsFilterParams) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
  })

  if (params?.search) queryParams.append('search', params.search)
  if (params?.status) queryParams.append('status', params.status)
  if (params?.budget_min) queryParams.append('budget_min', params.budget_min.toString())
  if (params?.budget_max) queryParams.append('budget_max', params.budget_max.toString())
  if (params?.sort) queryParams.append('sort', params.sort)
  if (params?.categories) queryParams.append('categories', params.categories)
  if (params?.technologies) queryParams.append('technologies', params.technologies)
  if (params?.exclude_keywords) queryParams.append('exclude_keywords', params.exclude_keywords)
  if (params?.days_remaining) queryParams.append('days_remaining', params.days_remaining.toString())
  if (params?.bookmarked_only) queryParams.append('bookmarked_only', 'true')
  if (params?.exclude_applied) queryParams.append('exclude_applied', 'true')
  if (params?.per_page) queryParams.append('per_page', params.per_page.toString())

  const response = await api.get<ProjectsResponse>(`/api/projects?${queryParams}`)
  return response.data
}

export const getProject = async (id: string | number) => {
  const response = await api.get<Project>(`/api/project/${id}`)
  return response.data
}
