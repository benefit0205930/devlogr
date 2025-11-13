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
      const response = await api.get<User>('/api/me')
      setUser(response.data)
    } catch (error: unknown) {
      setUser(null)
      // 401エラーは正常な動作（未認証）なので、エラーログは出さない
      if (getResponseStatus(error) !== 401) {
        console.error('Auth check failed:', error)
      }
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
      } catch (error: unknown) {
        // バックエンドが起動していない場合などはエラーログを出さない
        const code = getErrorCode(error)
        const status = getResponseStatus(error)
        if (code !== 'ERR_NETWORK' && status !== 401) {
          console.error('CSRF cookie fetch failed:', error)
        }
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
            const path = err?.config?.url

            // /api/meへの401エラーは正常な動作（未認証）
            if (status === 401) {
              setUser(null)

              // /api/me以外の401エラーの場合のみリダイレクト
              // かつ、認証が必要なページからのリクエストの場合のみ
              if (
                path !== '/api/me' &&
                typeof window !== 'undefined' &&
                !window.location.pathname.startsWith('/auth') &&
                !window.location.pathname.match(/^\/$|^\/projects$/)
              ) {
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
    await api.post('/api/login', { email, password })
    await checkAuth()
  }

  const logout = async () => {
    try {
      await api.post('/api/logout')
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

interface ErrorWithResponse {
  response?: {
    status?: number
  }
}

interface ErrorWithCode {
  code?: string
}

function getResponseStatus(error: unknown): number | undefined {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    return (error as ErrorWithResponse).response?.status
  }
  return undefined
}

function getErrorCode(error: unknown): string | undefined {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    return (error as ErrorWithCode).code
  }
  return undefined
}
