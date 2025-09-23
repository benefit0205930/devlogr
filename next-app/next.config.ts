import type { NextConfig } from 'next'

const dev = process.env.NODE_ENV !== 'production'

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  async rewrites() {
    if (dev) {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
      return [
        {
          source: '/api/:path*',
          destination: `${apiUrl}/api/:path*`,
        },
        {
          source: '/sanctum/:path*',
          destination: `${apiUrl}/sanctum/:path*`,
        },
      ]
    }
    return []
  },
}

export default nextConfig
