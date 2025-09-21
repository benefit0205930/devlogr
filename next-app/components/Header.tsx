import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/AuthContext'
import AvatarMenu from './AvatarMenu'

export default function Header() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    try {
      await logout()
      router.push('/auth/login')
    } catch (err) {
      console.error('logout failed', err)
      router.push('/auth/login')
    }
  }

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <img src="/images/front/logo.svg" alt="devlogr" className="h-10 w-auto" />
            </Link>

            {/* Search - optional (desktop only) */}
            {/* <div className="hidden md:block">
              <label htmlFor="site-search" className="sr-only">
                サイト内検索
              </label>
              <div className="relative">
                <input
                  id="site-search"
                  placeholder="案件を検索（例：Nuxt, UI）"
                  className="w-72 rounded-md border px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label="サイト内検索"
                />
                <button
                  aria-hidden
                  className="absolute right-1 top-1/2 -translate-y-1/2 px-2 py-1 text-sm"
                >
                  検索
                </button>
              </div>
            </div> */}
          </div>

          <nav className="flex items-center gap-3">
            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/projects"
                className="px-3 py-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2"
              >
                案件一覧
              </Link>
              <Link
                href="/projects/new"
                className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2"
              >
                案件を投稿
              </Link>
            </div>

            {/* Auth area */}
            <div className="flex items-center">
              {user ? (
                // Avatar Menu
                <AvatarMenu user={user} onLogout={handleLogout} />
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="px-3 py-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2"
                  >
                    ログイン
                  </Link>
                  <Link
                    href="/auth/register"
                    className="ml-2 px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2"
                  >
                    登録
                  </Link>
                </>
              )}

              {/* Mobile menu button */}
              <button
                className="md:hidden ml-3 p-2 rounded focus:outline-none focus:ring-2"
                aria-label="メニュー"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M4 6h16M4 12h16M4 18h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile nav panel */}
        {open && (
          <div className="md:hidden py-2">
            <div className="flex flex-col gap-2">
              <Link href="/projects" className="block px-3 py-2 rounded hover:bg-gray-100">
                案件一覧
              </Link>
              <Link href="/projects/new" className="block px-3 py-2 rounded hover:bg-gray-100">
                案件を投稿
              </Link>
              {user ? (
                <>
                  <Link href="/dashboard" className="block px-3 py-2 rounded hover:bg-gray-100">
                    ダッシュボード
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left px-3 py-2 rounded hover:bg-gray-100"
                  >
                    ログアウト
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="block px-3 py-2 rounded hover:bg-gray-100">
                    ログイン
                  </Link>
                  <Link href="/auth/register" className="block px-3 py-2 rounded hover:bg-gray-100">
                    登録
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
