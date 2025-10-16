import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import { ShieldCheck } from 'lucide-react'
import { adminNavItems } from './navigation'

interface AdminSidebarProps {
  variant?: 'desktop' | 'mobile'
  onNavigate?: () => void
}

const baseItemClass =
  'group flex items-start gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-150'

export default function AdminSidebar({ variant = 'desktop', onNavigate }: AdminSidebarProps) {
  const router = useRouter()
  const isDesktop = variant === 'desktop'

  return (
    <aside
      className={clsx(
        'flex w-72 flex-col border-r bg-white',
        isDesktop ? 'hidden lg:flex' : 'flex'
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-5">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <ShieldCheck className="h-5 w-5 text-slate-900" aria-hidden />
          <span>devlogr Admin</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4 text-slate-600">
        {adminNavItems.map((item) => {
          const isActive = router.pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onNavigate?.()}
              className={clsx(
                baseItemClass,
                isActive
                  ? 'bg-slate-100 text-slate-900 shadow-sm'
                  : 'hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <div className="mt-0.5 flex h-5 w-5 items-center justify-center text-slate-400 group-hover:text-slate-900">
                <item.icon className="h-5 w-5" aria-hidden />
              </div>
              <div className="flex flex-1 flex-col">
                <span className="font-medium">{item.label}</span>
                {item.description && (
                  <span className="text-xs text-slate-400">{item.description}</span>
                )}
              </div>
              {item.badge && (
                <span className="ml-auto rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
      <div className="border-t px-5 py-4 text-xs text-slate-400">
        <p>運用ログは 90 日間保管されます。</p>
        <p className="mt-1">問題が発生した場合は #admin-support チャンネルへ。</p>
      </div>
    </aside>
  )
}
