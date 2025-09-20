import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Devlogrへようこそ</h1>

          <p className="text-lg text-gray-600 mb-8">開発者のための案件共有プラットフォームです。</p>

          <section className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">最新の案件</h2>
            <p className="text-gray-600">準備中...</p>
          </section>

          <section className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">注目のプロジェクト</h2>
            <p className="text-gray-600">準備中...</p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
