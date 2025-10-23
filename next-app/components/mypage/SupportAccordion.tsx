import { useState } from 'react'
import Link from 'next/link'
import { SupportResource } from '@/types/dashboard'

interface SupportAccordionProps {
  resources: SupportResource[]
}

export function SupportAccordion({ resources }: SupportAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(resources[0]?.id ?? null)
  const headingId = 'mypage-support-resources'

  return (
    <section
      className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6"
      aria-labelledby={headingId}
      role="region"
    >
      <h2 id={headingId} className="text-lg font-semibold text-gray-900 mb-4">
        サポートと学習リソース
      </h2>
      <div className="space-y-3">
        {resources.map((resource) => {
          const isOpen = openId === resource.id
          const panelId = `support-panel-${resource.id}`
          const buttonId = `support-trigger-${resource.id}`

          return (
            <div
              key={resource.id}
              className="rounded-2xl border border-gray-100 transition hover:border-blue-200"
            >
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : resource.id)}
                className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
                aria-expanded={isOpen}
                aria-controls={panelId}
                id={buttonId}
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{resource.title}</p>
                  <span className="text-[11px] uppercase tracking-widest text-gray-400">
                    {categoryLabel(resource.category)}
                  </span>
                </div>
                <span className="text-gray-400" aria-hidden>
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              {isOpen && (
                <div
                  className="border-t border-gray-100 px-4 py-4 text-sm text-gray-600"
                  role="region"
                  aria-labelledby={buttonId}
                  id={panelId}
                >
                  {resource.description && <p className="mb-3">{resource.description}</p>}
                  <Link
                    href={resource.href}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700"
                  >
                    詳細を見る
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

function categoryLabel(category: SupportResource['category']) {
  switch (category) {
    case 'guide':
      return 'GUIDE'
    case 'faq':
      return 'FAQ'
    case 'support':
      return 'SUPPORT'
    case 'webinar':
      return 'WEBINAR'
    default:
      return 'INFO'
  }
}
