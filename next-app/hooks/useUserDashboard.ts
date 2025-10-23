import { useEffect, useState } from 'react'
import {
  DashboardData,
  DashboardHeroCTASet,
  DashboardHeroCTAVariants,
  DashboardHeroVariant,
  DashboardMode,
} from '@/types/dashboard'
import { getMockDashboardData } from '@/lib/mocks/mypage'

interface UseUserDashboardOptions {
  mode: DashboardMode
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
    href: '/projects/new',
  },
}

export const useUserDashboard = ({ mode }: UseUserDashboardOptions) => {
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

        // 将来的にAPIへ差し替える想定。Phase1ではモックデータを返す。
        const response = await Promise.resolve(getMockDashboardData(mode))
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
  }, [mode])

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
