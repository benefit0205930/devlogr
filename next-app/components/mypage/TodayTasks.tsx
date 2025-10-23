import Link from 'next/link'
import { clsx } from 'clsx'
import { DashboardTask } from '@/types/dashboard'

interface TodayTasksProps {
  tasks: DashboardTask[]
  emptyStateReminderHref?: string
  isLoading?: boolean
  isError?: boolean
}

export function TodayTasks({
  tasks,
  emptyStateReminderHref,
  isLoading = false,
  isError = false,
}: TodayTasksProps) {
  const headingId = 'mypage-today-tasks'

  if (isError) {
    return (
      <section
        className="bg-white rounded-3xl border border-red-200 px-6 py-10 text-center shadow-sm"
        aria-labelledby={headingId}
        role="alert"
      >
        <h2 id={headingId} className="text-lg font-semibold text-red-600">
          タスクを読み込めませんでした
        </h2>
        <p className="mt-2 text-sm text-red-500">時間を置いて再度お試しください。</p>
      </section>
    )
  }

  if (isLoading) {
    return (
      <section
        className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6"
        aria-labelledby={headingId}
        role="region"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id={headingId} className="text-lg font-semibold text-gray-900">
            今日のタスク
          </h2>
          <span className="h-4 w-24 rounded bg-gray-200 animate-pulse" aria-hidden />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-gray-50/80 p-4 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <span className="h-6 w-20 rounded-full bg-gray-200" aria-hidden />
                <span className="h-4 w-32 rounded bg-gray-200" aria-hidden />
              </div>
              <span className="h-5 w-1/2 rounded bg-gray-200" aria-hidden />
              <span className="h-4 w-2/3 rounded bg-gray-100" aria-hidden />
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (tasks.length === 0) {
    return (
      <section
        className="bg-white rounded-3xl border border-dashed border-gray-200 px-6 py-10 text-center shadow-sm"
        aria-labelledby={headingId}
        role="region"
      >
        <h2 id={headingId} className="text-lg font-semibold text-gray-900">
          今日のタスクはありません
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          今のうちにプロフィール更新や新しい案件チェックをしてみましょ。
        </p>
        <div className="mt-4 inline-flex flex-wrap justify-center gap-3 text-sm">
          <Link href="/projects">案件を探す</Link>
          <Link href="/profile">プロフィールを編集</Link>
          <Link href={emptyStateReminderHref ?? '/notifications/reminders'}>
            リマインダーを設定
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section
      className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6"
      aria-labelledby={headingId}
      role="region"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 id={headingId} className="text-lg font-semibold text-gray-900">
          今日のタスク
        </h2>
        <Link href="/tasks" className="text-sm text-blue-600 hover:text-blue-700">
          タスク一覧を見る
        </Link>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <article
            key={task.id}
            className={clsx(
              'flex flex-col gap-4 rounded-2xl border border-gray-100 bg-gray-50/80 p-4 transition hover:bg-white hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 md:flex-row md:items-center md:justify-between',
              priorityClass(task.priority)
            )}
            tabIndex={0}
            role="group"
            aria-label={`${task.title}（${priorityLabel(task)}）`}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span
                  className={clsx(
                    'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
                    badgeClass(task.type)
                  )}
                >
                  {typeLabel(task.type)}
                </span>
                {task.dueDate && (
                  <span className="text-xs text-gray-500">期限: {formatDueDate(task.dueDate)}</span>
                )}
                {task.priorityLabel ? (
                  <span
                    className={clsx('text-[11px] font-medium', priorityAccentText(task.priority))}
                    aria-hidden
                  >
                    {task.priorityLabel}
                  </span>
                ) : null}
              </div>
              <h3 className="text-sm font-semibold text-gray-900">{task.title}</h3>
              {task.description && <p className="text-xs text-gray-500">{task.description}</p>}
            </div>
            {(task.ctaHref && task.ctaLabel) || task.reminderLink ? (
              <div className="flex flex-col items-start gap-2 md:items-end">
                {task.ctaHref && task.ctaLabel ? (
                  <Link
                    href={task.ctaHref}
                    className="inline-flex items-center justify-center rounded-full border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                  >
                    {task.ctaLabel}
                  </Link>
                ) : null}
                {task.reminderLink ? (
                  <Link
                    href={task.reminderLink}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    リマインダーを設定
                  </Link>
                ) : null}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  )
}

function typeLabel(type: DashboardTask['type']) {
  switch (type) {
    case 'message':
      return 'メッセージ'
    case 'milestone':
      return 'マイルストーン'
    case 'submission':
      return '納品'
    case 'review':
      return 'レビュー'
    case 'reminder':
      return 'リマインダー'
    default:
      return 'タスク'
  }
}

function badgeClass(type: DashboardTask['type']) {
  switch (type) {
    case 'message':
      return 'bg-blue-100 text-blue-700'
    case 'milestone':
      return 'bg-purple-100 text-purple-700'
    case 'submission':
      return 'bg-emerald-100 text-emerald-700'
    case 'review':
      return 'bg-amber-100 text-amber-700'
    case 'reminder':
      return 'bg-gray-200 text-gray-700'
    default:
      return 'bg-gray-200 text-gray-600'
  }
}

function priorityClass(priority: DashboardTask['priority']) {
  switch (priority) {
    case 'high':
      return 'border-l-4 border-l-red-400 pl-3'
    case 'medium':
      return 'border-l-4 border-l-amber-400 pl-3'
    case 'low':
    default:
      return 'border-l-4 border-l-emerald-300 pl-3'
  }
}

function priorityAccentText(priority: DashboardTask['priority']) {
  switch (priority) {
    case 'high':
      return 'text-red-600'
    case 'medium':
      return 'text-amber-600'
    case 'low':
    default:
      return 'text-emerald-600'
  }
}

function priorityLabel(task: DashboardTask) {
  if (task.priorityLabel) {
    return task.priorityLabel
  }

  switch (task.priority) {
    case 'high':
      return '優先度: 高'
    case 'medium':
      return '優先度: 中'
    case 'low':
    default:
      return '優先度: 低'
  }
}

function formatDueDate(date: string) {
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) {
    return date
  }
  return parsed.toLocaleDateString('ja-JP', {
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
  })
}
