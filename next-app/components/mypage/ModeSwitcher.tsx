import { clsx } from 'clsx'
import { DashboardMode } from '@/types/dashboard'

interface ModeSwitcherProps {
  mode: DashboardMode
  onChange: (mode: DashboardMode) => void
}

const options: Array<{
  value: DashboardMode
  label: string
  description: string
}> = [
  {
    value: 'worker',
    label: 'ワーカーモード',
    description: '受注中の案件やタスクを管理',
  },
  {
    value: 'client',
    label: 'クライアントモード',
    description: '案件投稿・応募対応・レビュー管理',
  },
]

export function ModeSwitcher({ mode, onChange }: ModeSwitcherProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-3">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-gray-500">利用モードを切り替えできます</div>
        <div
          className="inline-flex rounded-xl bg-gray-100 p-1"
          role="radiogroup"
          aria-label="利用モード"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value)
              }}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all flex flex-col items-start text-left',
                mode === option.value
                  ? 'bg-white shadow text-gray-900'
                  : 'text-gray-500 hover:text-gray-900'
              )}
              role="radio"
              aria-checked={mode === option.value}
              tabIndex={mode === option.value ? 0 : -1}
            >
              <div className="leading-tight">{option.label}</div>
              <div className="text-[11px] text-gray-400 mt-1">{option.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
