import { useState, useCallback, useMemo, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  ProjectFilters,
  FilterPreset,
  ProjectCategoryKey,
  TechStackKey,
  ProjectStatus,
  ProjectSortBy,
} from '@/types/project'
import { useDebounce } from '@/hooks/useDebounce'

const defaultFilters: ProjectFilters = {
  categories: [],
  priceRange: {
    min: null,
    max: null,
  },
  status: [],
  deadline: {
    daysRemaining: null,
  },
  technologies: [],
  searchQuery: '',
  excludeKeywords: [],
  sortBy: 'recommended',
  bookmarkedOnly: false,
  excludeApplied: false,
}

// プリセットフィルタ
const filterPresets: FilterPreset[] = [
  {
    id: 'beginner-friendly',
    name: '初心者歓迎',
    icon: '🌱',
    description: '比較的簡単な案件',
    filters: {
      priceRange: { min: 50000, max: 200000 },
      categories: ['WEB_DEVELOPMENT', 'DESIGN'],
    },
  },
  {
    id: 'high-budget',
    name: '高単価案件',
    icon: '💎',
    description: '50万円以上の案件',
    filters: {
      priceRange: { min: 500000, max: null },
      sortBy: 'price_high',
    },
  },
  {
    id: 'urgent',
    name: '急募案件',
    icon: '🚀',
    description: '締切が近い案件',
    filters: {
      deadline: { daysRemaining: 7 },
      sortBy: 'deadline_soon',
    },
  },
  {
    id: 'ai-projects',
    name: 'AI・データ分析',
    icon: '🤖',
    description: 'AI関連の案件',
    filters: {
      categories: ['AI_ML', 'DATA_ANALYSIS'],
    },
  },
]

export const useProjectFilters = () => {
  const router = useRouter()
  const [filters, setFilters] = useState<ProjectFilters>(defaultFilters)
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)
  const [savedPresets, setSavedPresets] = useState<FilterPreset[]>([])

  // デバウンスされた検索クエリ
  const debouncedSearchQuery = useDebounce(filters.searchQuery, 300)

  // LocalStorageから保存済みプリセットを読み込み
  useEffect(() => {
    const saved = localStorage.getItem('savedFilters')
    if (saved) {
      try {
        setSavedPresets(JSON.parse(saved))
      } catch (err) {
        console.error('Failed to parse saved filters:', err)
      }
    }
  }, [])

  // URLクエリパラメータとの同期
  useEffect(() => {
    const query = router.query
    if (Object.keys(query).length === 0) return

    const newFilters: ProjectFilters = {
      ...defaultFilters,
      categories: query.categories
        ? (String(query.categories).split(',') as ProjectCategoryKey[])
        : [],
      searchQuery: query.q ? String(query.q) : '',
      sortBy: (query.sort as ProjectSortBy) || 'recommended',
      priceRange: {
        min: query.budget_min ? Number(query.budget_min) : null,
        max: query.budget_max ? Number(query.budget_max) : null,
      },
      deadline: {
        daysRemaining: query.days_remaining ? Number(query.days_remaining) : null,
      },
      technologies: query.technologies
        ? (String(query.technologies).split(',') as TechStackKey[])
        : [],
      status: query.status ? (String(query.status).split(',') as ProjectStatus[]) : [],
      bookmarkedOnly: query.bookmarked_only === 'true',
    }
    setFilters(newFilters)
  }, [router.query])

  // フィルタ更新時にURLを更新
  const updateURL = useCallback(
    (newFilters: ProjectFilters) => {
      const query: Record<string, string> = {}

      if (newFilters.categories.length > 0) {
        query.categories = newFilters.categories.join(',')
      }
      if (newFilters.searchQuery) {
        query.q = newFilters.searchQuery
      }
      if (newFilters.sortBy !== 'recommended') {
        query.sort = newFilters.sortBy
      }
      if (newFilters.priceRange.min !== null) {
        query.budget_min = String(newFilters.priceRange.min)
      }
      if (newFilters.priceRange.max !== null) {
        query.budget_max = String(newFilters.priceRange.max)
      }
      if (newFilters.deadline.daysRemaining !== null) {
        query.days_remaining = String(newFilters.deadline.daysRemaining)
      }
      if (newFilters.technologies.length > 0) {
        query.technologies = newFilters.technologies.join(',')
      }
      if (newFilters.status.length > 0) {
        query.status = newFilters.status.join(',')
      }
      if (newFilters.bookmarkedOnly) {
        query.bookmarked_only = 'true'
      }

      router.push({ pathname: router.pathname, query }, undefined, { shallow: true })
    },
    [router]
  )

  // フィルタ更新関数
  const updateFilter = useCallback(
    <K extends keyof ProjectFilters>(key: K, value: ProjectFilters[K]) => {
      setFilters((prev) => {
        const newFilters = { ...prev, [key]: value }
        updateURL(newFilters)
        return newFilters
      })
    },
    [updateURL]
  )

  // カテゴリトグル
  const toggleCategory = useCallback(
    (category: ProjectCategoryKey) => {
      setFilters((prev) => {
        const newCategories = prev.categories.includes(category)
          ? prev.categories.filter((c) => c !== category)
          : [...prev.categories, category]
        const newFilters = { ...prev, categories: newCategories }
        updateURL(newFilters)
        return newFilters
      })
    },
    [updateURL]
  )

  // 技術スタックトグル
  const toggleTechnology = useCallback(
    (tech: TechStackKey) => {
      setFilters((prev) => {
        const newTechnologies = prev.technologies.includes(tech)
          ? prev.technologies.filter((t) => t !== tech)
          : [...prev.technologies, tech]
        const newFilters = { ...prev, technologies: newTechnologies }
        updateURL(newFilters)
        return newFilters
      })
    },
    [updateURL]
  )

  // ステータストグル
  const toggleStatus = useCallback(
    (status: ProjectStatus) => {
      setFilters((prev) => {
        const newStatus = prev.status.includes(status)
          ? prev.status.filter((s) => s !== status)
          : [...prev.status, status]
        const newFilters = { ...prev, status: newStatus }
        updateURL(newFilters)
        return newFilters
      })
    },
    [updateURL]
  )

  // 価格範囲設定
  const setPriceRange = useCallback(
    (min: number | null, max: number | null) => {
      setFilters((prev) => {
        const newFilters = { ...prev, priceRange: { min, max } }
        updateURL(newFilters)
        return newFilters
      })
    },
    [updateURL]
  )

  // フィルタリセット
  const resetFilters = useCallback(() => {
    setFilters(defaultFilters)
    router.push(router.pathname, undefined, { shallow: true })
  }, [router])

  // プリセット適用
  const applyPreset = useCallback(
    (preset: FilterPreset) => {
      const newFilters = {
        ...defaultFilters,
        ...preset.filters,
      } as ProjectFilters
      setFilters(newFilters)
      updateURL(newFilters)
    },
    [updateURL]
  )

  // フィルタ保存
  const saveCurrentFilters = useCallback(
    (name: string, icon: string = '⭐') => {
      const newPreset: FilterPreset = {
        id: `custom-${Date.now()}`,
        name,
        icon,
        filters: { ...filters },
        isCustom: true,
        createdAt: new Date().toISOString(),
      }
      const updated = [...savedPresets, newPreset]
      setSavedPresets(updated)
      localStorage.setItem('savedFilters', JSON.stringify(updated))
    },
    [filters, savedPresets]
  )

  // プリセット削除
  const deletePreset = useCallback(
    (presetId: string) => {
      const updated = savedPresets.filter((p) => p.id !== presetId)
      setSavedPresets(updated)
      localStorage.setItem('savedFilters', JSON.stringify(updated))
    },
    [savedPresets]
  )

  // アクティブなフィルタ数を計算
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.categories.length > 0) count += filters.categories.length
    if (filters.technologies.length > 0) count += filters.technologies.length
    if (filters.priceRange.min || filters.priceRange.max) count++
    if (filters.searchQuery) count++
    if (filters.deadline.daysRemaining) count++
    if (filters.status.length > 0) count += filters.status.length
    if (filters.bookmarkedOnly) count++
    return count
  }, [filters])

  // フィルタが適用されているか
  const hasActiveFilters = activeFilterCount > 0

  return {
    filters,
    debouncedSearchQuery,
    updateFilter,
    toggleCategory,
    toggleTechnology,
    toggleStatus,
    setPriceRange,
    resetFilters,
    applyPreset,
    saveCurrentFilters,
    deletePreset,
    activeFilterCount,
    hasActiveFilters,
    isFilterPanelOpen,
    setIsFilterPanelOpen,
    filterPresets,
    savedPresets,
  }
}
