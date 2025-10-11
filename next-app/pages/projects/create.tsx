import { useState, FormEvent } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Header from '@/components/Header'
import Button from '@/components/Button'
import { createProject } from '@/lib/projects'
import { PROJECT_CATEGORIES, TECH_STACKS } from '@/types/project'

export default function CreateProjectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    budget_min: '',
    budget_max: '',
    deadline: '',
    technologies: [] as string[],
    estimated_duration: '',
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)

    try {
      await createProject({
        ...formData,
        budget_min: parseInt(formData.budget_min),
        budget_max: parseInt(formData.budget_max),
        technologies: formData.technologies.length > 0 ? formData.technologies : undefined,
        estimated_duration: formData.estimated_duration || undefined,
      })
      router.push('/')
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors)
      } else {
        setErrors({ general: '案件の投稿に失敗しました。' })
      }
    } finally {
      setLoading(false)
    }
  }

  const toggleTechnology = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.includes(tech)
        ? prev.technologies.filter((t) => t !== tech)
        : [...prev.technologies, tech],
    }))
  }

  return (
    <>
      <Head>
        <title>案件投稿 - Devlogr</title>
      </Head>
      <div className="flex min-h-screen flex-col bg-black text-white">
        <Header />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">案件を投稿</h1>

            {errors.general && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-md">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* タイトル */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  タイトル<span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  placeholder="例：Next.jsでシンプルなWebアプリを作成"
                  required
                />
                {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
              </div>

              {/* カテゴリ */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  カテゴリ <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white [&>option]:bg-gray-900 [&>option]:text-white"
                >
                  <option value="">選択してください</option>
                  {Object.entries(PROJECT_CATEGORIES).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-400">{errors.category}</p>}
              </div>

              {/* 説明 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  説明 <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={8}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white resize-none"
                  placeholder="案件の詳細を記載してください（50文字以上）"
                />
                <p className="mt-1 text-sm text-gray-400">
                  {formData.description.length} / 50文字以上
                </p>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-400">{errors.description}</p>
                )}
              </div>

              {/* 予算 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    予算下限 <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      ¥
                    </span>
                    <input
                      type="number"
                      value={formData.budget_min}
                      onChange={(e) => setFormData({ ...formData, budget_min: e.target.value })}
                      className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      placeholder="100000"
                    />
                  </div>
                  {errors.budget_min && (
                    <p className="mt-1 text-sm text-red-400">{errors.budget_min}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    予算上限 <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      ¥
                    </span>
                    <input
                      type="number"
                      value={formData.budget_max}
                      onChange={(e) => setFormData({ ...formData, budget_max: e.target.value })}
                      className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      placeholder="300000"
                    />
                  </div>
                  {errors.budget_max && (
                    <p className="mt-1 text-sm text-red-400">{errors.budget_max}</p>
                  )}
                </div>
              </div>

              {/* 締切 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  締切日 <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                />
                {errors.deadline && <p className="mt-1 text-sm text-red-400">{errors.deadline}</p>}
              </div>

              {/* 技術スタック（任意） */}
              <div>
                <label className="block text-sm font-medium mb-2">技術スタック（任意）</label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(TECH_STACKS)
                    .slice(0, 20)
                    .map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => toggleTechnology(key)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                          formData.technologies.includes(key)
                            ? 'bg-blue-500 text-white'
                            : 'bg-white/10 text-white/80 hover:bg-white/20'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                </div>
              </div>

              {/* 想定期間（任意） */}
              <div>
                <label className="block text-sm font-medium mb-2">想定期間（任意）</label>
                <select
                  value={formData.estimated_duration}
                  onChange={(e) => setFormData({ ...formData, estimated_duration: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white [&>option]:bg-gray-900 [&>option]:text-white"
                >
                  <option value="">選択してください</option>
                  <option value="1週間以内">1週間以内</option>
                  <option value="2週間以内">2週間以内</option>
                  <option value="1ヶ月以内">1ヶ月以内</option>
                  <option value="2ヶ月以内">2ヶ月以内</option>
                  <option value="3ヶ月以内">3ヶ月以内</option>
                  <option value="3ヶ月以上">3ヶ月以上</option>
                </select>
              </div>

              {/* 送信ボタン */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="darkOutline"
                  size="lg"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  キャンセル
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  className="flex-1"
                >
                  投稿する
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  )
}
