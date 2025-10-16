import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import ProjectCard from '@/components/ProjectCard'
import Button from '@/components/Button'
import { getProjects } from '@/lib/projects'
import { Project } from '@/types/project'

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalProjects, setTotalProjects] = useState(0)

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getProjects(1, { per_page: 6 })
      setProjects(response.data)
      setTotalProjects(response.total)
      setError(null)
    } catch (err) {
      setError('案件の取得に失敗しました')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Header />

      <main className="flex-1">
        <Hero />
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">最新の案件</h2>
            {loading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-600 py-8">{error}</div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
                <div className="flex justify-center">
                  <Link href="/projects">
                    <Button
                      variant="accent"
                      size="lg"
                      className="shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                    >
                      <span>全{totalProjects}件の案件を見る</span>
                      <svg
                        className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
