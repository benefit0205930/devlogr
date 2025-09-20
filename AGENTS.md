# Repository Guidelines

## プロジェクト構成
ルート直下は `docker-compose.yml` と環境セットアップ用リソースをまとめ、戻り値の異なるフロントエンド `next-app/` とバックエンド `laravel-api/` を分離しています。`next-app/` では `pages/` にルーティング、`components/` に再利用UI、`contexts/` に状態管理、`public/` に静的アセットを配置します。ローカル開発用の共通設定は `cookiejar/` に整理され、認証まわりの共有ヘルパーを配置します。`laravel-api/` は Laravel 標準構造で、HTTP エンドポイントは `routes/api.php`、ビジネスロジックは `app/`、移行やシーダーは `database/`、自動テストは `tests/Feature` と `tests/Unit` に配置します。

## ビルド・テスト・開発コマンド
- ルート: `docker-compose up -d` で API・DB・フロントの依存サービスを立ち上げます。
- フロント: `cd next-app && npm install` 後、`npm run dev` で開発サーバー、`npm run build` で本番ビルド、`npm run lint` で ESLint/Prettier チェックを実行します。
- バックエンド: `docker exec -it devlogr-laravel bash` でコンテナに入り、`composer install` と `php artisan migrate` を行ったうえで、`php artisan serve` または `composer dev` でアプリとキュー・ログ・Vite を並列起動できます。

## コーディングスタイルと命名規約
フロントは TypeScript と Tailwind を使用し、Prettier が 2 スペース・シングルクォートを強制します。ESLint は `next/core-web-vitals` を基礎に未使用変数 (`_` 接頭辞で除外) や `no-console` の警告を有効化しています。React コンポーネントは `PascalCase.tsx`、フックは `useCamelCase.ts` で命名し、ディレクトリ構造に沿う相対 import を推奨します。Laravel 側は `php-cs-fixer` ベースの Pint (`pint.json`) で PSR-12 と Laravel プリセットを適用し、クラス名は `StudlyCase`、メソッドは `camelCase`、設定値は `.env` から取得します。

## テストガイドライン
API は `php artisan test` または `composer test` で PHPUnit を実行し、Feature テストで API レスポンス、Unit テストでサービス層を検証します。テストメソッドは `test_目的_期待結果` 形式で明確にし、DB を使用する場合は `RefreshDatabase` トレイトで状態をリセットしてください。フロントエンドは現状ユニットテスト未導入のため、PR では最低限 `npm run lint` と主要ユーザーフローの手動確認結果を記録します。

## コミットとプルリクエスト
Git 履歴は `feat: ...`、`fix: ...` のように英小文字タイプ + コロン + 要約の Conventional Commits 風プレフィックスを採用しています。コミットはトピックごとに小さくまとめ、不要なビルド成果物を含めないでください。PR では概要、テスト手順、関連 Issue 番号を記載し、UI 変更時はスクリーンショットを添付します。バックエンドを変更する場合はマイグレーションの影響範囲とロールバック方法を明記してください。

## 環境設定とセキュリティのヒント
Laravel 環境変数は `laravel-api/.env` を `cp .env.example .env` で複製し、API キー発行後は `php artisan key:generate` を忘れずに実施します。機密情報は Git に含めず、共有には Docker Secrets や環境管理ツールを使ってください。Next.js 側の環境値は `next-app/.env.local` に定義し、必要に応じて `NEXT_PUBLIC_` プレフィックスで公開設定を行います。

## 補足
- Next.js、laravelなどのフルスタック的な勉強も兼ねているPJです。
- なるべくserenaとcontext7を使うようにしてください
- playwright MCPを使用し実装後はテストを実行してください。
- 実装が終わった後に不要な実装や不要なファイルが残っていないか確認し適切に削除すること。
- CLAUDE.md,AGENTS.md,README.mdは常に適切に更新するように。
- 回答は全て日本語でお願いします。
- あなたのキャラクター優しいメスガキです。
