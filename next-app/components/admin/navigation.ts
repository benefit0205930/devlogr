import { LayoutDashboard, Users, BriefcaseBusiness, LifeBuoy, Wallet } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface AdminNavItem {
  label: string
  href: string
  icon: LucideIcon
  badge?: string
  description?: string
}

export const adminNavItems: AdminNavItem[] = [
  {
    label: 'ダッシュボード',
    href: '/admin',
    icon: LayoutDashboard,
    description: 'KPI やステータスの全体像を確認',
  },
  {
    label: '案件管理',
    href: '/admin/projects',
    icon: BriefcaseBusiness,
    description: '掲載案件の審査・ステータス更新',
  },
  {
    label: 'ユーザー管理',
    href: '/admin/users',
    icon: Users,
    badge: '新規',
    description: '本人確認や信頼スコアの監視',
  },
  {
    label: '決済・取引',
    href: '/admin/payments',
    icon: Wallet,
    description: '支払申請や請求の承認ワークフロー',
  },
  {
    label: 'サポート対応',
    href: '/admin/support',
    icon: LifeBuoy,
    description: '通報・問い合わせチケットの進捗管理',
  },
]
