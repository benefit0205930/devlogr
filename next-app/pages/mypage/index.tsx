import Head from 'next/head'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ModeSwitcher } from '@/components/mypage/ModeSwitcher'
import { HeroSummary } from '@/components/mypage/HeroSummary'
import { TodayTasks } from '@/components/mypage/TodayTasks'
import { RecommendationsCarousel } from '@/components/mypage/RecommendationsCarousel'
import { SupportAccordion } from '@/components/mypage/SupportAccordion'
import { useModeSwitcher } from '@/hooks/useModeSwitcher'
import { useUserDashboard } from '@/hooks/useUserDashboard'

export default function MyPage() {
  const { mode, setMode, isPreviewMode } = useModeSwitcher()
  const { data, loading, error, heroCtas } = useUserDashboard({ mode })
  const mainSectionId = 'mypage-main'
  const emptyStateReminderHref =
    data?.todayTasks.find((task) => task.reminderLink)?.reminderLink ?? '/notifications/reminders'

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <a
        href={`#${mainSectionId}`}
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-blue-700 focus:shadow-lg"
      >
        メインコンテンツへスキップ
      </a>
      <Head>
        <title>マイページ | devlogr</title>
      </Head>
      <Header />
      <main id={mainSectionId} tabIndex={-1} className="flex-1 focus:outline-none">
        <div className="border-b border-gray-200 bg-white/80 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4 py-6">
            <ModeSwitcher mode={mode} onChange={setMode} />
            {isPreviewMode && (
              <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
                クライアントモードは現在準備中です。フェーズ2での提供を予定しています。
              </p>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
          {loading ? (
            <div className="flex min-h-[320px] items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-10 text-center text-sm text-red-700">
              <p>{error}</p>
              <button
                type="button"
                className="mt-4 inline-flex items-center rounded-full border border-red-500 px-4 py-2 text-red-600 hover:bg-red-100"
                onClick={() => setMode(mode)}
              >
                再読み込み
              </button>
            </div>
          ) : data ? (
            <>
              <HeroSummary summary={data.summary} cta={heroCtas} />
              <TodayTasks tasks={data.todayTasks} emptyStateReminderHref={emptyStateReminderHref} />
              <RecommendationsCarousel
                title="あなたへのおすすめ案件"
                items={data.recommendations}
                emptyMessage="おすすめ案件は現在ありません。プロフィールを更新するとよりマッチした案件が表示されます。"
              />
              <RecommendationsCarousel
                title="保存した案件"
                items={data.savedProjects}
                emptyMessage="保存した案件はまだありません。気になる案件を保存しておきましょ。"
                compact
              />
              <SupportAccordion resources={data.supportResources} />
            </>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  )
}
