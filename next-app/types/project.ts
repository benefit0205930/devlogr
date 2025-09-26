export interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

export interface ProjectsParam {
  search?: string
  status?: string
  budget_min?: number
  budget_max?: number
  sort?: string
}

export interface Project {
  id: number
  user_id: number
  title: string
  description: string
  category?: string
  budget_min: number
  budget_max: number
  deadline: string
  status: 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
  user: User
}

export interface ProjectsResponse {
  current_page: number
  data: Project[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: Array<{
    url: string | null
    label: string
    active: boolean
  }>
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}
