# GitHub Copilot Skills Auto Selection Rules

このファイルは、このリポジトリで GitHub Copilot が `/.github/skills` を自動選択するための運用ルールです。

## 基本方針

- ユーザー依頼を最初に分類し、最も適合度の高い Skill を 1 つ選ぶ
- Figma の生データ取得は親エージェントで直接行わず、必要時は必ず `Figma Design Fetcher` サブエージェントを使う
- Figma の設計データ（layout、variables、component tree、metadata）は必ずリモート MCP から取得する
- Figma の画像・SVG・スクリーンショットなどのアセット取得はローカル MCP を使う
- 複数 Skill が該当する場合は「成果物の種類」で優先度を決める
- 迷う場合は実装開始前に 1 回だけ確認質問を行う

## Skill ルーティング（自動選択）

### 2) nextjs-app-router-architecture（Tailwind 実装規約）

次の条件に 1 つでも一致したら、Tailwind 実装時に併用する。

- Figma を Tailwind CSS で正しく実装したい
- `w-[45px]` のような arbitrary value を避けたい
- Tailwind の既存値と custom utility の使い分けをしたい
- 「Tailwind ベストプラクティス」「Tailwind らしい書き方」「Figma を Tailwind で実装」などの依頼

実行ルール:

- Tailwind に存在する値は必ず既存 utility を優先する
- 不足する正確な値は arbitrary value ではなく shared CSS 上の reusable utility で定義する
- CSS コンポーネントクラスにまとめず、Tailwind utility を要素上に直接書く


### 3) figma-code-connect（Code Connect 作成・更新）

次の条件で選択する。

- `.figma.ts` / `.figma.js` の作成・修正
- 「Code Connect」「コンポーネントマッピング」「Figma props と code props の対応」などの依頼

実行ルール:

- 先に `get_code_connect_suggestions` で未接続コンポーネントを確認
- Figma プロパティ型（TEXT/BOOLEAN/VARIANT/INSTANCE_SWAP/SLOT）を厳密にマッピング

### 4) figma-create-design-system-rules（ルール生成）

次の条件で選択する。

- 「design system rules を作って」「Figma実装ルールを整備したい」
- エージェント向けの恒久的ルールを作る依頼

実行ルール:

- まず `create_design_system_rules` ツールのガイドを取得
- コードベース実態に合わせて rule file を作成/更新

## サブエージェント利用ルール

Figma のデザイン取得が必要な場合は、必ず `Figma Design Fetcher` を使う。

- 入力: `fileKey` と `nodeId`
- 設計データ取得はリモート MCP に固定し、ローカル desktop MCP の選択ノードには依存しない
- 画像・SVG・スクリーンショットなどのアセットだけをローカル MCP から取得する
- 取得結果は `FigmaDesignSummary` のみを利用し、生 JSON は展開しない

## 優先順位（競合時）

複数 Skill が一致した場合は以下の順で選択する。

1. `figma-code-connect`（成果物が `.figma.ts` のとき）
2. `figma-create-design-system-rules`（成果物がルール文書のとき）
3. `figma-mcp-nextjs-tailwind`（Next.js + Tailwind 実装のとき）
4. `figma-implement-design`（その他の Figma 実装）

## 実行前チェック

- Figma URL がある場合は `fileKey` と `node-id` を抽出
- URL がない場合は、リモート MCP で取得できる `fileKey` と `node-id` をユーザーに確認する
- 実装対象が `page` / `feature` / `shared` のどれかを明確化

## 禁止事項

- Skill の要件を満たすのに、手動実装へ迂回しない
- Figma localhost アセットがあるのにプレースホルダ画像を作らない
- 新規 icon パッケージを勝手に追加しない
- 既存トークンと重複する同義トークンを増やさない
