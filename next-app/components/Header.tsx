import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/AuthContext'
import AvatarMenu from './AvatarMenu'
import Button from './Button'

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
              <Image
                src="/images/front/logo.svg"
                alt="devlogr"
                width={120}
                height={40}
                priority
                className="h-10 w-auto"
              />
            </Link>
          </div>

          <nav className="flex items-center gap-3">
            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-2">
              <Link href="/projects">
                <Button variant="blackOutline" size="sm">
                  案件一覧
                </Button>
              </Link>
              <Link href="/projects/create">
                <Button variant="blackOutline" size="sm">
                  案件を投稿
                </Button>
              </Link>
              <Link href="/mypage">
                <Button variant="blackOutline" size="sm">
                  マイページ
                </Button>
              </Link>
            </div>

            {/* Auth area */}
            <div className="flex items-center">
              {user ? (
                <AvatarMenu user={user} onLogout={handleLogout} />
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="ghost" size="sm">
                      ログイン
                    </Button>
                  </Link>
                </>
              )}

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                className="md:hidden ml-3"
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
              </Button>
            </div>
          </nav>
        </div>

        {/* Mobile nav panel */}
        {open && (
          <div className="md:hidden py-2">
            <div className="flex flex-col gap-2">
              <Link href="/projects">
                <Button variant="ghost" fullWidth className="justify-start">
                  案件一覧
                </Button>
              </Link>
              <Link href="/projects/create">
                <Button variant="ghost" fullWidth className="justify-start">
                  案件を投稿
                </Button>
              </Link>
              <Link href="/mypage">
                <Button variant="ghost" fullWidth className="justify-start">
                  マイページ
                </Button>
              </Link>
              {user ? (
                <Button onClick={handleLogout} variant="ghost" fullWidth className="justify-start">
                  ログアウト
                </Button>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="ghost" fullWidth className="justify-start">
                      ログイン
                    </Button>
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
