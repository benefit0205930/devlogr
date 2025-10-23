import { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProjectCard from '@/components/ProjectCard'
import Pagination from '@/components/Pagination'
import { FilterPresetButton } from '@/components/projects/FilterPresetButton'
import { ProjectSearchBar } from '@/components/projects/ProjectSearchBar'
import { ActiveFilters } from '@/components/projects/ActiveFilters'
import { SortDropDown } from '@/components/projects/SortDropDown'
import { FilterPanel } from '@/components/projects/FilterPanel'
import { useProjectFilters } from '@/hooks/useProjectFilters'
import { getProjects } from '@/lib/projects'
import { Project, ProjectsFilterParams } from '@/types/project'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProjects, setTotalProjects] = useState(0)

  const {
    filters,
    debouncedSearchQuery,
    updateFilter,
    toggleCategory,
    toggleTechnology,
    toggleStatus,
    setPriceRange,
    resetFilters,
    applyPreset,
    activeFilterCount,
    hasActiveFilters,
    isFilterPanelOpen,
    setIsFilterPanelOpen,
    filterPresets,
  } = useProjectFilters()

  // フィルタが変更されたらページをリセット
  useEffect(() => {
    setCurrentPage(1)
  }, [
    filters.categories,
    filters.technologies,
    filters.status,
    filters.priceRange,
    filters.deadline,
    filters.sortBy,
    debouncedSearchQuery,
  ])

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true)

      // フィルタパラメータを構築
      const params: ProjectsFilterParams = {
        page: currentPage,
        search: debouncedSearchQuery || undefined,
        sort: filters.sortBy,
      }

      if (filters.categories.length > 0) {
        params.categories = filters.categories.join(',')
      }
      if (filters.technologies.length > 0) {
        params.technologies = filters.technologies.join(',')
      }
      if (filters.status.length > 0) {
        params.status = filters.status.join(',')
      }
      if (filters.priceRange.min !== null) {
        params.budget_min = filters.priceRange.min
      }
      if (filters.priceRange.max !== null) {
        params.budget_max = filters.priceRange.max
      }
      if (filters.deadline.daysRemaining !== null) {
        params.days_remaining = filters.deadline.daysRemaining
      }
      if (filters.bookmarkedOnly) {
        params.bookmarked_only = true
      }

      const response = await getProjects(currentPage, params)
      setProjects(response.data)
      setTotalPages(response.last_page)
      setTotalProjects(response.total)
      setError(null)
    } catch (error) {
      setError('案件の取得に失敗しました')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [currentPage, debouncedSearchQuery, filters])

  // プロジェクト取得
  useEffect(() => {
    void fetchProjects()
  }, [fetchProjects])

  if (loading && projects.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-black text-white">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col bg-black text-white">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center text-red-600">{error}</div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>案件一覧 - Devlogr</title>
      </Head>
      <div className="flex min-h-screen flex-col bg-black text-white">
        <Header />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* ページヘッダー */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4">案件一覧</h1>
              <p className="text-gray-400">
                全{totalProjects}件の案件
                {hasActiveFilters && ` (${activeFilterCount}個のフィルタ適用中)`}
              </p>
            </div>

            {/* プリセットボタン */}
            <div className="mb-6">
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {filterPresets.map((preset) => (
                  <FilterPresetButton
                    key={preset.id}
                    preset={preset}
                    onClick={() => applyPreset(preset)}
                  />
                ))}
              </div>
            </div>

            {/* 検索バー＆ソート */}
            <div className="mb-6 flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <ProjectSearchBar
                  value={filters.searchQuery}
                  onChange={(value) => updateFilter('searchQuery', value)}
                  onClear={() => updateFilter('searchQuery', '')}
                  excludeKeywords={filters.excludeKeywords}
                  onAddExcludeKeyword={(keyword) =>
                    updateFilter('excludeKeywords', [...filters.excludeKeywords, keyword])
                  }
                  onRemoveExcludeKeyword={(keyword) =>
                    updateFilter(
                      'excludeKeywords',
                      filters.excludeKeywords.filter((k) => k !== keyword)
                    )
                  }
                />
              </div>
              <div className="flex gap-3">
                <SortDropDown
                  value={filters.sortBy}
                  onChange={(value) => updateFilter('sortBy', value)}
                />
                <button
                  onClick={() => setIsFilterPanelOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium text-white/90 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all backdrop-blur-sm lg:hidden"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                  フィルタ
                  {activeFilterCount > 0 && (
                    <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* アクティブフィルタ */}
            {hasActiveFilters && (
              <div className="mb-6">
                <ActiveFilters
                  filters={filters}
                  onRemoveCategory={toggleCategory}
                  onRemoveTechnology={toggleTechnology}
                  onRemoveStatus={toggleStatus}
                  onClearPriceRange={() => setPriceRange(null, null)}
                  onClearDeadline={() => updateFilter('deadline', { daysRemaining: null })}
                  onClearAll={resetFilters}
                  activeFilterCount={activeFilterCount}
                />
              </div>
            )}

            {/* メインコンテンツ */}
            <div className="flex gap-6">
              {/* 案件一覧 */}
              <div className="flex-1">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-center text-gray-400 py-12 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-xl mb-4">案件が見つかりません</p>
                    {hasActiveFilters && (
                      <button
                        onClick={resetFilters}
                        className="text-blue-400 hover:text-blue-300 underline"
                      >
                        フィルタをリセット
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                      {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                      ))}
                    </div>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </>
                )}
              </div>

              {/* デスクトップ用フィルタパネル（サイドバー） */}
              <div className="hidden lg:block">
                <FilterPanel
                  filters={filters}
                  isOpen={true}
                  onClose={() => {}}
                  onToggleCategory={toggleCategory}
                  onToggleTechnology={toggleTechnology}
                  onToggleStatus={toggleStatus}
                  onSetPriceRange={setPriceRange}
                  onSetDeadline={(days) => updateFilter('deadline', { daysRemaining: days })}
                  onReset={resetFilters}
                  activeFilterCount={activeFilterCount}
                />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>

      {/* モバイル用フィルタパネル（モーダル） */}
      <FilterPanel
        filters={filters}
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        onToggleCategory={toggleCategory}
        onToggleTechnology={toggleTechnology}
        onToggleStatus={toggleStatus}
        onSetPriceRange={setPriceRange}
        onSetDeadline={(days) => updateFilter('deadline', { daysRemaining: days })}
        onReset={resetFilters}
        activeFilterCount={activeFilterCount}
      />
    </>
  )
}
