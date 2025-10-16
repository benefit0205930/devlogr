# 管理画面導入の必要性と実装プラン

## 1. 管理画面を用意する意義
- **成果物・案件の信頼性を担保**: ユーザー投稿の審査やステータス管理を画面上で実施でき、案件の品質を可視化できる。
- **サポート体験の向上**: 問い合わせや違反報告をワークフロー化し、対応状況をチームで共有できる。
- **KPI 監視と意思決定**: 受注率、継続率、単価推移などの指標をリアルタイムで可視化し、改善サイクルを回しやすくする。
- **運用コストの削減**: CSV や SQL ベースの手作業を減らし、ノーコード的に日常業務を完結できる。

## 2. 想定ユーザーとロール
| ロール | 主な目的 | 必要な機能 |
| --- | --- | --- |
| オーナー/PM | サイト全体の健全性チェック | KPI ダッシュボード、ユーザー推移分析 |
| オペレーター | 案件・ユーザーの審査/対応 | 検索・フィルタ・承認、ステータス更新、通報対応 |
| カスタマーサクセス | トラブル対応・仲介 | チャットログ閲覧、紛争対応ワークフロー |
| 経理 | 支払・請求管理 | 取引明細確認、入出金処理、レポート出力 |

## 3. 情報設計
1. **ダッシュボード**
   - アクティブユーザー数、受注率、平均単価、CS 対応 SLA などをカード表示
   - トレンドグラフやヒートマップで異常検知を容易に
2. **案件管理**
   - 状態別のタブ + 高度なフィルタリング（報酬レンジ、カテゴリ、公開状況）
   - 詳細モーダルで案件内容、応募者、コミュニケーションログをまとめて閲覧
3. **ユーザー管理**
   - クライアント/ワーカーの属性、信頼スコア、本人確認ステータス
   - ペナルティ、BAN、本人確認書類承認のワークフロー
4. **取引・決済管理**
   - 支払申請承認、報酬スケジュール、請求書出力
   - 異常検知（例: 高額/短期間の取引）アラート
5. **通報・サポート**
   - チケットベースで対応状況、担当者、SLA を管理
   - 定型返信テンプレートやナレッジベースへの導線

## 4. 実装プラン
### 4.1 アーキテクチャ
- Next.js **Pages Router**（現行構成）を維持しつつ、管理画面用に `/pages/admin/*` 配下へレイアウトと画面を追加する。
- Tailwind コンポーネントでサイドバー/トップバーを共通化し、既存の UI コンポーネント設計と整合させる。
- 認証は Laravel API と連携し、管理者ロールに応じた RBAC を実装。
- API は `/api/admin/*` で名前空間を切り、バリデーションやレートリミットを強化。

### 4.2 主要機能ごとの実装ステップ
1. **共通基盤**
   - 管理者認証フロー（ログイン、2FA、パスワードリセット）
   - サイドバー/トップバー/パンくずリストの UI コンポーネント化
   - 権限に応じたメニュー出し分け（Feature flag + RBAC）
   - **初回スプリントでは以下のサブタスクを完了させる**
     - [x] `/admin` トップ（ダッシュボード雛形）を追加し、共通レイアウトでラップする
     - [x] サイドバー/トップバーの UI コンポーネントを作成し、ダミーメニュー・ユーザー情報を表示
     - [ ] 画面幅に応じたレスポンシブ挙動（モバイルではドロワー）を検討しタスク化
2. **データ表示層**
   - Laravel で `Admin*Controller` を用意し、Resource API として提供
   - Next.js 側で SWR/React Query を使い、検索・フィルタ・ページネーションを実装
   - DataGrid コンポーネント化（列定義、ソート、エクスポート）
3. **更新系機能**
   - Mutations を `useMutation` で共通化し、トースト/ダイアログによるフィードバック
   - 履歴管理のための監査ログテーブル (`admin_audit_logs`) を追加
4. **可観測性と安全性**
   - Laravel 側でアクティビティログ、通知（Slack/Webhook）を整備
   - CloudWatch / Datadog などの APM 連携を想定し、メトリクスを送信
   - エラーレポートを Sentry に統合

### 4.3 マイルストーン例
| スプリント | ゴール | 主なタスク |
| --- | --- | --- |
| 1 | 認証と UI 骨組み | RBAC 設計、レイアウト作成、モックデータで画面構築（Pages Router 対応） |
| 2 | 案件・ユーザー管理 MVP | 案件 CRUD、ユーザー一覧、検索/フィルタ、監査ログ |
| 3 | 決済・サポート統合 | 支払承認フロー、通報チケット、通知連携 |
| 4 | 分析と自動化 | KPI ダッシュボード、アラート、バッチ処理、エクスポート |

## 5. UX 改善のベストプラクティス
- 主要 KPI や承認待ち件数を即時に把握できる「ファーストビュー」設計。
- モーダル/ドロワーを活用し、コンテキストを失わずに詳細確認・操作が可能。
- 操作履歴や担当者メモをタイムラインで表示してチーム連携をサポート。
- アクセシビリティ（キーボード操作、WCAG 2.1 AA）を考慮し、オペレーション効率を高める。
- 重要操作は二段階確認 + Undo で事故防止、成功/失敗のフィードバックは即時表示。

## 6. 今後の拡張案
- 機械学習による案件マッチングや不正検知スコアリングの可視化。
- 管理画面内からニュースレターやアナウンスを配信できるコンテンツハブ。
- チャットボットや FAQ との連携でサポート業務を自動化。

## 7. 最新の進捗メモ
- `/admin` ダッシュボードの UI 骨組みを Next.js Pages Router 上で実装し、メトリクス・アクティビティ・審査待ちリストをモックデータで表示できるようにした。
- 共通レイアウトとしてサイドバー・トップバー・モバイルドロワーを整備。今後は RBAC に基づくメニュー出し分けと API 連携が必要。
- モバイル時のレイアウト最適化（カード幅、リスト操作性）は追加検討が必要なため、別途タスク化する。

## 8. 管理画面API実装計画

### 8.1 現状の課題
現在の管理画面 (`/admin`) は **全てモックデータ** で動作しており、実際のデータベースと連携していない。
以下のデータが全てハードコーディングされている:
- KPIメトリクス (承認待ち案件数、通報数、継続率、SLA)
- 最近のアクティビティ (架空のユーザー名・操作履歴)
- 審査待ち案件一覧 (架空の会社名・案件データ)

### 8.2 必要なAPI一覧

#### 8.2.1 ダッシュボード用API (優先度: 高)

**1. KPIメトリクス取得**
```
GET /api/admin/metrics
認証: 必須 (管理者権限)
レスポンス:
{
  "pending_projects_count": 18,
  "pending_projects_delta": "+3",
  "reports_today_count": 5,
  "reports_today_delta": "+2",
  "monthly_retention_rate": "87%",
  "monthly_retention_delta": "+4%",
  "average_sla_hours": "2.6h",
  "average_sla_delta": "-0.4h"
}
```

**2. 最近のアクティビティ取得**
```
GET /api/admin/activities?limit=10
認証: 必須 (管理者権限)
レスポンス:
{
  "activities": [
    {
      "id": 1,
      "time": "08:24",
      "title": "案件「AI 記事ライター」を承認",
      "by": "佐藤 ひかり",
      "role": "オペレーター",
      "created_at": "2025-10-17T08:24:00Z"
    }
  ]
}
```

**3. 審査待ち案件一覧取得**
```
GET /api/admin/projects/pending?limit=10
認証: 必須 (管理者権限)
レスポンス:
{
  "projects": [
    {
      "id": "PRJ-4821",
      "title": "Next.js SaaS の UI 改修",
      "client": {
        "id": 123,
        "name": "株式会社オーロラ"
      },
      "budget_min": 300000,
      "budget_max": 350000,
      "submitted_at": "2025-10-10T21:40:00Z"
    }
  ]
}
```

#### 8.2.2 案件管理API (優先度: 高)

```
GET    /api/admin/projects              - 全案件一覧 (フィルタ・ページネーション対応)
GET    /api/admin/projects/:id          - 案件詳細取得
PATCH  /api/admin/projects/:id/approve  - 案件承認
PATCH  /api/admin/projects/:id/reject   - 案件却下
DELETE /api/admin/projects/:id          - 案件削除
```

#### 8.2.3 ユーザー管理API (優先度: 中)

```
GET    /api/admin/users           - 全ユーザー一覧
GET    /api/admin/users/:id       - ユーザー詳細
PATCH  /api/admin/users/:id/ban   - ユーザーBAN
PATCH  /api/admin/users/:id/unban - BAN解除
PATCH  /api/admin/users/:id/role  - 権限変更
```

#### 8.2.4 決済・取引管理API (優先度: 中)

```
GET   /api/admin/payments              - 決済履歴一覧
GET   /api/admin/payments/:id          - 決済詳細
PATCH /api/admin/payments/:id/approve  - 支払い承認
```

#### 8.2.5 サポート対応API (優先度: 低)

```
GET   /api/admin/reports              - 通報一覧
GET   /api/admin/reports/:id          - 通報詳細
PATCH /api/admin/reports/:id/resolve  - 通報解決
```

### 8.3 実装手順

#### Phase 1: 権限管理基盤 (1週目)
- [ ] `users` テーブルに `role` カラム追加 (enum: 'user', 'admin')
- [ ] 管理者権限チェック用ミドルウェア `EnsureUserIsAdmin` 作成
- [ ] 既存ユーザーの1人を管理者に昇格 (Seeder)

#### Phase 2: ダッシュボードAPI実装 (1-2週目)
- [ ] `AdminDashboardController` 作成
- [ ] `GET /api/admin/metrics` 実装
  - `projects` テーブルから承認待ち案件をカウント
  - 前日比の差分計算ロジック実装
- [ ] `AdminActivity` モデル作成 (監査ログ用テーブル)
- [ ] `GET /api/admin/activities` 実装
- [ ] `GET /api/admin/projects/pending` 実装

#### Phase 3: 案件管理API実装 (2-3週目)
- [ ] `AdminProjectController` 作成
- [ ] `GET /api/admin/projects` - 全案件一覧 (ページネーション)
- [ ] `PATCH /api/admin/projects/:id/approve` - 承認処理
  - `status` を `draft` → `open` に変更
  - 監査ログ記録
- [ ] `PATCH /api/admin/projects/:id/reject` - 却下処理
- [ ] フロントエンド: 承認・却下ボタンにAPI呼び出し実装

#### Phase 4: ユーザー管理API実装 (3-4週目)
- [ ] `AdminUserController` 作成
- [ ] `users` テーブルに `banned_at` カラム追加
- [ ] `PATCH /api/admin/users/:id/ban` 実装
- [ ] `/admin/users` ページ作成

#### Phase 5: 決済・サポートAPI (4週目以降)
- [ ] `AdminPaymentController` と `AdminReportController` 作成
- [ ] 各種ページ実装

### 8.4 データベース設計

#### `admin_activities` テーブル (監査ログ)
```sql
CREATE TABLE admin_activities (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  admin_user_id BIGINT UNSIGNED NOT NULL,
  action VARCHAR(255) NOT NULL,
  target_type VARCHAR(255) NULL,
  target_id BIGINT UNSIGNED NULL,
  description TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_user_id) REFERENCES users(id)
);
```

#### `users` テーブル変更
```sql
ALTER TABLE users ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user';
ALTER TABLE users ADD COLUMN banned_at TIMESTAMP NULL;
```

### 8.5 セキュリティ考慮事項
- 全ての管理API は `auth:sanctum` + `admin` ミドルウェアで保護
- CSRF 保護を有効化
- レート制限: 管理APIは通常APIより緩め (例: 120req/min)
- 監査ログで全ての管理操作を記録
- 管理画面ページに `<meta name="robots" content="noindex" />` 設定済み

---
このプランを指針に、クラウドワークスのようなマッチングサービスでも運用チームが迷わず動ける管理体験を目指せます。
