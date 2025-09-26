interface ProjectFiltersProps {
  searchQuery: string
  setSearchQuery: (value: string) => void
  statusFilter: string
  setStatusFilter: (value: string) => void
  budgetFilter: string
  setBudgetFilter: (value: string) => void
  sortBy: string
  setSortBy: (value: string) => void
}

export default function ProjectFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  budgetFilter,
  setBudgetFilter,
  sortBy,
  setSortBy,
}: ProjectFiltersProps) {
  return (
    <div className="bg-gray-900 rounded-lg p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 検索ボックス */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium mb-2">キーワード検索</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="案件名や説明文で検索..."
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
          />
        </div>

        {/* ステータスフィルター */}
        <div>
          <label className="block text-sm font-medium mb-2">ステータス</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
          >
            <option value="all">すべて</option>
            <option value="open">公開中</option>
            <option value="in_progress">進行中</option>
            <option value="completed">完了</option>
          </select>
        </div>

        {/* 予算フィルター */}
        <div>
          <label className="block text-sm font-medium mb-2">予算範囲</label>
          <select
            value={budgetFilter}
            onChange={(e) => setBudgetFilter(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
          >
            <option value="all">すべて</option>
            <option value="under50">5万円未満</option>
            <option value="50to100">5万円〜10万円</option>
            <option value="100to300">10万円〜30万円</option>
            <option value="over300">30万円以上</option>
          </select>
        </div>

        {/* ソート */}
        <div>
          <label className="block text-sm font-medium mb-2">並び替え</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
          >
            <option value="latest">新着順</option>
            <option value="deadline">締切が近い順</option>
            <option value="budget_high">予算が高い順</option>
            <option value="budget_low">予算が低い順</option>
          </select>
        </div>
      </div>
    </div>
  )
}
