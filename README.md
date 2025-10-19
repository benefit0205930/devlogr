## プロジェクトルートにて実行
docker-compose up -d

## next.jsプロジェクト(フロント)
cd next-app
npm install
npm run dev

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
