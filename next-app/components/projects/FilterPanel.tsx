import { FC, useState } from 'react'
import {
  ProjectFilters,
  PROJECT_CATEGORIES,
  TECH_STACKS,
  PRICE_RANGES,
  DEADLINE_PRESETS,
  ProjectCategoryKey,
  TechStackKey,
  ProjectStatus,
} from '@/types/project'

interface FilterPanelProps {
  filters: ProjectFilters
  isOpen: boolean
  onClose: () => void
  onToggleCategory: (category: ProjectCategoryKey) => void
  onToggleTechnology: (tech: TechStackKey) => void
  onToggleStatus: (status: ProjectStatus) => void
  onSetPriceRange: (min: number | null, max: number | null) => void
  onSetDeadline: (days: number | null) => void
  onReset: () => void
  activeFilterCount: number
}

export const FilterPanel: FC<FilterPanelProps> = ({
  filters,
  isOpen,
  onClose,
  onToggleCategory,
  onToggleTechnology,
  onToggleStatus,
  onSetPriceRange,
  onSetDeadline,
  onReset,
  activeFilterCount,
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['category', 'price'])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    )
  }

  const statusLabels: Record<ProjectStatus, string> = {
    draft: '下書き',
    open: '募集中',
    in_progress: '進行中',
    completed: '完了',
    cancelled: 'キャンセル',
  }

  if (!isOpen) return null

  return (
    <>
      {/* オーバーレイ */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />

      {/* パネル本体 */}
      <div
        className={`
          fixed lg:sticky top-0 right-0 h-screen lg:h-auto
          w-full sm:w-96 lg:w-80
          bg-gray-900/95 lg:bg-transparent
          backdrop-blur-xl lg:backdrop-blur-none
          border-l lg:border-0 border-white/10
          shadow-2xl lg:shadow-none
          z-50 lg:z-0
          overflow-y-auto
          transition-transform duration-300
          ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}
      >
        {/* ヘッダー */}
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur-xl border-b border-white/10 p-4 lg:hidden">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">フィルタ</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white transition-all"
              aria-label="閉じる"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* リセットボタン */}
          {activeFilterCount > 0 && (
            <button
              onClick={onReset}
              className="w-full rounded-xl bg-red-500/20 px-4 py-2.5 text-sm font-medium text-red-300 hover:bg-red-500/30 transition-all border border-red-500/30"
            >
              すべてリセット ({activeFilterCount})
            </button>
          )}

          {/* カテゴリセクション */}
          <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection('category')}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-all"
            >
              <span className="font-semibold text-white">カテゴリ</span>
              <div className="flex items-center gap-2">
                {filters.categories.length > 0 && (
                  <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-300">
                    {filters.categories.length}
                  </span>
                )}
                <svg
                  className={`h-4 w-4 text-white/70 transition-transform ${
                    expandedSections.includes('category') ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>

            {expandedSections.includes('category') && (
              <div className="p-4 pt-0 space-y-2">
                {Object.entries(PROJECT_CATEGORIES).map(([key, label]) => (
                  <label
                    key={key}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-all group"
                  >
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(key as ProjectCategoryKey)}
                      onChange={() => onToggleCategory(key as ProjectCategoryKey)}
                      className="h-4 w-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-2 focus:ring-blue-500/50"
                    />
                    <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* 価格範囲セクション */}
          <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection('price')}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-all"
            >
              <span className="font-semibold text-white">価格範囲</span>
              <div className="flex items-center gap-2">
                {(filters.priceRange.min !== null || filters.priceRange.max !== null) && (
                  <span className="rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs font-medium text-yellow-300">
                    設定済み
                  </span>
                )}
                <svg
                  className={`h-4 w-4 text-white/70 transition-transform ${
                    expandedSections.includes('price') ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>

            {expandedSections.includes('price') && (
              <div className="p-4 pt-0 space-y-2">
                {PRICE_RANGES.map((range, index) => {
                  const isActive =
                    filters.priceRange.min === range.min && filters.priceRange.max === range.max
                  return (
                    <button
                      key={index}
                      onClick={() => onSetPriceRange(range.min, range.max)}
                      className={`
                        w-full text-left p-2 rounded-lg transition-all
                        ${
                          isActive
                            ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                            : 'text-white/80 hover:bg-white/5 hover:text-white'
                        }
                      `}
                    >
                      <span className="text-sm">{range.label}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* 期限セクション */}
          <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection('deadline')}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-all"
            >
              <span className="font-semibold text-white">応募期限</span>
              <div className="flex items-center gap-2">
                {filters.deadline.daysRemaining !== null && (
                  <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-xs font-medium text-orange-300">
                    {filters.deadline.daysRemaining}日
                  </span>
                )}
                <svg
                  className={`h-4 w-4 text-white/70 transition-transform ${
                    expandedSections.includes('deadline') ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>

            {expandedSections.includes('deadline') && (
              <div className="p-4 pt-0 space-y-2">
                {DEADLINE_PRESETS.map((preset, index) => {
                  const isActive = filters.deadline.daysRemaining === preset.days
                  return (
                    <button
                      key={index}
                      onClick={() => onSetDeadline(preset.days)}
                      className={`
                        w-full text-left p-2 rounded-lg transition-all
                        ${
                          isActive
                            ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                            : 'text-white/80 hover:bg-white/5 hover:text-white'
                        }
                      `}
                    >
                      <span className="text-sm">{preset.label}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* 技術スタックセクション */}
          <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection('tech')}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-all"
            >
              <span className="font-semibold text-white">技術スタック</span>
              <div className="flex items-center gap-2">
                {filters.technologies.length > 0 && (
                  <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-xs font-medium text-purple-300">
                    {filters.technologies.length}
                  </span>
                )}
                <svg
                  className={`h-4 w-4 text-white/70 transition-transform ${
                    expandedSections.includes('tech') ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>

            {expandedSections.includes('tech') && (
              <div className="p-4 pt-0 space-y-2 max-h-64 overflow-y-auto">
                {Object.entries(TECH_STACKS).map(([key, label]) => (
                  <label
                    key={key}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-all group"
                  >
                    <input
                      type="checkbox"
                      checked={filters.technologies.includes(key as TechStackKey)}
                      onChange={() => onToggleTechnology(key as TechStackKey)}
                      className="h-4 w-4 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-2 focus:ring-purple-500/50"
                    />
                    <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* ステータスセクション */}
          <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection('status')}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-all"
            >
              <span className="font-semibold text-white">ステータス</span>
              <div className="flex items-center gap-2">
                {filters.status.length > 0 && (
                  <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-300">
                    {filters.status.length}
                  </span>
                )}
                <svg
                  className={`h-4 w-4 text-white/70 transition-transform ${
                    expandedSections.includes('status') ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>

            {expandedSections.includes('status') && (
              <div className="p-4 pt-0 space-y-2">
                {Object.entries(statusLabels).map(([key, label]) => (
                  <label
                    key={key}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-all group"
                  >
                    <input
                      type="checkbox"
                      checked={filters.status.includes(key as ProjectStatus)}
                      onChange={() => onToggleStatus(key as ProjectStatus)}
                      className="h-4 w-4 rounded border-white/20 bg-white/10 text-green-500 focus:ring-2 focus:ring-green-500/50"
                    />
                    <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
