# Repository Guidelines

## プロジェクト構成

ルート直下は `docker-compose.yml` と環境セットアップ用リソースをまとめ、戻り値の異なるフロントエンド `next-app/` とバックエンド `laravel-api/` を分離しています。`next-app/` では `pages/` にルーティング、`components/` に再利用UI、`contexts/` に状態管理、`public/` に静的アセットを配置します。ローカル開発用の共通設定は `cookiejar/` に整理され、認証まわりの共有ヘルパーを配置します。`laravel-api/` は Laravel 標準構造で、HTTP エンドポイントは `routes/api.php`、ビジネスロジックは `app/`、移行やシーダーは `database/`、自動テストは `tests/Feature` と `tests/Unit` に配置します。

## ビルド・テスト・開発コマンド

- ルート: `docker-compose up -d` で API・DB・フロントの依存サービスを立ち上げます。
- フロント: `cd next-app && npm install` 後、`npm run dev` で開発サーバー、`npm run build` で本番ビルド、`npm run lint` と `npm run stylelint` でフロントのLintを実行します。必要に応じて `npm run lint:fix` / `npm run stylelint:fix` で自動修正、フックが壊れた場合は `npm run prepare` で Husky を再セットアップしてください。
  - テスト補助: `npm run type-check` で TypeScript の型検証を実行します。
- バックエンド: `docker exec -it devlogr-laravel bash` でコンテナに入り、`composer install` と `php artisan migrate` を行ったうえで、`php artisan serve` または `composer dev` でアプリとキュー・ログ・Vite を並列起動できます。

## コーディングスタイルと命名規約

フロントは TypeScript と Tailwind を使用し、Prettier が 2 スペース・シングルクォートを強制します。ESLint は `next/core-web-vitals` を基礎に未使用変数 (`_` 接頭辞で除外) や `no-console` の警告を有効化し、CSS については `stylelint-config-standard` + `stylelint-config-tailwindcss` を適用しています。コミット時には Husky が `npm run lint` と `npm run stylelint` を自動実行するため、失敗するとコミットできません。React コンポーネントは `PascalCase.tsx`、フックは `useCamelCase.ts` で命名し、ディレクトリ構造に沿う相対 import を推奨します。Laravel 側は `php-cs-fixer` ベースの Pint (`pint.json`) で PSR-12 と Laravel プリセットを適用し、クラス名は `StudlyCase`、メソッドは `camelCase`、設定値は `.env` から取得します。

## テストガイドライン

API は `php artisan test` または `composer test` で PHPUnit を実行し、Feature テストで API レスポンス、Unit テストでサービス層を検証します。テストメソッドは `test_目的_期待結果` 形式で明確にし、DB を使用する場合は `RefreshDatabase` トレイトで状態をリセットしてください。フロントエンドは現状ユニットテスト未導入のため、PR では最低限 `npm run lint` と主要ユーザーフローの手動確認結果を記録します。

## コミットとプルリクエスト

Git 履歴は `feat: ...`、`fix: ...` のように英小文字タイプ + コロン + 要約の Conventional Commits 風プレフィックスを採用しています。コミットはトピックごとに小さくまとめ、不要なビルド成果物を含めないでください。PR では概要、テスト手順、関連 Issue 番号を記載し、UI 変更時はスクリーンショットを添付します。バックエンドを変更する場合はマイグレーションの影響範囲とロールバック方法を明記してください。

## 環境設定とセキュリティのヒント

Laravel 環境変数は `laravel-api/.env` を `cp .env.example .env` で複製し、API キー発行後は `php artisan key:generate` を忘れずに実施します。機密情報は Git に含めず、共有には Docker Secrets や環境管理ツールを使ってください。Next.js 側の環境値は `next-app/.env.local` に定義し、必要に応じて `NEXT_PUBLIC_` プレフィックスで公開設定を行います。`.env.example` ファイルはリポジトリに含まれており、セットアップ時の参考として使用できます（`.env` は `.gitignore` で除外されています）。

## MCP (Model Context Protocol) ツール情報

### 利用可能なMCPツール

1. **serena** - 高度なコードベース解析とシンボル操作
   - `find_symbol`, `get_symbols_overview` - コードシンボルの検索と概要取得
   - `search_for_pattern` - 正規表現パターンでのコード検索
   - `replace_symbol_body`, `insert_before_symbol`, `insert_after_symbol` - シンボル単位の編集
   - メモリ管理機能でプロジェクト情報を永続化

2. **context7** - ライブラリドキュメント取得
   - `resolve-library-id` - パッケージ名からContext7互換IDを解決
   - `get-library-docs` - 最新のドキュメントとコード例を取得

3. **playwright** - ブラウザ自動操作（E2Eテスト用）
   - ページナビゲーション、要素操作、スクリーンショット撮影
   - フォーム入力、ファイルアップロード対応

4. **chrome-devtools** - Chrome DevToolsプロトコル経由のブラウザ操作
   - DOM要素の詳細な操作（クリック、入力、ドラッグ&ドロップ）
   - ネットワーク監視、コンソールログ取得
   - パフォーマンス測定（LCP、CLS等のCore Web Vitals）
   - レスポンシブデザインテスト（画面サイズ変更）

5. **ide** - VS Code連携
   - 診断情報取得、Jupyterカーネル実行

## 補足

- Next.js、laravelなどのフルスタック的な勉強も兼ねているPJです。
- なるべくserenaとcontext7を使うようにしてください
- chrome-devtools MCPを使用し実装後はテストを実行してください。
- 実装が終わった後に不要な実装や不要なファイルが残っていないか確認し適切に削除すること。
- CLAUDE.md,AGENTS.md,README.mdは常に適切に更新するように。
- 回答は全て日本語でお願いします。

## 最新更新（2025-10-19）

### マイページ Phase 1 実装完了

- `/mypage` ルートを追加し、ワーカーモード用のダッシュボードをモックデータで構築
- `components/mypage/` 配下に5つのコンポーネントを新設:
  - `ModeSwitcher` - モード切替UI（クライアントモードは準備中表示）
  - `HeroSummary` - ユーザー情報とサマリー統計、主要CTA
  - `TodayTasks` - タスク一覧（タイプ別バッジ、優先度別左ボーダー、空状態対応）
  - `RecommendationsCarousel` - 横スクロール可能な案件カード
  - `SupportAccordion` - 折りたたみ式リソースリスト
- `hooks/useUserDashboard.ts` で API 差し替え前提のモック取得ロジックを整理
- `hooks/useModeSwitcher.ts` でURLクエリパラメータと状態を同期
- `types/dashboard.ts` でダッシュボード関連の型を一元管理
- `lib/mocks/mypage.ts` でワーカー/クライアント両モードのスタブデータを提供
- Header/AvatarMenuにマイページ導線を追加、重複リンクとバグを修正

### マイページ Phase 1 追加改善（2025-10-21）

- `HeroSummary` にバリアントバッジと祝日メッセージを追加し、CTA を `ctaVariants` 経由で実験的に切り替え可能に。
- `TodayTasks` に優先度ツールチップ、キーボードフォーカスリング、リマインダー導線を追加。
- `RecommendationsCarousel` に稼働時間/報酬チップを表示し、スライダー末尾へ「もっと見る」カードを配置。
- `SupportAccordion`・`ModeSwitcher`・`/mypage` ページにARIA属性とスキップリンクを付与しアクセシビリティを改善。
- `next-app/package.json` に `type-check` スクリプトを追加し、Lintと合わせてフェーズ1の最小チェック要件に設定。

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

- MITライセンスファイル（LICENSE）を追加し、プロジェクトをオープンソースとして公開可能に。
- ルートREADME.mdをポートフォリオ向けに大幅改善（プロジェクト概要、技術スタック、機能紹介、セットアップ手順、Vercelデプロイ情報を追加）。
- `laravel-api/README.md` と `next-app/README.md` をプロジェクト固有の内容に更新し、各ディレクトリの役割とセットアップ手順を明確化。
- `.gitignore` を修正して `.env.example` が確実にGitに含まれるように変更（`.env` は引き続き除外され、セキュリティを維持）。
- セキュリティチェック完了（機密情報の除去、.gitignore確認）。
