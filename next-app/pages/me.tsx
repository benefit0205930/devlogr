import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { useRouter } from 'next/router'

type User = {
  id: number
  name: string
  email: string
}

export default function MePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/api/me')
        setUser(res.data)
      } catch (err) {
        console.error(err)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  const handleLogout = async () => {
    try {
      await api.post('/logout')
      router.push('/login')
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <p>Loading...</p>

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        {user && (
          <div>
            <p className="text-2xl font-bold mb-6">Welcome, {user.name}!</p>
            <p className="mb-4">Email: {user.email}</p>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
