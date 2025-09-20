import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

type Props = {
  user: any
  onLogout: () => void
}

export default function AvatarMenu({ user, onLogout }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', onDoc)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-2 py-1 rounded focus:outline-none focus:ring-2"
      >
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <span className="hidden sm:inline">{user.name ?? 'User'}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50"
        >
          <div className="p-2">
            <Link href="/dashboard">
              <a className="block px-2 py-2 rounded hover:bg-gray-50">ダッシュボード</a>
            </Link>
            <Link href="/profile">
              <a className="block px-2 py-2 rounded hover:bg-gray-50">プロフィール</a>
            </Link>
            <Link href="/settings">
              <a className="block px-2 py-2 rounded hover:bg-gray-50">設定</a>
            </Link>
            <button
              onClick={onLogout}
              className="w-full text-left mt-2 px-2 py-2 rounded hover:bg-red-50 text-red-600"
            >
              ログアウト
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
