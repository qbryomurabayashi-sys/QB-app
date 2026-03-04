# QB House Evaluation System

QB House スタッフ向けの評価・フィードバック管理システムです。

## 機能
- **スタッフ評価入力**: 各カテゴリ（関係性、接客、技術、実績、店長）ごとの詳細な評価入力
- **店長評価ロック (AM専用)**: AM以外のスタッフによる誤操作を防ぐためのパスワード保護機能
- **分析チャート**: レーダーチャートによる評価の可視化、月別カット人数の推移グラフ
- **履歴管理**: 過去の評価データの保存と、前回データとの比較表示
- **CSV出力**: 個別データおよび全スタッフ一覧のCSVダウンロード
- **印刷機能**: A4サイズに最適化された評価フィードバックシートの出力（個別・一括）

## 技術スタック
- React 18
- Vite
- TypeScript
- Tailwind CSS
- Lucide React (アイコン)
- Recharts (グラフ)

## ローカルでの実行方法

1. 依存関係のインストール:
   ```bash
   npm install
   ```

2. 開発サーバーの起動:
   ```bash
   npm run dev
   ```

3. ビルド（本番用ファイルの生成）:
   ```bash
   npm run build
   ```

## デプロイ方法
Vercel や Netlify に GitHub リポジトリを連携するだけで、自動的にビルドおよびデプロイが行われます。
ビルド設定はデフォルト（Build Command: `npm run build`, Output Directory: `dist`）で動作します。
