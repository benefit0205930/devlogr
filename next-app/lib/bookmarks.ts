import api from './api'
import { BookmarkResponse, Project } from '@/types/project'

// ブックマークトグル（登録/削除）
export const toggleBookmark = async (projectId: number): Promise<BookmarkResponse> => {
  const response = await api.post<BookmarkResponse>(`/api/projects/${projectId}/bookmark`)
  return response.data
}

// ユーザーのブックマーク一覧取得
export const getBookmarks = async (): Promise<Project[]> => {
  const response = await api.get<Project[]>('/api/bookmarks')
  return response.data
}
