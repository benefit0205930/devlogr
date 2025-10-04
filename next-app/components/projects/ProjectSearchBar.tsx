import { FC, useState, useRef } from 'react'

interface ProjectSearchBarProps {
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  placeholder?: string
  excludeKeywords?: string[]
  onAddExcludeKeyword?: (keyword: string) => void
  onRemoveExcludeKeyword?: (keyword: string) => void
}

export const ProjectSearchBar: FC<ProjectSearchBarProps> = ({
  value,
  onChange,
  onClear,
  placeholder = 'キーワードで検索...',
  excludeKeywords = [],
  onAddExcludeKeyword,
  onRemoveExcludeKeyword,
}) => {
  const [showExclude, setShowExclude] = useState(false)
  const [excludeInput, setExcludeInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="w-full space-y-3">
      {/* メイン検索バー */}
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-white/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="
            w-full rounded-2xl bg-white/10 py-3 pl-12 pr-24
            text-white placeholder-white/50
            border border-white/20
            focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-500/50
            transition-all duration-200
            backdrop-blur-sm
          "
        />

        <div className="absolute inset-y-0 right-2 flex items-center gap-1">
          {/* 除外キーワードボタン */}
          {onAddExcludeKeyword && (
            <button
              onClick={() => setShowExclude(!showExclude)}
              className={`
                rounded-lg px-3 py-1.5 text-xs font-medium transition-all
                ${
                  showExclude || excludeKeywords.length > 0
                    ? 'bg-red-500/20 text-red-300'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }
              `}
              title="除外キーワード"
            >
              除外 {excludeKeywords.length > 0 && `(${excludeKeywords.length})`}
            </button>
          )}

          {/* クリアボタン */}
          {value && onClear && (
            <button
              onClick={onClear}
              className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white transition-all"
              aria-label="クリア"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* 除外キーワード入力エリア */}
      {showExclude && onAddExcludeKeyword && onRemoveExcludeKeyword && (
        <div className="rounded-xl bg-white/5 p-4 border border-red-500/20 backdrop-blur-sm">
          <label className="block text-sm font-medium text-white/90 mb-2">除外キーワード</label>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={excludeInput}
              onChange={(e) => setExcludeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && excludeInput.trim()) {
                  onAddExcludeKeyword(excludeInput.trim())
                  setExcludeInput('')
                }
              }}
              placeholder="除外したいキーワードを入力"
              className="
                flex-1 rounded-lg bg-white/10 px-3 py-2 text-sm text-white
                placeholder-white/50 border border-white/20
                focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500/50
              "
            />
            <button
              onClick={() => {
                if (excludeInput.trim()) {
                  onAddExcludeKeyword(excludeInput.trim())
                  setExcludeInput('')
                }
              }}
              className="rounded-lg bg-red-500/20 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-500/30 transition-all"
            >
              追加
            </button>
          </div>

          {/* 除外キーワードタグ */}
          {excludeKeywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {excludeKeywords.map((keyword) => (
                <span
                  key={keyword}
                  className="inline-flex items-center gap-1 rounded-full bg-red-500/20 px-3 py-1 text-xs text-red-300"
                >
                  {keyword}
                  <button
                    onClick={() => onRemoveExcludeKeyword(keyword)}
                    className="hover:text-red-100 transition-colors"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
