# マイページ Phase 1 実装プラン

## 背景
- 現在の類似サービスUIは情報過多・階層不明瞭で初期体験が悪化している。
- フェーズ1では将来的な拡張を見越しつつ、主要動線をコンパクトに整理する土台を提供する。

## ゴール
- ワーカー向けダッシュボードとして「今日やるべきこと」を最優先で提示する。
- ワーカー／クライアント切り替えを視覚的に明示し、誤遷移を防ぐ。
- コンポーネント化されたレイアウトで後続フェーズの機能差し替えを容易にする。

## 情報設計（Phase 1 スコープ）
1. **モード切り替え**  
   - ページ上部に `ワーカー / クライアント` のタブセグメントを常設。  
   - Phase 1 はワーカーモードのみ実装、クライアントはプレースホルダー。
2. **ヒーロー領域**  
   - 「ようこそ + 進行状況サマリー（案件数 / 未読通知）」を表示。  
   - CTA：`案件を探す` `案件を登録する` の2ボタンで主要動線をカバー。
3. **今日のタスク**  
   - 締切が近い案件、未返信メッセージ等をカード化。  
   - 空状態も用意し、次の行動提案リンクを提示。
4. **おすすめ案件 / 保存した案件**  
   - カードスライダー形式（3枚表示、横スクロール）。  
   - Phase 1 ではAPI連携が未定のためダミーデータ + Hookで抽象化。
5. **学習リソース / サポート**  
   - 下部に折りたたみセクションでまとめ、広告枠と混線させない。

## UI/UX ガイドライン
- 8pxグリッドベースで余白を統一。情報階層は `見出し > サブタイトル > ボディ`。
- 配色はニュートラル背景 + ブランドブルーをアクセントに限定。
- カード単位でCTAを右下固定、アイコンとテキストで視認性を補強。
- ユーザーがワーカーモードにいることをタブとページヘッダーで二重表示。

## 技術タスク
1. `next-app/pages/mypage/index.tsx` を新規作成。Layoutコンポーネントを流用。  
2. `components/mypage` 配下に以下を用意：  
   - `ModeSwitcher`（タブセグメント、Phase 1 ではワーカーモード固定）  
   - `HeroSummary`（ユーザー情報 + CTA）  
   - `TodayTasks`（タスクリスト + 空状態）  
   - `RecommendationsCarousel`（スライダー、後続拡張のため `useRecommendations` フックを抽象化）  
   - `SupportAccordion`（FAQ／サポートリンクのアコーディオン）
3. 共通フック  
   - `hooks/useUserDashboard.ts`：ダミーデータとAPI接続処理の切り替えを1箇所で管理。  
   - `hooks/useModeSwitcher.ts`：URLクエリと状態の同期（将来的なクライアントモード対応）。
4. 型定義  
   - `types/dashboard.ts` にタスク/リコメンド/サマリーの型を定義し、APIとの契約を先行で明文化。
5. スタイル  
   - Tailwindユーティリティを基本にしつつ、レイアウト崩れ防止のため `@/styles/mixins/motion.ts`（既存?）を調査。必要なら `styles/tokens.css` にカラートークンを追加。
6. ルーティング  
   - `/mypage` へのリンクをヘッダーナビに仮追加。フェーズ完了後に実装状況へリンク。

## データ戦略（Phase 1）
- API準備前はスタブJSONを `lib/mocks/mypage.ts` に配置し、SW用のフェッチ層から取得。（2025-10-25 時点で削除済み）
- 後続フェーズでLaravel側 `ProjectController` から関連データを返すためのインターフェースを検討。

## テスト・検証
- フェーズ1では `npm run lint` と主要コンポーネントの Story/Playground で見た目確認。  
- 将来的にE2E導入時は `playwright` でモード切り替えとタスク表示を回す前提でID付与。

- **クライアントモード体験強化**（Phase 3優先度: 中）
  - 応募ステータス別フィルタリングとメッセージ統計の詳細化
  - ModeSwitcher 下にガイダンス／チュートリアルリンクを追加
  - クライアント向け Playwright シナリオの整備
- タスクデータの優先度判定ロジック強化（メッセージ未読数・レビュー要求の統合）
- レコメンドアルゴリズム改善（ユーザースキルセットとのマッチング精度向上）
- 広告・マーケ枠の扱い（配置とトラッキング要件）

## 進捗メモ（2025-10-19）
- [x] ダッシュボード用型定義（`types/dashboard.ts`）を追加し、モード/タスク/レコメンド仕様を明文化。
- [x] マイページ本体（`pages/mypage/index.tsx`）とサブコンポーネント５種を新規作成。
- [x] `useModeSwitcher` / `useUserDashboard` フックと `lib/mocks/mypage.ts` を用いてモックデータを配信。
- [x] ヘッダーナビ・アバターメニューからマイページへの導線を追加。
- [x] コードレビュー完了：モックには TODO 追記済み、既存ヘッダーナビ導線の差し替え確認済み。
- [x] ドキュメント更新：CLAUDE.md、README.md、AGENTS.mdに実装詳細を追記。
- [ ] Lintチェック通過：新規実装にエラーはないが、既存警告（`AuthContext` の `any` など）が残り `npm run lint` が失敗するため別途対応が必要。
- [ ] API連携・Playwright E2E テストはPhase2検討（モックからの差し替え待ち）。

## 進捗メモ（2025-10-21）
- [x] `HeroSummary` に variant バッジと祝日メッセージを追加し、CTAを `useUserDashboard` 管理の実験セットへ移行。
- [x] `TodayTasks` のアクセシビリティ改善（フォーカスリング、優先度ツールチップ、リマインダー導線）を実装。
- [x] `RecommendationsCarousel` に稼働時間/報酬チップと終端「もっと見る」カードを追加。
- [x] `SupportAccordion` / `ModeSwitcher` / `/mypage` ページへランドマーク・スキップリンクを付与。
- [x] `type-check` npm スクリプトを追加し、最小実行要件をドキュメントへ反映する準備。

## 進捗メモ（2025-10-23）
- [x] Laravel 側で `/api/dashboard/*` を実装し、Summary/Tasks/Recommendations/Saved Projects/Resources を返却。`DashboardService` で派生メッセージとCTAバリアントを集約。
- [x] `ProjectFactory`・`BookmarkFactory` を整備し、`DashboardController` Featureテストで認証ガードとレスポンス形をカバー。
- [x] Next.js 側 `lib/dashboard.ts` と `useUserDashboard` を API 連携仕様へ差し替え（当初はクライアントモードのみモック継続、2025-10-25 に完全API化）。
- [x] `HeroSummary` / `TodayTasks` / `RecommendationsCarousel` にローディングスケルトンとエラー表示を追加し、フェッチ中でもUI整合性を維持。
- [ ] `/mypage` への未認証アクセス時のリダイレクトは未実装。Phase 2 後半で middleware 追加を検討。

## 追加実装計画（ワーカーモード Phase 1）

### A. 体験強化タスク
- [x] **ヒーローエリアの状態最適化**（2025-10-21 完了）`HeroSummary` に `variant` プロップと特別メッセージ表示を追加し、CTA 文言は `useUserDashboard` 由来の実験キー付きセットへ切り替え。
- [x] **タスクカードの視認性向上**（2025-10-21 完了）`TodayTasks` に優先度ツールチップ / フォーカスリング / リマインダー導線を導入。
- [x] **レコメンドの文脈情報追加**（2025-10-21 完了）カルーセルカードへ稼働時間・報酬レンジチップを表示し、末尾に「もっと見る」カードを配置。

### B. データ層タスク
- [x] `lib/mocks/mypage.ts` を拡張し、`ctaVariants`・`workload`・`rewardRange`・`priorityLabel`・`reminderLink` をスタブデータに追加。（2025-10-25 に廃止）
- [x] `hooks/useUserDashboard.ts` で CTA 定義を抽出し、variant 切り替えロジックを実装（将来の API マッピング TODO コメント追記済み）。

### C. アクセシビリティ / QA
- [x] `components/mypage` 配下の主要コンポーネントにランドマークと `aria-*` 属性を追加。
- [x] `next-app/pages/mypage/index.tsx` にスキップリンクとメイン領域フォーカス管理を実装。
- [x] `type-check` スクリプトを `package.json` に追加し、ローカル実行を Phase1 の最小要件に反映（CI 組み込みは別タスク）。

### D. ドキュメント / コミュニケーション
- [ ] `README.md` のマイページセクションへ UI の補足説明と操作メモを追記。
- [ ] プロダクトオーナー向け共有資料（Notion）に体験強化項目の意図と測定指標（クリック率 / タスク完了率）を記録。

## マイページ API 連携計画（Phase 2）

### ゴール
- Laravel 側でワーカーダッシュボード用 API を整備し、Next.js 側 `useUserDashboard` からモックを置き換える。
- API 応答を既存の型定義（`types/dashboard.ts`）に準拠させ、将来的なクライアントモード拡張にも対応できる設計にする。
- 認証済みユーザーのみが `/api/dashboard/*` にアクセスできるようガードを実装し、エラーハンドリングとロギングを統一する。

### バックエンドタスク（Laravel）
- [x] コントローラ/ルーティング  
  `app/Http/Controllers/Api/DashboardController.php` を新設し、`summary` / `tasks` / `recommendations` / `savedProjects` / `resources` を実装。`routes/api.php` に `/api/dashboard/*` を `auth:sanctum` 付きで追加。
- [x] サービス層・集約ロジック  
  `app/Services/Dashboard/DashboardService.php` を追加し、統計・タスク・レコメンド・保存案件・サポートリソースを集約。N+1 回避のための eager load と派生値（CTA, variant, specialMessage）を同居。
- [x] リソース/DTO  
  `app/Http/Resources/Dashboard` 配下に `SummaryResource` ほか4種を整備し、camelCase のレスポンス契約を保持。
- [x] テスト  
  `tests/Feature/Api/DashboardControllerTest.php` で認証ガードとJSON構造を検証（サービス単体テストは今後の拡張余地としてTODO を維持）。
- [x] データ準備  
  `ProjectFactory` / `BookmarkFactory` を追加し、Featureテストおよびローカル検証用にダミーデータを生成。

### フロントエンドタスク（Next.js）
- [x] API クライアント層  
  `lib/dashboard.ts` を新設し、Axios ベースで `/api/dashboard/*` を並列取得する `fetchDashboardData` を作成。共通エラーメッセージで401/500系を捕捉。
- [x] `useUserDashboard` 差し替え  
  モック読み込み処理を API フェッチへ切り替え（クライアントモードのみ従来モックを維持）。レスポンス契約が崩れた場合はエラーを返してフェールファスト。
- [x] UI 更新  
  `HeroSummary` / `TodayTasks` / `RecommendationsCarousel` に `isLoading` / `isError` プロップを追加し、骨組みプレースホルダーとエラー表示を実装。
- [ ] 認証連携  
  `/mypage` へのサーバーサイド認証ガードは未着手。Sanctum未認証時のリダイレクト/トーストをPhase 2後半で検討。

### QA / リリース手順
- バックエンドは `php artisan test` と `phpstan`（導入済みなら）で静的解析を実行。API 契約の変更点は `openapi.yaml` があれば併せて更新。
- フロントは `npm run lint` `npm run type-check` を CI に組み込み、マイページ主要フローの Playwright シナリオ（モード切替・タスク完了操作）を追加。
- ステージング環境で実ユーザーデータを想定したサンプルを投入し、レスポンスタイムとキャッシュポリシーを確認。
- リリース後 1 週間はエラーレートとレスポンスタイムをダッシュボード監視し、必要なら Feature Flag で旧モックに切り戻せるようにする。

## 進捗メモ（2025-10-24）
- [x] Laravel側 DashboardController 実装完了（5エンドポイント）
  - `GET /api/dashboard/summary` - ユーザーサマリー + CTA variants
  - `GET /api/dashboard/tasks` - 今日のタスク一覧
  - `GET /api/dashboard/recommendations` - おすすめ案件
  - `GET /api/dashboard/saved-projects` - 保存した案件
  - `GET /api/dashboard/resources` - サポートリソース
- [x] DashboardService でビジネスロジック分離
  - 優先度判定ロジック（`priorityFromDaysUntil`）実装
  - バリアント自動判定（週末=holiday）実装
  - 動的ヘッドライン生成機能
  - レコメンドアルゴリズム基礎実装（ブックマーク除外、締切順）
- [x] 5つのResourceクラス作成（型安全なレスポンス）
  - `SummaryResource`, `TaskResource`, `RecommendationResource`, `SavedProjectResource`, `ResourceLinkResource`
- [x] config/dashboard.php で CTA variants / サポートリソース管理
- [x] DashboardControllerTest 追加（6テストケース全パス、48 assertions）
  - 認証ガードテスト
  - レスポンス構造テスト
  - ビジネスロジックテスト
- [x] Next.js側 lib/dashboard.ts 作成（API client層）
  - Promise.all で5つのAPIを並列リクエスト最適化
  - 型安全なレスポンス処理
- [x] useUserDashboard をモックからAPI切り替え（クライアントモードは2025-10-25に対応完了）
  - `reloadKey` でリトライ機能追加
- [x] MyPageコンポーネント強化
  - ローディング状態改善（`showSpinner`）
  - エラー時のリトライ機能実装
  - `isLoading`/`isError` props追加（将来の部分更新対応）
- [x] ESLint/TypeScript型チェック全パス
- [x] **クライアントモードAPI連携を実装**
  - DashboardService でクライアント向けサマリー/タスク/案件ロジックを追加
  - Next.js から `mode` クエリを付与してAPI呼び出しを統一
- [ ] 認証ガード（/mypageへのサーバーサイドリダイレクト）未実装
- [ ] Playwright E2Eテスト未実装（Phase 3検討）

## 進捗メモ（2025-10-25）
- [x] DashboardService にクライアントモード分岐を追加し、応募数集計・レビュー待ち件数・応募者確認タスクを提供。
- [x] `/api/dashboard/*` 各エンドポイントで `mode` クエリを受け付けるよう `DashboardController` を更新。
- [x] `config/dashboard.php` にクライアント向け CTA バリアントとサポートリソースを登録。
- [x] `DashboardControllerTest` にクライアントモードのサマリー/タスク/案件/リソース検証ケースを追加。
- [x] フロントエンド側で ModeSwitcher を有効化し、`fetchDashboardData` がモード毎に API を呼び出すよう統一。カルーセル文言をモード別に出し分け。
- [x] 旧スタブデータ（`next-app/lib/mocks/mypage.ts`）を削除し、`plans.md`・`README.md` を最新仕様へ更新。
