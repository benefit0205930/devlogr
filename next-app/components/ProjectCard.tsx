import { Project } from '@/types/project'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const formatBudget = (min: number, max: number) => {
    return `¥${min.toLocaleString()} - ¥${max.toLocaleString()}`
  }

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline)
    return date.toLocaleDateString('ja-JP')
  }

  const getStatusLabel = (status: Project['status']) => {
    const statusMap = {
      draft: '下書き',
      open: '公開中',
      in_progress: '進行中',
      completed: '完了',
      cancelled: 'キャンセル',
    }
    return statusMap[status]
  }

  const getStatusColor = (status: Project['status']) => {
    const colorMap = {
      draft: 'bg-gray-100 text-gray-800',
      open: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return colorMap[status]
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
        <p className="text-gray-600 line-clamp-3">{project.description}</p>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">予算</span>
          <span className="font-medium">
            {formatBudget(project.budget_min, project.budget_max)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">納期</span>
          <span className="font-medium">{formatDeadline(project.deadline)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}
        >
          {getStatusLabel(project.status)}
        </span>
        <span className="text-sm text-gray-500">投稿者: {project.user.name}</span>
      </div>
    </div>
  )
}
