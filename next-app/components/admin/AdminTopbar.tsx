import { useState } from 'react'
import { Menu, Bell, Search, X } from 'lucide-react'
import clsx from 'clsx'
import { useAuth } from '../../contexts/AuthContext'
import AdminSidebar from './AdminSidebar'

interface AdminTopbarProps {
  title: string
}

export default function AdminTopbar({ title }: AdminTopbarProps) {
  const { user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b bg-white px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 lg:hidden"
            aria-label="サイドバーを開く"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" aria-hidden />
          </button>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              運用コンソール
            </p>
            <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden
            />
            <input
              type="search"
              placeholder="ユーザー・案件を検索"
              className="h-9 w-64 rounded-md border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-500/20"
            />
          </div>
          <button
            type="button"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
            aria-label="通知"
          >
            <Bell className="h-4 w-4" aria-hidden />
            <span className="absolute -top-1 -right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </button>
          <div className="flex flex-col text-right">
            <span className="text-sm font-medium text-slate-900">{user?.name ?? '管理者'}</span>
            <span className="text-xs text-slate-400">{user?.email ?? 'admin@example.com'}</span>
          </div>
          <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold uppercase tracking-wide text-white md:flex">
            {user?.name?.slice(0, 1) ?? 'A'}
          </div>
        </div>
      </header>
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="h-full w-72 shadow-xl">
            <AdminSidebar variant="mobile" onNavigate={() => setMobileMenuOpen(false)} />
          </div>
          <button
            type="button"
            aria-label="モバイルメニューを閉じる"
            className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
          <div
            className={clsx('flex-1 bg-slate-900/30 backdrop-blur-sm', {
              'animate-in fade-in duration-150': mobileMenuOpen,
            })}
            onClick={() => setMobileMenuOpen(false)}
          />
        </div>
      )}
    </>
  )
}
