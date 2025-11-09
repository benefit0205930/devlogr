import axios from 'axios'

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

// CSRFトークンを自動的に設定
api.interceptors.request.use((config) => {
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1]

  if (token) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token)
  }

  return config
})

export default api
