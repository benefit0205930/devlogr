import Head from 'next/head'
import AdminLayout from '../../components/admin/AdminLayout'
import { AuthGuard } from '../../components/AuthGuard'

const metrics = [
  { label: '承認待ち案件', value: '18', delta: '+3', trend: 'bg-amber-100 text-amber-600' },
  { label: '本日の通報', value: '5', delta: '+2', trend: 'bg-rose-100 text-rose-600' },
  { label: '月間継続率', value: '87%', delta: '+4%', trend: 'bg-emerald-100 text-emerald-600' },
  { label: '平均対応 SLA', value: '2.6h', delta: '-0.4h', trend: 'bg-sky-100 text-sky-600' },
]

const recentActivities = [
  {
    time: '08:24',
    title: '案件「AI 記事ライター」を承認',
    by: '佐藤 ひかり',
    role: 'オペレーター',
  },
  {
    time: '09:10',
    title: 'ユーザー「kenta.dev」を BAN 解除',
    by: '田中 さくら',
    role: 'カスタマーサクセス',
  },
  {
    time: '10:02',
    title: '高額報酬案件をアラートに追加',
    by: 'Admin Bot',
    role: 'システム',
  },
]

const pendingReviews = [
  {
    id: 'PRJ-4821',
    title: 'Next.js SaaS の UI 改修',
    client: '株式会社オーロラ',
    reward: '¥320,000',
    submittedAt: '2024/03/10 21:40',
  },
  {
    id: 'PRJ-4819',
    title: '生成 AI 用ライティング案件',
    client: 'フリークエンシー合同会社',
    reward: '¥85,000',
    submittedAt: '2024/03/10 19:05',
  },
  {
    id: 'PRJ-4814',
    title: 'エンジニアマッチングの運用代行',
    client: 'DevWorkers Inc.',
    reward: '¥500,000',
    submittedAt: '2024/03/10 18:11',
  },
]

function DashboardContent() {
  return (
    <AdminLayout title="ダッシュボード">
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <section>
        <h2 className="text-lg font-semibold text-slate-900">モニタリング</h2>
        <p className="mt-1 text-sm text-slate-500">
          管理対象の KPI を把握し、異常検知や優先タスクの判断に役立てましょう。
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{metric.label}</p>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${metric.trend}`}>
                  {metric.delta}
                </span>
              </div>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{metric.value}</p>
              <p className="mt-2 text-xs text-slate-400">前日比での推移</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900">審査待ち案件</h3>
              <p className="mt-1 text-sm text-slate-500">
                案件審査 SLA は 12 時間を目安にしましょう。
              </p>
            </div>
            <button className="rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
              一覧を見る
            </button>
          </div>
          <div className="mt-4 divide-y divide-slate-100">
            {pendingReviews.map((review) => (
              <div
                key={review.id}
                className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{review.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{review.client}</p>
                </div>
                <div className="flex flex-col items-start gap-2 text-sm text-slate-600 md:flex-row md:items-center">
                  <span className="rounded-md bg-slate-100 px-2 py-1 font-medium text-slate-700">
                    {review.reward}
                  </span>
                  <span className="text-xs text-slate-400">申請日時: {review.submittedAt}</span>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
                    詳細
                  </button>
                  <button className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-slate-800">
                    承認
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">最近のアクティビティ</h3>
          <p className="mt-1 text-sm text-slate-500">運用メンバーの操作履歴を確認できます。</p>
          <div className="mt-4 space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.title} className="flex gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                  {activity.by.slice(0, 1)}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                  <p className="text-xs text-slate-500">
                    {activity.time} ・ {activity.by}（{activity.role}）
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AdminLayout>
  )
}

export default function AdminDashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}
