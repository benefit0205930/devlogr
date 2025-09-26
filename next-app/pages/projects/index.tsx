import { useState, useEffect } from 'react'
import Head from 'next/head'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProjectCard from '@/components/ProjectCard'
import ProjectFilters from '@/components/ProjectFilters'
import Pagination from '@/components/Pagination'
import { getProjects } from '@/lib/projects'
import { Project } from '@/types/project'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProjects, setTotalProjects] = useState(0)

  // フィルター状態
  const [searchQuery, setSearchQuery] = useState('')
  const [budgetFilter, setBudgetFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('latest')

  useEffect(() => {
    fetchProjects()
  }, [currentPage])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      // TODO: 将来的にはフィルターパラメータをAPIに渡す
      // const response = await getProjects(currentPage, {
      //   search: searchQuery,
      //   status: statusFilter !== 'all' ? statusFilter : undefined,
      //   sort: sortBy
      // })
      const response = await getProjects(currentPage)
      setProjects(response.data)
      setTotalPages(response.last_page)
      setTotalProjects(response.total)
      setError(null)
    } catch (err) {
      setError('案件の取得に失敗しました')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
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
              <p className="text-gray-400">全{totalProjects}件の案件</p>
            </div>

            {/* フィルターコンポーネント（ガワのみ） */}
            <ProjectFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              budgetFilter={budgetFilter}
              setBudgetFilter={setBudgetFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />

            {/* 案件一覧 */}
            {projects.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <p className="text-xl mb-4">案件が見つかりません</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}

            {/* ページネーション */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}
