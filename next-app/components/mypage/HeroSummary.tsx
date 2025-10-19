import Link from 'next/link'
import Button from '@/components/Button'
import { DashboardSummary } from '@/types/dashboard'

interface HeroSummaryProps {
  summary: DashboardSummary
}

export function HeroSummary({ summary }: HeroSummaryProps) {
  return (
    <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-[#0f172a] via-[#1d4ed8] to-[#1e293b] text-white px-6 py-8 md:px-10 md:py-12">
        <p className="text-xs uppercase tracking-[0.3em] text-blue-200">My Page</p>
        <h1 className="mt-2 text-2xl md:text-3xl font-semibold">
          {summary.userName}さん、おかえりなさい！
        </h1>
        <p className="mt-3 text-sm md:text-base text-blue-100 max-w-2xl">
          {summary.headline ?? '今日のタスクを片付けて、理想の働き方を前進させましょ。'}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/projects">
            <Button variant="accent" size="sm">
              案件を探す
            </Button>
          </Link>
          <Link href="/projects/new">
            <Button variant="darkGhost" size="sm" className="border border-white/30">
              案件を登録する
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-6 py-6 md:px-10 bg-white">
        <Stat label="募集中" value={summary.openProjects} />
        <Stat label="進行中" value={summary.inProgressProjects} />
        <Stat label="未読メッセージ" value={summary.unreadMessages} />
        <Stat label="レビュー待ち" value={summary.pendingReviews} />
      </div>
    </section>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  )
}
