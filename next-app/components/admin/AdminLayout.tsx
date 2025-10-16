import Head from 'next/head'
import { ReactNode } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'

interface AdminLayoutProps {
  title?: string
  children: ReactNode
}

export default function AdminLayout({ title = 'ダッシュボード', children }: AdminLayoutProps) {
  const pageTitle = `${title} | devlogr Admin`

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <AdminTopbar title={title} />
          <main className="flex-1 px-4 py-6 lg:px-8">
            <div className="mx-auto w-full max-w-6xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  )
}
