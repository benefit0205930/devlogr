import { useEffect, useState } from 'react'
import api from '../lib/api'
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
    let mounted = true

    const fetchUser = async () => {
      try {
        const res = await api.get('/api/me')
        if (!mounted) return
        setUser(res.data)
      } catch (err) {
        console.warn('not authenticated', err)
        if (mounted) router.replace('/auth/login')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchUser()

    return () => {
      mounted = false
    }
  }, [router])

  if (loading) return <p>Loading...</p>
  if (!user) return null

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
      <pre className="mt-4 p-2 bg-gray-100 rounded">{JSON.stringify(user, null, 2)}</pre>
    </div>
  )
}
