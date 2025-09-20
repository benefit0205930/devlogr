import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/router'
import api from '../lib/api'

export interface User {
  id: number
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const checkAuth = async () => {
    try {
      const response = await api.get('/api/me')
      setUser(response.data)
    } catch (err) {
      setUser(null)
      console.error('Auth check failed:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true
    let interceptorId: number | null = null

    const initAuth = async () => {
      try {
        await api.get('/sanctum/csrf-cookie')
      } catch (err) {
        console.error('CSRF cookie fetch failed:', err)
      }

      if (!mounted) return

      await checkAuth()
    }

    const handleFocus = () => {
      checkAuth().catch(() => {})
    }

    const setupInterceptor = () => {
      interceptorId =
        api.interceptors?.response?.use?.(
          (res) => res,
          (err) => {
            const status = err?.response?.status
            if (status === 401) {
              setUser(null)
              if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
                router.replace('/auth/login')
              }
            }
            return Promise.reject(err)
          }
        ) ?? null
    }

    initAuth()
    setupInterceptor()
    window.addEventListener('focus', handleFocus)

    return () => {
      mounted = false
      window.removeEventListener('focus', handleFocus)
      if (interceptorId !== null && api.interceptors?.response?.eject) {
        api.interceptors.response.eject(interceptorId)
      }
    }
  }, [router])

  const login = async (email: string, password: string) => {
    await api.get('/sanctum/csrf-cookie')
    await api.post('/login', { email, password })
    await checkAuth()
  }

  const logout = async () => {
    try {
      await api.post('/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      router.push('/auth/login')
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}
