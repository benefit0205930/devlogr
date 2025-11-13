# Devlogr API (Laravel Backend)

DevlogrのバックエンドAPIサーバーです。Laravel 12を使用して構築されています。

## 技術スタック

- **Framework**: Laravel 12
- **Language**: PHP 8.2+
- **Authentication**: Laravel Sanctum
- **Database**: MySQL 8.0
- **Testing**: PHPUnit

## セットアップ

### 前提条件

- Docker & Docker Compose（推奨）
- または PHP 8.2+、Composer、MySQL 8.0

### Dockerを使用したセットアップ

```bash
# ルートディレクトリから
docker-compose up -d

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

### ローカル環境でのセットアップ

```bash
# 依存関係のインストール
composer install

# 環境変数の設定
cp .env.example .env
php artisan key:generate

# データベースマイグレーション
php artisan migrate
```

## 開発コマンド

```bash
# 開発サーバー起動（Docker内）
php artisan serve

# または、composer dev でサーバー・キュー・ログ・Viteを並列起動
composer dev

# マイグレーション実行
php artisan migrate

# テスト実行
php artisan test
# または
composer test

# コードフォーマット
./vendor/bin/pint
```

## APIエンドポイント

### 認証

- `POST /api/login` - ログイン
- `POST /api/logout` - ログアウト（認証必要）
- `GET /api/me` - 現在のユーザー情報（認証必要）

### プロジェクト

- `GET /api/projects` - プロジェクト一覧（検索・フィルタリング対応）
- `GET /api/project/{id}` - プロジェクト詳細
- `POST /api/projects` - プロジェクト作成（認証必要）

### ブックマーク

- `POST /api/projects/{project}/bookmark` - ブックマークのトグル（認証必要）
- `GET /api/bookmarks` - ブックマーク一覧（認証必要）

### ダッシュボード

- `GET /api/dashboard/summary` - サマリー情報（認証必要）
- `GET /api/dashboard/tasks` - タスク一覧（認証必要）
- `GET /api/dashboard/recommendations` - おすすめ案件（認証必要）
- `GET /api/dashboard/saved-projects` - 保存した案件（認証必要）
- `GET /api/dashboard/resources` - サポートリソース（認証必要）

## 認証

Laravel Sanctumを使用したセッションベース認証を実装しています。

1. フロントエンドが `/sanctum/csrf-cookie` にリクエストしてCSRFトークンを取得
2. 認証情報を `/api/login` にPOST
3. セッションクッキーで認証状態を維持
4. 認証が必要なAPIリクエストは自動的にクッキーが送信される

## テスト

```bash
# 全テスト実行
php artisan test

# 特定のテストクラスを実行
php artisan test --filter DashboardControllerTest

# composer test は設定クリア後にテストを実行
composer test
```

## コード品質

Laravel Pintを使用してコードフォーマットを統一しています。

```bash
./vendor/bin/pint
```

## 環境変数

`.env.example` を参考に、`.env` ファイルを作成して必要な環境変数を設定してください。

主要な環境変数：

- `APP_KEY` - アプリケーションキー（`php artisan key:generate` で生成）
- `DB_*` - データベース接続情報
- `SANCTUM_STATEFUL_DOMAINS` - Sanctum認証を許可するドメイン
- `SESSION_DOMAIN` - セッションクッキーのドメイン

## プロジェクト構造

```
laravel-api/
├── app/
│   ├── Http/
│   │   ├── Controllers/     # APIコントローラー
│   │   └── Resources/        # APIリソース
│   ├── Models/               # Eloquentモデル
│   └── Services/             # ビジネスロジック
├── database/
│   ├── migrations/           # データベースマイグレーション
│   ├── factories/           # モデルファクトリー
│   └── seeders/             # データシーダー
├── routes/
│   └── api.php              # APIルート定義
└── tests/                   # テストファイル
```

## ライセンス

このプロジェクトは [MIT License](../LICENSE) の下で公開されています。
