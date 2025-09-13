import { useState } from 'react'
import { useRouter } from 'next/router'
import { api } from '../lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      // CSRF Cookieの取得
      await api.get('/sanctum/csrf-cookie')
      // ログインAPIの呼び出し
      await api.post('/login', { email, password })
      // ログイン成功後、ホームページへリダイレクト
      router.push('/me')
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as { response?: { status?: number } }
        if (error.response?.status === 422) {
          setError('Invalid email or password.')
        } else if (error.response?.status === 401) {
          setError('Unauthorized. Please check your credentials.')
        } else {
          setError('An unexpected error occurred. Please try again later.')
        }
      } else {
        setError('An unexpected error occurred. Please try again later.')
      }
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div>
          <label className="block mb-2">Email</label>
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-2">Password</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded mb-6"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          Login
        </button>
      </form>
    </main>
  )
}
