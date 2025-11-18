import { clsx, type ClassValue } from 'clsx'
import { ProjectStatus } from '@/types/project'
import { DashboardTaskType } from '@/types/dashboard'

/**
 * クラス名をマージするユーティリティ関数
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

/**
 * プロジェクトステータスに応じたバッジのクラス名を返す
 */
export function getProjectStatusBadgeClass(status: ProjectStatus): string {
  const statusMap: Record<ProjectStatus, string> = {
    draft: 'bg-gray-100 text-gray-800',
    open: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }
  return statusMap[status] || statusMap.draft
}

/**
 * プロジェクトステータスのラベルを返す
 */
export function getProjectStatusLabel(status: ProjectStatus): string {
  const statusMap: Record<ProjectStatus, string> = {
    draft: '下書き',
    open: '公開中',
    in_progress: '進行中',
    completed: '完了',
    cancelled: 'キャンセル',
  }
  return statusMap[status] || status
}

/**
 * タスクタイプに応じたバッジのクラス名を返す
 */
export function getTaskTypeBadgeClass(type: DashboardTaskType): string {
  const typeMap: Record<DashboardTaskType, string> = {
    message: 'bg-blue-100 text-blue-700',
    milestone: 'bg-purple-100 text-purple-700',
    submission: 'bg-emerald-100 text-emerald-700',
    review: 'bg-amber-100 text-amber-700',
    reminder: 'bg-gray-200 text-gray-700',
  }
  return typeMap[type] || 'bg-gray-200 text-gray-600'
}

/**
 * タスクタイプのラベルを返す
 */
export function getTaskTypeLabel(type: DashboardTaskType): string {
  const typeMap: Record<DashboardTaskType, string> = {
    message: 'メッセージ',
    milestone: 'マイルストーン',
    submission: '納品',
    review: 'レビュー',
    reminder: 'リマインダー',
  }
  return typeMap[type] || 'タスク'
}

type TaskPriority = 'low' | 'medium' | 'high'

/**
 * 優先度に応じたボーダークラス名を返す
 */
export function getPriorityBorderClass(priority: TaskPriority): string {
  const priorityMap: Record<TaskPriority, string> = {
    high: 'border-l-4 border-l-red-400 pl-3',
    medium: 'border-l-4 border-l-amber-400 pl-3',
    low: 'border-l-4 border-l-emerald-300 pl-3',
  }
  return priorityMap[priority] || priorityMap.low
}

/**
 * 優先度に応じたテキストクラス名を返す
 */
export function getPriorityTextClass(priority: TaskPriority): string {
  const priorityMap: Record<TaskPriority, string> = {
    high: 'text-red-600',
    medium: 'text-amber-600',
    low: 'text-emerald-600',
  }
  return priorityMap[priority] || priorityMap.low
}

/**
 * 優先度のラベルを返す
 */
export function getPriorityLabel(priority: TaskPriority): string {
  const priorityMap: Record<TaskPriority, string> = {
    high: '優先度: 高',
    medium: '優先度: 中',
    low: '優先度: 低',
  }
  return priorityMap[priority] || priorityMap.low
}
