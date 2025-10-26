import { useEffect, useState } from 'react'
import {
  DashboardData,
  DashboardHeroCTASet,
  DashboardHeroCTAVariants,
  DashboardHeroVariant,
  DashboardMode,
} from '@/types/dashboard'
import { fetchDashboardData } from '@/lib/dashboard'
import { getMockDashboardData } from '@/lib/mocks/mypage'

interface UseUserDashboardOptions {
  mode: DashboardMode
  reloadKey?: number
}

const DEFAULT_VARIANT: DashboardHeroVariant = 'default'

const FALLBACK_CTAS: DashboardHeroCTASet = {
  experimentKey: 'fallback-hero-cta',
  primary: {
    label: '案件を探す',
    href: '/projects',
  },
  secondary: {
    label: '案件を登録する',
    href: '/projects/create',
  },
}

export const useUserDashboard = ({ mode, reloadKey = 0 }: UseUserDashboardOptions) => {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [heroCtas, setHeroCtas] = useState<DashboardHeroCTASet>(FALLBACK_CTAS)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        setLoading(true)
        setError(null)

        if (mode === 'client') {
          const mock = getMockDashboardData(mode)
          const computedCtas = resolveHeroCtas(mock.ctaVariants, mock.summary.variant)

          if (active) {
            setData(mock)
            setHeroCtas(computedCtas)
          }
          return
        }

        const response = await fetchDashboardData()
        const computedCtas = resolveHeroCtas(response.ctaVariants, response.summary.variant)

        if (active) {
          setData(response)
          setHeroCtas(computedCtas)
        }
      } catch (err) {
        console.error('failed to load dashboard data', err)
        if (active) {
          setError('マイページ情報の読み込みに失敗しました')
          setData(null)
          setHeroCtas(FALLBACK_CTAS)
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
  }, [mode, reloadKey])

  return { data, loading, error, heroCtas }
}

function resolveHeroCtas(
  variants: DashboardHeroCTAVariants | undefined,
  variant: DashboardHeroVariant | undefined
) {
  if (!variants) {
    return FALLBACK_CTAS
  }

  const desired = variant ?? DEFAULT_VARIANT
  return variants[desired] ?? variants[DEFAULT_VARIANT] ?? FALLBACK_CTAS
}
