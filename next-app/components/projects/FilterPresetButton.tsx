import { FC } from 'react'
import { FilterPreset } from '@/types/project'

interface FilterPresetButtonProps {
  preset: FilterPreset
  isActive?: boolean
  onClick: () => void
  onDelete?: () => void
}

export const FilterPresetButton: FC<FilterPresetButtonProps> = ({
  preset,
  isActive = false,
  onClick,
  onDelete,
}) => {
  const IconComponent = preset.icon

  return (
    <button
      onClick={onClick}
      className={`
        group relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium
        transition-all duration-200
        ${
          isActive
            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
            : 'bg-white/10 text-white/90 hover:bg-white/20 hover:shadow-lg'
        }
      `}
    >
      <IconComponent className="w-4 h-4" />
      <span>{preset.name}</span>

      {preset.isCustom && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <svg
            className="h-4 w-4 text-white/70 hover:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </button>
  )
}
