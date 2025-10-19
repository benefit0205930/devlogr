import {
  DashboardData,
  DashboardMode,
  DashboardRecommendation,
  DashboardSummary,
  DashboardTask,
  SupportResource,
} from '@/types/dashboard'

// TODO: API実装完了後にLaravel側のエンドポイントへリプレースすること
const workerSummary: DashboardSummary = {
  userName: 'benefit00265',
  headline: '進行中の案件を整理して、次のアクションに移りましょ。',
  openProjects: 3,
  inProgressProjects: 2,
  unreadMessages: 5,
  pendingReviews: 1,
  nextActionText: 'メッセージ返信が必要な案件があります',
}

const workerTasks: DashboardTask[] = [
  {
    id: 'task-1',
    title: '「AI動画編集ツール改修」への応募メッセージに返信する',
    description: 'クライアントからの追加質問に回答しましょう。',
    dueDate: new Date().toISOString(),
    type: 'message',
    ctaLabel: '返信する',
    ctaHref: '/messages/ai-editor',
    priority: 'high',
    status: 'pending',
  },
  {
    id: 'task-2',
    title: '「リモート開発サポート」マイルストーン提出',
    description: '作業ログと成果物リンクをアップロードしてください。',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    type: 'milestone',
    ctaLabel: '提出する',
    ctaHref: '/projects/remote-support/milestones',
    priority: 'medium',
    status: 'pending',
  },
  {
    id: 'task-3',
    title: 'プロフィールを更新して提案率を引き上げる',
    description: '得意スキルと直近の実績を追加するとおすすめ案件が最適化されます。',
    type: 'reminder',
    ctaLabel: 'プロフィール編集',
    ctaHref: '/profile',
    priority: 'low',
    status: 'pending',
  },
]

const workerRecommendations: DashboardRecommendation[] = [
  {
    id: 'rec-1',
    title: 'Next.js + Laravel構成のマイクロサービス開発',
    summary: 'TypeScriptでのAPI連携とUI改善を担当。既存コードベースに参加し継続保守も想定。',
    budgetRange: '40万円〜60万円',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    skills: ['Next.js', 'Laravel', 'TypeScript'],
    href: '/projects/next-laravel',
    isNew: true,
  },
  {
    id: 'rec-2',
    title: 'SaaSダッシュボードのUI刷新リード',
    summary: 'デザインシステムの改修、アクセシビリティ向上、React Query移行を支援。',
    budgetRange: '50万円〜80万円',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
    skills: ['React', 'Tailwind CSS', '型設計'],
    href: '/projects/saas-dashboard',
  },
  {
    id: 'rec-3',
    title: '動画生成AIのワークフロー自動化',
    summary: 'Pythonスクリプトとクラウドインフラで自動化パイプラインを構築する案件。',
    budgetRange: '80万円〜120万円',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
    skills: ['Python', 'AWS', 'CI/CD'],
    href: '/projects/ai-automation',
  },
]

const savedProjects: DashboardRecommendation[] = [
  {
    id: 'saved-1',
    title: 'リモートOK：AIスタートアップの技術顧問',
    summary: 'チームの技術選定とレビューを週1でサポート。CTO候補へのステップアップ案件。',
    budgetRange: '月額25万円〜',
    href: '/projects/ai-advisor',
    skills: ['アーキテクチャ設計', 'コードレビュー'],
  },
]

const supportResources: SupportResource[] = [
  {
    id: 'support-1',
    title: '提案が通りやすくなるプロフィール改善ガイド',
    description: '自己紹介と実績にフォーカスした、検索ヒット率を上げるテキストテンプレを紹介。',
    href: '/guides/profile-boost',
    category: 'guide',
  },
  {
    id: 'support-2',
    title: 'リモート案件の進め方ウェビナー（録画視聴）',
    description: '濃密なコミュニケーション術とスケジュール管理のコツをまとめたセッション。',
    href: '/webinars/remote-collaboration',
    category: 'webinar',
  },
  {
    id: 'support-3',
    title: '支払いサイクルとトラブル対応 FAQ',
    description: '報酬の入金タイミング、遅延時の対処法、仲裁申請の流れなどよくある質問を整理。',
    href: '/support/faq/payment',
    category: 'faq',
  },
]

const clientPlaceholder: DashboardData = {
  mode: 'client',
  summary: {
    userName: 'benefit00265',
    headline: 'クライアント向けマイページはまもなく公開予定です。',
    openProjects: 0,
    inProgressProjects: 0,
    unreadMessages: 0,
    pendingReviews: 0,
    nextActionText: '準備ができ次第お知らせいたします。',
  },
  todayTasks: [],
  recommendations: [],
  savedProjects: [],
  supportResources: [
    {
      id: 'client-support-1',
      title: '案件を効果的に掲載するポイント',
      href: '/guides/client-project-posting',
      category: 'guide',
      description: '募集要項の書き方テンプレートと失敗しないチェックリストを提供。',
    },
  ],
}

export function getMockDashboardData(mode: DashboardMode): DashboardData {
  if (mode === 'client') {
    return clientPlaceholder
  }

  return {
    mode: 'worker',
    summary: workerSummary,
    todayTasks: workerTasks,
    recommendations: workerRecommendations,
    savedProjects,
    supportResources,
  }
}
