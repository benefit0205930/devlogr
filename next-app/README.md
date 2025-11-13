# Devlogr Frontend (Next.js)

Devlogrのフロントエンドアプリケーションです。Next.js 15 (Pages Router) を使用して構築されています。

## 技術スタック

- **Framework**: Next.js 15 (Pages Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **HTTP Client**: Axios
- **State Management**: React Context API

## セットアップ

### 前提条件

- Node.js 18+
- npm または yarn

### インストール

```bash
cd next-app
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

アプリケーションは `http://localhost:3000` でアクセスできます。

## 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動
npm start

# ESLint実行
npm run lint

# ESLint自動修正
npm run lint:fix

# TypeScript型チェック
npm run type-check

# Prettierフォーマット
npm run format

# Prettierフォーマットチェック
npm run format:check
```

## プロジェクト構造

```
next-app/
├── components/          # Reactコンポーネント
│   ├── mypage/         # マイページ専用コンポーネント
│   └── projects/       # プロジェクト関連コンポーネント
├── pages/              # ページルーティング
│   ├── api/           # API Routes
│   ├── auth/          # 認証ページ
│   ├── projects/      # プロジェクトページ
│   └── mypage/        # マイページ
├── hooks/              # カスタムReactフック
├── lib/                # ユーティリティ・APIクライアント
├── types/              # TypeScript型定義
├── contexts/           # React Context
└── styles/             # グローバルスタイル
```

## 主要な機能

### 認証

- Laravel Sanctumを使用したセッションベース認証
- CSRF保護
- 認証状態の管理（AuthContext）

### プロジェクト管理

- プロジェクト一覧表示
- 高度な検索・フィルタリング機能
- プロジェクト詳細表示
- ブックマーク機能

### マイページ

- ワーカー/クライアントモード切替
- ダッシュボード表示
- タスク管理
- おすすめ案件の表示

### UIコンポーネント

- WebGLを使用した流体シミュレーション背景（Heroセクション）
- レスポンシブデザイン
- アクセシビリティ対応
- ローディング状態とエラーハンドリング

## API通信

`lib/api.ts` でAxiosインスタンスを設定し、認証情報を自動的に送信します。

開発環境では `next.config.ts` の `rewrites` を使用してAPIリクエストをプロキシします。

## 環境変数

`.env.local` ファイルを作成して以下の環境変数を設定してください：

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## コード品質

### ESLint

Next.jsの標準ESLint設定に加えて、以下のルールを適用：

- 未使用変数の警告（`_` 接頭辞で除外可能）
- `no-console` の警告

### Prettier

- 2スペースインデント
- シングルクォート
- セミコロンなし

### TypeScript

- 厳密な型チェック
- `type-check` スクリプトで型エラーを検出

## ヒーローセクションの流体シミュレーション

`pages/index.tsx` のヒーローセクションでは、[PavelDoGreat/WebGL-Fluid-Simulation](https://github.com/PavelDoGreat/WebGL-Fluid-Simulation) を参考にしたWebGL流体シミュレーション背景を表示しています。

実装は `lib/fluidSimulation.ts` に分離され、MITライセンスに基づいてカスタマイズされています。

### カスタマイズポイント

- WebGL2のテクスチャ解像度やスプラッシュ半径をNext.js上で調整
- `Hero` コンポーネントでキャンバスとコピーの重ね合わせ演出を実装
- 企業ブランドを意識したCTAとサービス紹介カードをTailwind CSSでデザイン

## デプロイ

Vercelにデプロイする場合：

1. Vercelアカウントにログイン
2. GitHubリポジトリを接続
3. プロジェクト設定：
   - Root Directory: `next-app`
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. 環境変数を設定：
   - `NEXT_PUBLIC_API_BASE_URL`: バックエンドAPIのURL

## ライセンス

このプロジェクトは [MIT License](../LICENSE) の下で公開されています。

### サードパーティライセンス

流体シミュレーションのロジックは MIT ライセンスの下で提供される PavelDoGreat/WebGL-Fluid-Simulation をベースにしています。必要に応じて `lib/fluidSimulation.ts` のコメントやコミット履歴で出典を参照してください。
