import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'
import { DashboardMode } from '@/types/dashboard'

const DEFAULT_MODE: DashboardMode = 'worker'

export const useModeSwitcher = () => {
  const router = useRouter()
  const queryMode = router.query.mode

  const mode = useMemo<DashboardMode>(() => {
    const raw = Array.isArray(queryMode) ? queryMode[0] : queryMode
    if (raw === 'client') {
      return 'client'
    }
    return DEFAULT_MODE
  }, [queryMode])

  const setMode = useCallback(
    (nextMode: DashboardMode) => {
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, mode: nextMode },
        },
        undefined,
        { shallow: true }
      )
    },
    [router]
  )

  return {
    mode,
    setMode,
  }
}
