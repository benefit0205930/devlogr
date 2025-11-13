import axios from 'axios'

// Next.jsのrewriteを使用するため、開発環境ではbaseURLを空にする
// 本番環境では環境変数で設定されたbaseURLを使用
const baseURL =
  process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_API_BASE_URL || '' : ''

const api = axios.create({
  baseURL,
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

export default api
