import api from './api'
import { ProjectsResponse, ProjectsParam, Project } from '@/types/project'

export const getProjects = async (page: number = 1, params?: ProjectsParam) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
  })

  if (params?.search) queryParams.append('search', params.search)
  if (params?.status) queryParams.append('status', params.status)
  if (params?.budget_min) queryParams.append('budget_min', params.budget_min.toString())
  if (params?.budget_max) queryParams.append('budget_max', params.budget_max.toString())
  if (params?.sort) queryParams.append('sort', params.sort)

  const response = await api.get<ProjectsResponse>(`/api/projects?${queryParams}`)
  return response.data
}

export const getProject = async (id: string | number) => {
  const response = await api.get<Project>(`/api/project/${id}`)
  return response.data
}
