## Devlogr フロントエンド

Next.js Pages Router をベースにした Devlogr のフロントエンドです。`npm run dev` でローカルサーバーを起動できます。

```bash
cd next-app
npm install
npm run dev
```

### トップページのヒーローセクション

`pages/index.tsx` では、[PavelDoGreat/WebGL-Fluid-Simulation](https://github.com/PavelDoGreat/WebGL-Fluid-Simulation) を参考にした WebGL 流体シミュレーション背景を表示しています。実装は `lib/fluidSimulation.ts` に分離し、MIT ライセンスに基づいてカスタマイズしています。

主要なカスタマイズポイント:

- WebGL2 のテクスチャ解像度やスプラッシュ半径を Next.js 上で調整
- `Hero` コンポーネントでキャンバスとコピーの重ね合わせ演出を実装
- 企業ブランドを意識した CTA とサービス紹介カードを Tailwind CSS でデザイン

### コード品質チェック

```bash
npm run lint
```

ESLint/Prettier により 2 スペース・シングルクォートスタイルを強制しています。

### ライセンス表記

流体シミュレーションのロジックは MIT ライセンスの下で提供される PavelDoGreat/WebGL-Fluid-Simulation をベースにしています。必要に応じて `lib/fluidSimulation.ts` のコメントやコミット履歴で出典を参照してください。
