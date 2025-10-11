export interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

export interface ProjectsParam {
  search?: string
  status?: string
  budget_min?: number
  budget_max?: number
  sort?: string
}

export interface Project {
  id: number
  user_id: number
  title: string
  description: string
  category?: string
  budget_min: number
  budget_max: number
  deadline: string
  status: 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
  user: User
  is_bookmarked?: boolean
  technologies?: string[]
  required_skills?: string[]
  estimated_duration?: string
  application_count?: number
}

export interface BookmarkResponse {
  message: string
  is_bookmarked: boolean
}

export interface ProjectsResponse {
  current_page: number
  data: Project[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: Array<{
    url: string | null
    label: string
    active: boolean
  }>
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

// ========== フィルタリング関連の型定義 ==========

// プロジェクトステータス（既存のstatusと統合）
export type ProjectStatus = 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled'

// カテゴリ定義
export const PROJECT_CATEGORIES = {
  WEB_DEVELOPMENT: 'Web開発',
  MOBILE_APP: 'モバイルアプリ',
  AI_ML: 'AI・機械学習',
  DESIGN: 'デザイン',
  VIDEO: '動画・映像',
  WRITING: 'ライティング',
  MARKETING: 'マーケティング',
  DATA_ANALYSIS: 'データ分析',
  GAME: 'ゲーム開発',
  BLOCKCHAIN: 'ブロックチェーン',
  CLOUD: 'クラウド・インフラ',
  SECURITY: 'セキュリティ',
  OTHER: 'その他',
} as const

export type ProjectCategoryKey = keyof typeof PROJECT_CATEGORIES
export type ProjectCategoryValue = (typeof PROJECT_CATEGORIES)[ProjectCategoryKey]

// 技術スタック
export const TECH_STACKS = {
  // フロントエンド
  REACT: 'React',
  VUE: 'Vue.js',
  ANGULAR: 'Angular',
  NEXTJS: 'Next.js',
  NUXTJS: 'Nuxt.js',
  SVELTE: 'Svelte',
  TYPESCRIPT: 'TypeScript',
  JAVASCRIPT: 'JavaScript',
  HTML_CSS: 'HTML/CSS',
  TAILWIND: 'Tailwind CSS',

  // バックエンド
  NODEJS: 'Node.js',
  EXPRESS: 'Express',
  NESTJS: 'NestJS',
  PYTHON: 'Python',
  DJANGO: 'Django',
  FLASK: 'Flask',
  FASTAPI: 'FastAPI',
  RUBY: 'Ruby',
  RAILS: 'Ruby on Rails',
  PHP: 'PHP',
  LARAVEL: 'Laravel',
  JAVA: 'Java',
  SPRING: 'Spring',
  GO: 'Go',
  RUST: 'Rust',
  CSHARP: 'C#',
  DOTNET: '.NET',

  // データベース
  MYSQL: 'MySQL',
  POSTGRESQL: 'PostgreSQL',
  MONGODB: 'MongoDB',
  REDIS: 'Redis',
  SQLITE: 'SQLite',
  ORACLE: 'Oracle',
  ELASTICSEARCH: 'Elasticsearch',

  // クラウド・インフラ
  AWS: 'AWS',
  GCP: 'GCP',
  AZURE: 'Azure',
  DOCKER: 'Docker',
  KUBERNETES: 'Kubernetes',
  TERRAFORM: 'Terraform',
  GITHUB_ACTIONS: 'GitHub Actions',
  JENKINS: 'Jenkins',

  // AI・データサイエンス
  TENSORFLOW: 'TensorFlow',
  PYTORCH: 'PyTorch',
  SCIKIT_LEARN: 'scikit-learn',
  PANDAS: 'pandas',
  NUMPY: 'NumPy',
  JUPYTER: 'Jupyter',

  // モバイル
  REACT_NATIVE: 'React Native',
  FLUTTER: 'Flutter',
  SWIFT: 'Swift',
  KOTLIN: 'Kotlin',
  ANDROID: 'Android',
  IOS: 'iOS',

  // その他
  GIT: 'Git',
  GRAPHQL: 'GraphQL',
  FIREBASE: 'Firebase',
  SUPABASE: 'Supabase',
  WORDPRESS: 'WordPress',
  SHOPIFY: 'Shopify',
} as const

export type TechStackKey = keyof typeof TECH_STACKS
export type TechStackValue = (typeof TECH_STACKS)[TechStackKey]

// ソート順
export type ProjectSortBy =
  | 'newest'
  | 'popular'
  | 'price_high'
  | 'price_low'
  | 'deadline_soon'
  | 'recommended'
  | 'application_few'
  | 'application_many'

// フィルタリング条件
export interface ProjectFilters {
  // カテゴリフィルタ
  categories: ProjectCategoryKey[]

  // 価格フィルタ
  priceRange: {
    min: number | null
    max: number | null
  }

  // ステータスフィルタ
  status: ProjectStatus[]

  // 期限フィルタ
  deadline: {
    daysRemaining: number | null // 残り日数（例：7 = 7日以内）
    startDate?: string | null // 期間開始日
    endDate?: string | null // 期間終了日
  }

  // 技術スタック
  technologies: TechStackKey[]

  // 検索キーワード
  searchQuery: string

  // 除外キーワード
  excludeKeywords: string[]

  // ソート
  sortBy: ProjectSortBy

  // ブックマークのみ表示
  bookmarkedOnly: boolean

  // 応募済みを除外
  excludeApplied: boolean
}

// フィルタープリセット
export interface FilterPreset {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  description?: string
  filters: Partial<ProjectFilters>
  isDefault?: boolean
  isCustom?: boolean
  createdAt?: string
}

// 価格帯のプリセット
export const PRICE_RANGES = [
  { label: '〜5万円', min: null, max: 50000 },
  { label: '5万円〜10万円', min: 50000, max: 100000 },
  { label: '10万円〜30万円', min: 100000, max: 300000 },
  { label: '30万円〜50万円', min: 300000, max: 500000 },
  { label: '50万円〜100万円', min: 500000, max: 1000000 },
  { label: '100万円〜', min: 1000000, max: null },
] as const

// 期限のプリセット
export const DEADLINE_PRESETS = [
  { label: '3日以内', days: 3 },
  { label: '1週間以内', days: 7 },
  { label: '2週間以内', days: 14 },
  { label: '1ヶ月以内', days: 30 },
  { label: '3ヶ月以内', days: 90 },
] as const

// APIリクエスト用のパラメータ（既存のProjectsParamを拡張）
export interface ProjectsFilterParams extends ProjectsParam {
  categories?: string // カンマ区切り
  technologies?: string // カンマ区切り
  exclude_keywords?: string // カンマ区切り
  days_remaining?: number
  bookmarked_only?: boolean
  exclude_applied?: boolean
  page?: number
  per_page?: number
}

// 案件投稿
export interface ProjectCreateRequest {
  title: string
  category: string
  description: string
  budget_min: number
  budget_max: number
  deadline: string
  technologies?: string[]
  required_skills?: string[]
  estimated_duration?: string
}
