import api from './api'
import { ProjectsResponse, Project } from '@/types/project'

export const getProjects = async (page: number = 1) => {
  const response = await api.get<ProjectsResponse>(`/api/projects?page=${page}`)
  return response.data
}

export const getProject = async (id: string | number) => {
  const response = await api.get<Project>(`/api/project/${id}`)
  return response.data
}
