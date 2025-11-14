import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'

const XSRF_COOKIE_NAME = 'XSRF-TOKEN'
const XSRF_HEADER_NAME = 'X-XSRF-TOKEN'

const getXsrfToken = (): string | null => {
  if (typeof document === 'undefined') {
    return null
  }

  const tokenPair = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${XSRF_COOKIE_NAME}=`))

  if (!tokenPair) {
    return null
  }

  return decodeURIComponent(tokenPair.substring(XSRF_COOKIE_NAME.length + 1))
}

// Next.jsのrewriteを使用するため、開発環境ではbaseURLを空にする
// 本番環境では環境変数で設定されたbaseURLを使用
const baseURL =
  process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_API_BASE_URL || '' : ''

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

const ensureAxiosHeaders = (headers?: InternalAxiosRequestConfig['headers']): AxiosHeaders => {
  if (headers instanceof AxiosHeaders) {
    return headers
  }

  return new AxiosHeaders(headers)
}

const attachXsrfHeader = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const token = getXsrfToken()

  if (!token) {
    return config
  }

  const headers = ensureAxiosHeaders(config.headers)
  headers.set(XSRF_HEADER_NAME, token)
  config.headers = headers

  return config
}

api.interceptors.request.use(attachXsrfHeader)

export default api
