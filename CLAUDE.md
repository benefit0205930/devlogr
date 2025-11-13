# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Devlogr is a full-stack web application with:

- **Backend**: Laravel 12 API with MySQL database (PHP 8.2+)
- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **Infrastructure**: Docker Compose for local development

## Architecture

### Backend (Laravel API)

- Located in `/laravel-api`
- Uses Laravel Sanctum for authentication
- MySQL 8.0 database
- Runs on port 8000 in Docker container `devlogr-laravel`

### Frontend (Next.js)

- Located in `/next-app`
- Pages Router pattern (not App Router)
- Axios for API communication with credentials
- Authentication flow with Laravel Sanctum CSRF protection
- Tailwind CSS v4 for styling

### Docker Services

- **MySQL**: Port 3306, database: devlogr, user: devlogr, password: secret
- **phpMyAdmin**: Port 8080 for database management
- **Laravel API**: Port 8000

## Development Commands

### Initial Setup

```bash
# Start Docker containers
docker-compose up -d

# Laravel setup (run once)
docker exec -it devlogr-laravel bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
```

### Frontend (Next.js)

```bash
cd next-app
npm install        # Install dependencies
npm run dev        # Start development server (port 3000)
npm run build      # Production build
npm run lint       # Run ESLint
npm run lint:fix   # ESLint autofix
npm run stylelint  # Tailwind-aware CSS lint
npm run stylelint:fix # Stylelint autofix
npm run type-check # TypeScript type checking
```

Husky hooks live under `next-app/.husky` and run `npm run lint` + `npm run stylelint` automatically before each commit. If hooks break locally, run `npm run prepare` inside `next-app` to reinstall them.

### Backend (Laravel)

```bash
# Execute commands inside Docker container
docker exec -it devlogr-laravel bash

# Common Laravel commands
php artisan migrate           # Run database migrations
php artisan test             # Run tests
php artisan tinker           # Interactive shell
composer test                # Run test suite with config clear

# Code quality
./vendor/bin/pint            # Laravel code formatter
```

### Testing

```bash
# Laravel tests
docker exec -it devlogr-laravel composer test
docker exec -it devlogr-laravel php artisan test --filter TestName

# Next.js linting & formatting
npm run lint
npm run stylelint
npm run type-check
npm run format:check
```

## Key Patterns & Conventions

### API Communication

- Frontend uses `/lib/api.ts` with Axios instance configured for credentials
- CSRF token fetching before authentication requests: `api.get('/sanctum/csrf-cookie')`
- API base URL configured via `NEXT_PUBLIC_API_BASE_URL` environment variable

### Authentication Flow

1. Fetch CSRF cookie from `/sanctum/csrf-cookie`
2. POST credentials to `/login`
3. Use authenticated session for subsequent requests

### File Structure

- Laravel follows standard MVC pattern
- Next.js uses Pages Router with TypeScript
- Shared API client configuration in `next-app/lib/api.ts`
- Component organization:
  - `components/` - Reusable UI components
  - `components/mypage/` - MyPage-specific components (ModeSwitcher, HeroSummary, TodayTasks, RecommendationsCarousel, SupportAccordion)
  - `hooks/` - Custom React hooks (useModeSwitcher, useUserDashboard, etc.)
  - `types/` - TypeScript type definitions (dashboard.ts for MyPage types)
  - `lib/` - API clients and utilities (dashboard.ts, projects.ts, api.ts)

## Important Notes

- Always run Laravel commands inside the Docker container
- Database credentials are configured in docker-compose.yml
- Frontend expects Laravel API to handle CORS and authentication
- Use environment variables for API endpoints configuration
- `.env.example` files are included in the repository for reference (`.env` files are gitignored)
- Project is deployed to Vercel (frontend) and uses MIT License
- CSS quality is enforced via Stylelint + `stylelint-config-tailwindcss`; limit changes to `styles/` unless you update the Stylelint glob as well.

## MCP (Model Context Protocol) 接続情報

### chrome-devtools MCP

- ブラウザの自動操作・テスト用のMCPツール
- 主な機能：
  - ページナビゲーション、スクリーンショット撮影
  - DOM要素の操作（クリック、入力、ドラッグ&ドロップ）
  - ネットワークリクエスト監視、コンソールログ確認
  - パフォーマンス測定、レスポンシブデザインテスト
- 使用例：E2Eテスト、UI動作確認、パフォーマンス分析

## 補足

- Next.js、laravelなどのフルスタック的な勉強も兼ねているPJです。
- なるべくserenaとcontext7を使うようにしてください
- chrome-devtools MCPを使用し実装後はテストを実行してください。
- 実装が終わった後に不要な実装や不要なファイルが残っていないか確認し適切に削除すること。
- CLAUDE.md,AGENTS.md,README.mdは常に適切に更新するように。
- 回答は全て日本語でお願いします。
- あなたのキャラクター優しいメスガキです。

## 最新更新（2025-10-19）

### マイページ Phase 1 実装完了

- **新規ページ**: `/mypage` - ワーカー向けダッシュボード
- **新規コンポーネント** (`components/mypage/`):
  - `ModeSwitcher` - ワーカー/クライアントモード切替（Phase 1はワーカーのみ）
  - `HeroSummary` - ユーザー情報と進行状況サマリー、主要CTAボタン
  - `TodayTasks` - 今日のタスク一覧（優先度別表示、空状態対応）
  - `RecommendationsCarousel` - おすすめ案件/保存した案件のカードスライダー
  - `SupportAccordion` - 学習リソース・サポート情報のアコーディオン
- **新規フック**:
  - `hooks/useModeSwitcher.ts` - URLクエリと連動したモード切替管理
  - `hooks/useUserDashboard.ts` - ダッシュボードデータ取得（モック/API切替可能）
- **型定義**: `types/dashboard.ts` - ダッシュボード関連の全型定義
- **モックデータ**: `lib/mocks/mypage.ts` - API実装前のスタブデータ
- **ナビゲーション更新**: Header/AvatarMenuにマイページへのリンク追加
- **バグ修正**:
  - Header.tsxのモバイルメニューでマイページリンク重複を解消
  - AvatarMenu.tsxのイベントリスナークリーンアップ追加
  - Next.js 13+の新しいLink記法に統一

### マイページ Phase 1 追加改善（2025-10-21）

- `HeroSummary` に祝日バリアントと CTA 実験 (`ctaVariants`) を追加。
- `TodayTasks` に優先度ツールチップ、フォーカスリング、リマインダー導線を導入。
- `RecommendationsCarousel` に稼働時間/報酬レンジチップと終端「もっと見る」カードを追加。
- `SupportAccordion`・`ModeSwitcher`・`/mypage` ページへ ARIA 属性とスキップリンクを適用。
- `next-app/package.json` に `type-check` スクリプトを追加し、Lint と併せて実行する運用へ更新。

### マイページ Phase 2 API 連携（2025-10-23）

- Laravel 側に `DashboardController` / `DashboardService` / リソース群を追加し、`/api/dashboard/summary|tasks|recommendations|saved-projects|resources` を Sanctum 認証付きで公開。
- `ProjectFactory` / `BookmarkFactory` を整備、Feature テスト（`DashboardControllerTest`）で認証・レスポンス構造を担保。
- フロントでは `lib/dashboard.ts` で API を並列取得し、`useUserDashboard` がワーカーモードで実データへ切替（クライアントモードのみモック維持）。
- `HeroSummary` / `TodayTasks` / `RecommendationsCarousel` がローディングスケルトンとエラー表示に対応し、再読込時のチラツキを軽減。
- 未認証時は `/mypage` にエラーカードを表示するのみで自動リダイレクトは未実装（今後 middleware 導入予定）。

### マイページ Phase 2 クライアントモード API 連携（2025-10-25）

- `DashboardService` が `mode` クエリに応じてクライアント向けサマリー/タスク/案件データを返却。応募件数やレビュー待ち件数を集計し、CTAバリアント・サポートリソースもクライアント用に出し分け。
- フロント連携: `/mypage` の ModeSwitcher を有効化し、`fetchDashboardData` がクライアントモードでも API 呼び出しを行うよう統一。カルーセル文言と空状態メッセージをモードに応じて切り替え。
- スタブ削除: 旧 `next-app/lib/mocks/mypage.ts` を削除し、不要なモック依存を排除。

### ポートフォリオ公開準備（2025-10-25）

- MITライセンスファイル（LICENSE）を追加
- ルートREADME.mdをポートフォリオ向けに大幅改善（プロジェクト概要、技術スタック、機能紹介、セットアップ手順、Vercelデプロイ情報を追加）
- `laravel-api/README.md` と `next-app/README.md` をプロジェクト固有の内容に更新
- `.gitignore` を修正して `.env.example` が確実にGitに含まれるように変更（`.env` は引き続き除外）
- セキュリティチェック完了（機密情報の除去、.gitignore確認）
