import { FC } from 'react'
import {
  ProjectFilters,
  PROJECT_CATEGORIES,
  TECH_STACKS,
  ProjectCategoryKey,
  TechStackKey,
  ProjectStatus,
} from '@/types/project'

interface ActiveFiltersProps {
  filters: ProjectFilters
  onRemoveCategory: (category: ProjectCategoryKey) => void
  onRemoveTechnology: (tech: TechStackKey) => void
  onRemoveStatus: (status: ProjectStatus) => void
  onClearPriceRange: () => void
  onClearDeadline: () => void
  onClearAll: () => void
  activeFilterCount: number
}

export const ActiveFilters: FC<ActiveFiltersProps> = ({
  filters,
  onRemoveCategory,
  onRemoveTechnology,
  onRemoveStatus,
  onClearPriceRange,
  onClearDeadline,
  onClearAll,
  activeFilterCount,
}) => {
  if (activeFilterCount === 0) return null

  const formatPrice = (price: number | null) => {
    if (price === null) return ''
    return `¥${price.toLocaleString()}`
  }

  const statusLabels: Record<ProjectStatus, string> = {
    draft: '下書き',
    open: '募集中',
    in_progress: '進行中',
    completed: '完了',
    cancelled: 'キャンセル',
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-white/70">フィルタ中 ({activeFilterCount})</span>

      {/* カテゴリタグ */}
      {filters.categories.map((category) => (
        <span
          key={category}
          className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-300 border border-blue-500/30"
        >
          {PROJECT_CATEGORIES[category]}
          <button
            onClick={() => onRemoveCategory(category)}
            className="hover:text-blue-100 transition-colors"
            aria-label={`${PROJECT_CATEGORIES[category]}を削除`}
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </span>
      ))}

      {/* 技術スタックタグ */}
      {filters.technologies.map((tech) => (
        <span
          key={tech}
          className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 px-3 py-1 text-sm text-purple-300 border border-purple-500/30"
        >
          {TECH_STACKS[tech]}
          <button
            onClick={() => onRemoveTechnology(tech)}
            className="hover:text-purple-100 transition-colors"
            aria-label={`${TECH_STACKS[tech]}を削除`}
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </span>
      ))}

      {/* ステータスタグ */}
      {filters.status.map((status) => (
        <span
          key={status}
          className="inline-flex items-center gap-1.5 rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-300 border border-green-500/30"
        >
          {statusLabels[status]}
          <button
            onClick={() => onRemoveStatus(status)}
            className="hover:text-green-100 transition-colors"
            aria-label={`${statusLabels[status]}を削除`}
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </span>
      ))}

      {/* 価格範囲タグ */}
      {(filters.priceRange.min !== null || filters.priceRange.max !== null) && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/20 px-3 py-1 text-sm text-yellow-300 border border-yellow-500/30">
          {filters.priceRange.min !== null && filters.priceRange.max !== null
            ? `${formatPrice(filters.priceRange.min)} 〜 ${formatPrice(filters.priceRange.max)}`
            : filters.priceRange.min !== null
              ? `${formatPrice(filters.priceRange.min)} 〜`
              : `〜 ${formatPrice(filters.priceRange.max)}`}
          <button
            onClick={onClearPriceRange}
            className="hover:text-yellow-100 transition-colors"
            aria-label="価格範囲を削除"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </span>
      )}

      {/* 期限タグ */}
      {filters.deadline.daysRemaining !== null && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/20 px-3 py-1 text-sm text-orange-300 border border-orange-500/30">
          {filters.deadline.daysRemaining}日以内
          <button
            onClick={onClearDeadline}
            className="hover:text-orange-100 transition-colors"
            aria-label="期限を削除"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </span>
      )}

      {/* ブックマークのみフィルタ */}
      {filters.bookmarkedOnly && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-500/20 px-3 py-1 text-sm text-pink-300 border border-pink-500/30">
          ⭐ ブックマークのみ
        </span>
      )}

      {/* すべてクリアボタン */}
      {activeFilterCount > 0 && (
        <button
          onClick={onClearAll}
          className="ml-2 rounded-full bg-red-500/20 px-4 py-1 text-sm font-medium text-red-300 hover:bg-red-500/30 transition-all border border-red-500/30"
        >
          すべてクリア
        </button>
      )}
    </div>
  )
}
