import api from './api'
import { ProjectsResponse } from '@/types/project'

export const getProjects = async (page: number = 1) => {
  const response = await api.get<ProjectsResponse>(`/api/projects?page=${page}`)
  return response.data
}
