import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getProject } from '@/lib/projects'
import { Project } from '@/types/project'

export default function ProjectDetail() {
  const router = useRouter()
  const { id } = router.query
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) fetchProject()
  }, [id])

  const fetchProject = async () => {
    try {
      setLoading(true)
      const data = await getProject(id as string)
      setProject(data)
      setError(null)
    } catch (err) {
      setError('案件の取得に失敗しました。')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatBudget = (min: number, max: number) => {
    return `¥${min.toLocaleString()} - ¥${max.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
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

  if (error || !project) {
    return (
      <div className="flex min-h-screen flex-col bg-black text-white">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error || '案件が見つかりません。'}</p>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              トップページへ戻る
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{project.title} - Devlogr</title>
      </Head>
      <div className="flex min-h-screen flex-col bg-black text-white">
        <Header />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <button
              onClick={() => router.back()}
              className="mb-6 text-gray-400 hover:text-white flex　items-center gap-2"
            >
              ← 戻る
            </button>

            <div className="bg-gray-900 rounded-lg p-8">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold">{project.title}</h1>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}
                  >
                    {getStatusLabel(project.status)}
                  </span>
                </div>
                <div className="text-gray-400">
                  投稿者: {project.user.name} • 投稿日:{formatDate(project.created_at)}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-3">案件内容</h2>
                  <p className="text-gray-300 hitespace-pre-wrap">{project.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">予算</h3>
                    <p className="text-2xl font-bold text-blue-400">
                      {formatBudget(project.budget_min, project.budget_max)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">納期</h3>
                    <p className="text-2xl font-bold text-blue-400">
                      {formatDate(project.deadline)}
                    </p>
                  </div>
                </div>

                {project.status === 'open' && (
                  <div className="pt-6 border-t border-gray-700">
                    <button className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                      この案件に応募する
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}
