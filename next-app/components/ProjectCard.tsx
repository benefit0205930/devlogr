import Link from 'next/link'
import { Project } from '@/types/project'
import BookmarkButton from './BookmarkButton'
import { cn, getProjectStatusBadgeClass, getProjectStatusLabel } from '@/lib/utils'

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

  return (
    <Link href={`/projects/${project.id}`} className="block h-full">
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow relative h-full flex flex-col">
        <div className="absolute top-4 right-4">
          <BookmarkButton projectId={project.id} isBookmarked={project.is_bookmarked || false} />
        </div>
        <div className="mb-4 flex-1">
          <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
          <p className="text-gray-600 line-clamp-3">{project.description}</p>
        </div>

        <div className="space-y-2 mb-4 mt-auto">
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
            className={cn(
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              getProjectStatusBadgeClass(project.status)
            )}
          >
            {getProjectStatusLabel(project.status)}
          </span>
          <span className="text-sm text-gray-500">投稿者: {project.user.name}</span>
        </div>
      </div>
    </Link>
  )
}
