import { FC, useState, useRef, useEffect } from 'react'
import { ProjectSortBy } from '@/types/project'
import { Star, Sparkles, Flame, DollarSign, Coins, Clock, Users, Users2 } from 'lucide-react'

interface SortDropDownProps {
  value: ProjectSortBy
  onChange: (sortBy: ProjectSortBy) => void
}

const sortOptions: {
  value: ProjectSortBy
  label: string
  icon: React.ComponentType<{ className?: string }>
}[] = [
  { value: 'recommended', label: 'おすすめ順', icon: Star },
  { value: 'newest', label: '新着順', icon: Sparkles },
  { value: 'popular', label: '人気順', icon: Flame },
  { value: 'price_high', label: '金額が高い順', icon: DollarSign },
  { value: 'price_low', label: '金額が低い順', icon: Coins },
  { value: 'deadline_soon', label: '締切が近い順', icon: Clock },
  { value: 'application_few', label: '応募が少ない順', icon: Users },
  { value: 'application_many', label: '応募が多い順', icon: Users2 },
]

export const SortDropDown: FC<SortDropDownProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropDownRef = useRef<HTMLDivElement>(null)

  const currentOption = sortOptions.find((opt) => opt.value === value) || sortOptions[0]

  // ドロップダウンの外をクリックしたら閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div ref={dropDownRef} className="relative">
      {/* トリガーボタン */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5
          text-sm font-medium text-white/90
          border border-white/20
          hover:bg-white/15 hover:border-white/30
          focus:outline-none focus:ring-2 focus:ring-blue-500/50
          transition-all duration-200
          backdrop-blur-sm
        "
      >
        <currentOption.icon className="w-4 h-4" />
        <span>{currentOption.label}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* ドロップダウンメニュー */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-gray-900/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-1">
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value)
                  setIsOpen(false)
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                  text-sm font-medium text-left
                  transition-all duration-150
                  ${
                    value === opt.value
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                <opt.icon className="w-4 h-4" />
                <span className="text-sm">{opt.label}</span>
                {value === opt.value && (
                  <svg
                    className="w-4 h-4 ml-auto text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
