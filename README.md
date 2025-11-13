# Devlogr

Devlogrは、フリーランスワーカーとクライアントを繋ぐマッチングプラットフォームのフルスタックWebアプリケーションです。Next.js 15とLaravel 12を使用して構築されています。

## 🚀 デモ

本プロジェクトはVercelにデプロイされています。

[デモサイトを見る](https://your-vercel-url.vercel.app) <!-- VercelのURLに置き換えてください -->

## ✨ 主な機能

### 認証機能

- Laravel Sanctumを使用したセッションベース認証
- CSRF保護によるセキュアな認証フロー
- ユーザー情報の取得と管理

### プロジェクト管理

- プロジェクト一覧表示（ページネーション対応）
- 高度な検索・フィルタリング機能
  - カテゴリ、技術スタック、ステータスでの絞り込み
  - 価格帯、納期でのフィルタリング
  - キーワード検索
  - ソート機能（新着順、価格順など）
- プロジェクト詳細表示
- ブックマーク機能

### マイページ（ダッシュボード）

- **ワーカーモード**
  - 進行中案件数の表示
  - 今日のタスク一覧（優先度別表示）
  - おすすめ案件のカルーセル表示
  - 保存した案件一覧
- **クライアントモード**
  - 応募件数の表示
  - レビュー待ち件数の表示
  - クライアント向け案件推奨
- モード切替機能
- サポート・学習リソースのアコーディオン表示

### UI/UX

- WebGLを使用した流体シミュレーション背景
- レスポンシブデザイン
- アクセシビリティ対応（ARIA属性、スキップリンク）
- ローディング状態とエラーハンドリング
- モダンなUIコンポーネント

## 🛠️ 技術スタック

### フロントエンド

- **Framework**: Next.js 15 (Pages Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **HTTP Client**: Axios
- **State Management**: React Context API
- **UI Components**: カスタムコンポーネント（Tailwind CSSベース）

### バックエンド

- **Framework**: Laravel 12
- **Language**: PHP 8.2+
- **Authentication**: Laravel Sanctum
- **Database**: MySQL 8.0
- **Testing**: PHPUnit

### インフラストラクチャ

- **Container**: Docker Compose
- **Database Management**: phpMyAdmin
- **Deployment**: Vercel (フロントエンド)

## 📁 プロジェクト構成

```
devlogr/
├── next-app/              # Next.js フロントエンド
│   ├── components/        # Reactコンポーネント
│   ├── pages/             # ページルーティング
│   ├── hooks/             # カスタムフック
│   ├── lib/               # ユーティリティ・APIクライアント
│   └── types/             # TypeScript型定義
├── laravel-api/           # Laravel バックエンド
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/  # APIコントローラー
│   │   │   └── Resources/    # APIリソース
│   │   ├── Models/           # Eloquentモデル
│   │   └── Services/         # ビジネスロジック
│   ├── database/
│   │   ├── migrations/       # データベースマイグレーション
│   │   └── factories/        # モデルファクトリー
│   └── tests/                # テスト
└── docker-compose.yml     # Docker Compose設定
```

## 🚀 セットアップ手順

### 前提条件

- Docker & Docker Compose
- Node.js 18+ (ローカル開発用)
- PHP 8.2+ (ローカル開発用、オプション)

### 1. リポジトリのクローン

```bash
git clone https://github.com/your-username/devlogr.git
cd devlogr
```

### 2. Dockerコンテナの起動

```bash
docker-compose up -d
```

これにより以下のサービスが起動します：

- MySQL (ポート: 3306)
- phpMyAdmin (ポート: 8080)
- Laravel API (ポート: 8000)

### 3. Laravel APIのセットアップ

```bash
# Laravelコンテナに入る
docker exec -it devlogr-laravel bash

# 依存関係のインストール
composer install

# 環境変数の設定
cp .env.example .env
php artisan key:generate

# データベースマイグレーション
php artisan migrate

# シーダーの実行（オプション）
php artisan db:seed
```

### 4. Next.js フロントエンドのセットアップ

```bash
cd next-app

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

フロントエンドは `http://localhost:3000` でアクセスできます。

### 5. 環境変数の設定

#### Laravel API (`laravel-api/.env`)

`.env.example` を参考に、必要な環境変数を設定してください。

#### Next.js (`next-app/.env.local`)

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## 🧪 テスト

### Laravel API テスト

```bash
docker exec -it devlogr-laravel composer test
# または
docker exec -it devlogr-laravel php artisan test
```

### Next.js コード品質チェック

```bash
cd next-app

# ESLint
npm run lint

# Stylelint（Tailwind v4のグローバルCSSを対象）
npm run stylelint

# TypeScript型チェック
npm run type-check

# Prettierフォーマットチェック
npm run format:check
```

Husky を導入しているため、初回セットアップ後は `npm run lint` と `npm run stylelint` がコミット前に自動実行されます。もしフックが動作しない場合は `npm run prepare` を再実行してください。

## 📝 開発コマンド

### Laravel

```bash
docker exec -it devlogr-laravel bash

# マイグレーション実行
php artisan migrate

# テスト実行
php artisan test

# コードフォーマット
./vendor/bin/pint
```

### Next.js

```bash
cd next-app

# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動
npm start

# コードフォーマット
npm run format
```

## 🌐 デプロイ

### Vercelへのデプロイ

フロントエンドはVercelにデプロイされています。

1. Vercelアカウントにログイン
2. GitHubリポジトリを接続
3. プロジェクト設定で以下を指定：
   - Root Directory: `next-app`
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. 環境変数を設定：
   - `NEXT_PUBLIC_API_BASE_URL`: バックエンドAPIのURL

### バックエンドAPIのデプロイ

バックエンドは別途デプロイが必要です（例: Railway, Heroku, AWS等）。

## 📚 主要な実装詳細

### 認証フロー

1. フロントエンドが `/sanctum/csrf-cookie` にリクエストしてCSRFトークンを取得
2. 認証情報を `/api/login` にPOST
3. セッションクッキーで認証状態を維持
4. 認証が必要なAPIリクエストは自動的にクッキーが送信される

### APIエンドポイント

#### 認証

- `POST /api/login` - ログイン
- `POST /api/logout` - ログアウト（認証必要）
- `GET /api/me` - 現在のユーザー情報（認証必要）

#### プロジェクト

- `GET /api/projects` - プロジェクト一覧（検索・フィルタリング対応）
- `GET /api/project/{id}` - プロジェクト詳細
- `POST /api/projects` - プロジェクト作成（認証必要）

#### ブックマーク

- `POST /api/projects/{project}/bookmark` - ブックマークのトグル（認証必要）
- `GET /api/bookmarks` - ブックマーク一覧（認証必要）

#### ダッシュボード

- `GET /api/dashboard/summary` - サマリー情報（認証必要）
- `GET /api/dashboard/tasks` - タスク一覧（認証必要）
- `GET /api/dashboard/recommendations` - おすすめ案件（認証必要）
- `GET /api/dashboard/saved-projects` - 保存した案件（認証必要）
- `GET /api/dashboard/resources` - サポートリソース（認証必要）

## 🤝 コントリビューション

プルリクエストを歓迎します！大きな変更の場合は、まずIssueを開いて変更内容を議論してください。

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'feat: Add some AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. プルリクエストを開く

## 📄 ライセンス

このプロジェクトは [MIT License](LICENSE) の下で公開されています。

## 🙏 謝辞

- [PavelDoGreat/WebGL-Fluid-Simulation](https://github.com/PavelDoGreat/WebGL-Fluid-Simulation) - ヒーローセクションの流体シミュレーション実装の参考にさせていただきました

## 📧 お問い合わせ

プロジェクトに関する質問や提案は、Issueを作成してください。
