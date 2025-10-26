## プロジェクトルートにて実行
docker-compose up -d

## next.jsプロジェクト(フロント)
cd next-app
npm install
npm run dev
npm run lint
npm run type-check

## Laravelの初期化
docker exec -it devlogr-laravel bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate

## phpmyadmin
- ユーザー名: devlogr
- パスワード: secret

## ログイン情報：
- メールアドレス: test@example.com
- パスワード: password

## 新機能メモ（2025-10-19）

### マイページ機能（Phase 1）
- **URL**: `http://localhost:3000/mypage`
- **概要**: ワーカー向けダッシュボード（モックデータ表示）
- **主な機能**:
  - モード切替（ワーカー/クライアント、Phase 1はワーカーのみ実装）
  - ユーザーサマリー（進行中案件数、未読メッセージ数など）
  - 今日のタスク一覧（優先度別表示）
  - おすすめ案件カルーセル
  - 保存した案件一覧
  - サポート・学習リソース
- **実装詳細**:
  - コンポーネント: `components/mypage/`
  - フック: `hooks/useModeSwitcher.ts`, `hooks/useUserDashboard.ts`
  - 型定義: `types/dashboard.ts`
  - モックデータ: `lib/mocks/mypage.ts`
- **注意**: API接続前のため、現在はモックデータを表示しています

## 新機能メモ（2025-10-21）
- **CTA実験対応**: `HeroSummary` のボタン文言/リンクを `useUserDashboard` の `ctaVariants` で切り替え可能にし、祝日メッセージ用バリアントを追加。
- **タスク体験強化**: `TodayTasks` に優先度ツールチップ、フォーカスリング、リマインダー導線を導入し、空状態にもリマインダーリンクを表示。
- **おすすめ案件の文脈表示**: `RecommendationsCarousel` のカードへ稼働時間・報酬レンジチップを追加し、スライダー末尾に「もっと見る」カードを配置。
- **アクセシビリティ改善**: サポートアコーディオンとモード切替にARIA属性を付与し、`/mypage` ページ上部へスキップリンクを追加。
- **テスト要件更新**: `next-app/package.json` に `type-check` スクリプト (`tsc --noEmit`) を追加し、Lintと併せて最小実行要件化。

## 新機能メモ（2025-10-23）
- **API連携**: `laravel-api` に `/api/dashboard/summary|tasks|recommendations|saved-projects|resources` を追加。`auth:sanctum` ガード下で動作し、`DashboardService` が統計・CTAバリアント・派生メッセージを集約。
- **ダッシュボード取得フロー**: `next-app/lib/dashboard.ts` 経由で API を並列取得し、`useUserDashboard` がモックから実データ（ワーカーモード）へ切り替わりました。クライアントモードのみ従来スタブを維持。
- **UIステート**: `HeroSummary` / `TodayTasks` / `RecommendationsCarousel` にローディングスケルトンとエラー表示を追加。フェッチ失敗時は `/mypage` 上部にエラーアラートを表示します。
- **利用手順**:
  1. `php artisan migrate --seed` 等でユーザーを準備し、Sanctum 認証でログイン (`/api/login`)。
  2. ブラウザで `http://localhost:3000/mypage` にアクセスすると、バックエンドのダッシュボード API からデータを取得します（未認証の場合はエラーアラートが表示されます）。
- **テスト補足**: `php artisan test` で `DashboardController` の Feature テストが走り、APIガードとレスポンス構造を検証します。
