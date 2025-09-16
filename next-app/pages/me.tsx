import { useAuth } from '../contexts/AuthContext'
import { AuthGuard } from '../components/AuthGuard'

export default function MePage() {
  const { user, logout } = useAuth()

  return (
    <AuthGuard>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
        <pre className="mt-4 p-2 bg-gray-100 rounded">{JSON.stringify(user, null, 2)}</pre>
        <button
          onClick={logout}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </AuthGuard>
  )
}
