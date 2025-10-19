import { useEffect, useState } from 'react'
import { DashboardData, DashboardMode } from '@/types/dashboard'
import { getMockDashboardData } from '@/lib/mocks/mypage'

interface UseUserDashboardOptions {
  mode: DashboardMode
}

export const useUserDashboard = ({ mode }: UseUserDashboardOptions) => {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        setLoading(true)
        setError(null)

        // 将来的にAPIへ差し替える想定。Phase1ではモックデータを返す。
        const response = await Promise.resolve(getMockDashboardData(mode))

        if (active) {
          setData(response)
        }
      } catch (err) {
        console.error('failed to load dashboard data', err)
        if (active) {
          setError('マイページ情報の読み込みに失敗しました')
          setData(null)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      active = false
    }
  }, [mode])

  return { data, loading, error }
}
