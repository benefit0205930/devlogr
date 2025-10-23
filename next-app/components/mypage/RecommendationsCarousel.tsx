import { useId } from 'react'
import Link from 'next/link'
import { DashboardRecommendation } from '@/types/dashboard'

interface RecommendationsCarouselProps {
  title: string
  items: DashboardRecommendation[]
  emptyMessage?: string
  compact?: boolean
}

export function RecommendationsCarousel({
  title,
  items,
  emptyMessage,
  compact = false,
}: RecommendationsCarouselProps) {
  const headingId = useId()

  return (
    <section
      className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6"
      aria-labelledby={headingId}
      role="region"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 id={headingId} className="text-lg font-semibold text-gray-900">
          {title}
        </h2>
        <Link href="/projects" className="text-sm text-blue-600 hover:text-blue-700">
          すべての案件を見る
        </Link>
      </div>
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-10 text-center text-sm text-gray-500">
          {emptyMessage ?? '表示する案件はまだありません。'}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2 snap-x" role="list">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="snap-start min-w-[240px] sm:min-w-[280px] rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              role="listitem"
              aria-label={`${item.title} の詳細を見る`}
            >
              <div className="p-5 flex flex-col gap-3 h-full">
                {item.isNew && (
                  <span className="inline-flex w-fit items-center rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-medium text-emerald-700">
                    NEW
                  </span>
                )}
                <h3 className="text-sm font-semibold text-gray-900 min-h-[40px]">{item.title}</h3>
                <p className="text-xs text-gray-500 min-h-[48px]">{item.summary}</p>
                <div className="mt-auto space-y-2 text-xs text-gray-500">
                  <div className="flex flex-wrap gap-2">
                    {item.rewardRange ? (
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-700">
                        {item.rewardRange}
                      </span>
                    ) : null}
                    {item.workload ? (
                      <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700">
                        {item.workload}
                      </span>
                    ) : null}
                  </div>
                  {item.budgetRange && <div>予算: {item.budgetRange}</div>}
                  {item.dueDate && <div>期限: {formatDate(item.dueDate)}</div>}
                  {item.skills && item.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {item.skills.slice(0, compact ? 2 : 4).map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-gray-200 px-2 py-1 text-[11px] text-gray-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
          <Link
            href="/projects"
            className="snap-start min-w-[200px] sm:min-w-[220px] rounded-2xl border border-blue-200 bg-blue-50/70 p-5 text-sm font-medium text-blue-700 transition hover:-translate-y-0.5 hover:bg-blue-100 hover:shadow-md flex flex-col items-start justify-center gap-2"
            role="listitem"
            aria-label="案件検索ページへ遷移する"
          >
            <span className="text-base font-semibold">もっと見る</span>
            <span className="text-xs text-blue-600">案件検索ページでさらに探す →</span>
          </Link>
        </div>
      )}
    </section>
  )
}

function formatDate(date: string) {
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) {
    return date
  }
  return parsed.toLocaleDateString('ja-JP', {
    month: 'numeric',
    day: 'numeric',
  })
}
