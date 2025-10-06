import { useEffect, useState } from 'react'

/**
 * 値の変更をデバウンスするフック
 * @param value - デバウンスする値
 * @param delay - 遅延時間（ミリ秒）
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
