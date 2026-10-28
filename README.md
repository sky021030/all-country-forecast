# オルカン予報（STEP 1）

eMAXIS Slim 全世界株式（オール・カントリー）専用の基準価額予測ダッシュボードです。STEP 1 では架空のサンプルデータだけを使用し、外部 API には接続していません。

## ローカルで起動

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。

## 本番ビルド

```bash
npm run build
npm start
```

## 実データへの切り替え

`lib/forecast.ts` の `getForecastData()` を API やデータベースから取得する処理に差し替えます。画面側は `ForecastData` 型だけに依存しているため、表示コンポーネントを大きく変更せず移行できます。
