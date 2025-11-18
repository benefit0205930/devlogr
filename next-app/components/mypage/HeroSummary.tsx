import Link from 'next/link'
import Button from '@/components/Button'
import { DashboardHeroCTASet, DashboardHeroVariant, DashboardSummary } from '@/types/dashboard'

interface HeroSummaryProps {
  summary: DashboardSummary
  cta: DashboardHeroCTASet
  isLoading?: boolean
  isError?: boolean
}

export function HeroSummary({
  summary,
  cta,
  isLoading = false,
  isError = false,
}: HeroSummaryProps) {
  const headingId = 'mypage-hero-heading'
  const variant = summary.variant ?? 'default'

  if (isError) {
    return (
      <section
        className="bg-white rounded-3xl shadow-sm border border-red-200 overflow-hidden"
        aria-labelledby={headingId}
        role="alert"
      >
        <div className="px-6 py-8 md:px-10 md:py-12">
          <h2 id={headingId} className="text-xl font-semibold text-red-600">
            マイページ情報の取得に失敗しました
          </h2>
          <p className="mt-2 text-sm text-red-500">
            ネットワーク状況を確認してから再読み込みしてください。
          </p>
        </div>
      </section>
    )
  }

  return (
    <section
      className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
      aria-labelledby={headingId}
      role="region"
    >
      <div className="bg-gradient-to-r from-[var(--color-gradient-start)] via-[var(--color-gradient-mid)] to-[var(--color-gradient-end)] text-white px-6 py-8 md:px-10 md:py-12">
        <p className="text-xs uppercase tracking-[0.3em] text-blue-200">My Page</p>
        {variant !== 'default' && !isLoading ? (
          <p className="mt-3 inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium text-white">
            {variantBadgeLabel(variant)}
          </p>
        ) : null}
        <h1 id={headingId} className="mt-2 text-2xl md:text-3xl font-semibold">
          {isLoading ? (
            <span className="block h-7 w-60 rounded bg-white/25 animate-pulse" aria-hidden />
          ) : (
            `${summary.userName}さん、おかえりなさい！`
          )}
        </h1>
        <p className="mt-3 text-sm md:text-base text-blue-100 max-w-2xl">
          {isLoading ? (
            <span className="block h-5 w-72 rounded bg-white/20 animate-pulse" aria-hidden />
          ) : (
            (summary.headline ?? '今日のタスクを片付けて、理想の働き方を前進させましょ。')
          )}
        </p>
        {summary.specialMessage && !isLoading ? (
          <p className="mt-2 text-xs text-blue-200" aria-live="polite">
            {summary.specialMessage}
          </p>
        ) : null}
        {summary.nextActionText && !isLoading ? (
          <p className="mt-4 text-sm text-blue-100">{summary.nextActionText}</p>
        ) : null}
        {isLoading ? (
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="h-10 w-40 rounded-full bg-white/30 animate-pulse" aria-hidden />
            <span
              className="h-10 w-36 rounded-full border border-white/30 bg-white/10 animate-pulse"
              aria-hidden
            />
          </div>
        ) : (
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={cta.primary.href} aria-label={cta.primary.ariaLabel ?? cta.primary.label}>
              <Button variant="accent" size="sm">
                {cta.primary.label}
              </Button>
            </Link>
            <Link
              href={cta.secondary.href}
              aria-label={cta.secondary.ariaLabel ?? cta.secondary.label}
            >
              <Button variant="darkGhost" size="sm" className="border border-white/30">
                {cta.secondary.label}
              </Button>
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-6 py-6 md:px-10 bg-white">
        <Stat label="募集中" value={summary.openProjects} isLoading={isLoading} />
        <Stat label="進行中" value={summary.inProgressProjects} isLoading={isLoading} />
        <Stat label="未読メッセージ" value={summary.unreadMessages} isLoading={isLoading} />
        <Stat label="レビュー待ち" value={summary.pendingReviews} isLoading={isLoading} />
      </div>
    </section>
  )
}

function variantBadgeLabel(variant: DashboardHeroVariant) {
  switch (variant) {
    case 'holiday':
      return '祝日モード'
    case 'firstVisit':
      return 'はじめまして'
    case 'default':
    default:
      return 'マイページ'
  }
}

function Stat({ label, value, isLoading }: { label: string; value: number; isLoading?: boolean }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-center">
      <p className="text-xs text-gray-500">{label}</p>
      {isLoading ? (
        <span
          className="mx-auto mt-1 block h-6 w-12 rounded bg-gray-200 animate-pulse"
          aria-hidden
        />
      ) : (
        <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
      )}
    </div>
  )
}
