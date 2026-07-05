# AI Architecture Guide

この文書は、この Next.js プロジェクトの構成を他案件でも再利用しやすい形に正規化した AI 向けガイドです。
実装方針、依存境界、命名規則、追加手順、検証手順を優先して整理しています。

## 1. この文書の優先順位

- AI が新規実装、修正、レビュー方針を決めるときは、まずこの文書を参照する。
- 既存の `architecture-complete.md` は背景説明と補足資料として扱う。
- 原則と現行実装が軽くずれる箇所は、この文書では「原則」と「現行例」を分けて扱う。

## 2. このガイドでの唯一の抽象化

このガイドでは、再利用しやすさのために `src/shared/components` を `src/components` として表現する。
それ以外の構成、責務、依存方向、実装手順は現行プロジェクトに合わせる。

現行リポジトリ上の対応:

- ガイド上の `src/components/layout/**` = 現行実装の `frontend/src/shared/components/layout/**`
- ガイド上の `src/components/ui/**` = 現行実装の `frontend/src/shared/components/ui/**`
- `src/shared/lib/**`, `src/shared/providers/**`, `src/shared/actions/**`, `src/shared/types/**` は現行のまま維持する

## 3. 標準ディレクトリ構成

```text
src/
├─ app/           # App Router: page, layout, error, loading
├─ features/      # ドメイン別 UI とフロントロジック
├─ components/    # アプリ横断の layout, ui
├─ shared/        # lib, providers, actions, types など横断モジュール
├─ external/      # DTO, handler, service, repository, client
└─ test/          # テスト共通セットアップ
```

### 3.1 `app/`

- ルート定義だけを置く。
- `page.tsx` は `PageProps<'/path'>` を使い、必要な `params` / `searchParams` を受け取って feature の server template に委譲する。
- `layout.tsx` は `LayoutProps<'/path'>` と `metadata` を持ち、レイアウトクロームとアクセス制御だけを担当する。
- ビジネスロジック、DTO 変換、service 呼び出しは置かない。

### 3.2 `features/`

- 各機能をドメイン単位で閉じ込める。
- UI、hook、query key、feature 専用 action、型、テストをここに集約する。

```text
features/<domain>/
├─ actions/
├─ components/
│  ├─ client/
│  └─ server/
├─ hooks/
│  ├─ mutation/
│  └─ query/
├─ queries/
├─ types/
└─ providers/     # その機能に閉じた provider が必要な場合のみ
```

### 3.3 `components/`

- アプリ全体で使う共通 UI と layout を置く。
- ドメイン知識を持たせない。

```text
components/
├─ layout/
│  ├─ client/
│  └─ server/
└─ ui/
```

### 3.4 `shared/`

- どの feature にも属さない横断的な TypeScript モジュールを置く。
- 例: query client, provider, 共通 action, 共通 types。

### 3.5 `external/`

- 外部 I/O とサーバー側ビジネスロジックを閉じ込める。
- feature は `external/handler/**` だけを入口として使う。

```text
external/
├─ client/        # 外部 API / DB client
├─ domain/        # ドメインモデル
├─ dto/           # Zod schema + DTO type
├─ handler/       # feature から呼ばれる唯一の入口
├─ repository/    # 永続化
└─ service/       # ビジネスロジック
```

## 4. 依存方向

許可される主な依存方向:

- `app -> features`
- `app -> components`
- `features -> shared`
- `features -> external/handler`
- `components -> shared`
- `external/handler -> external/service`
- `external/service -> external/repository`
- `external/service -> external/domain`
- `external/handler -> external/dto`

禁止する主な依存方向:

- `app -> external/service`
- `app -> external/repository`
- `features -> external/service`
- `features -> external/repository`
- `features -> external/domain`
- `components -> external/service`
- `Presenter -> *.action.ts`
- `Server Component -> Client 専用 hook`

判断に迷ったら、「そのコードは UI か I/O か業務ロジックか」で分ける。
I/O と業務ロジックは `external/`、UI とユーザー操作は `features/` または `components/` に置く。

## 5. ルートグループ規約

```text
app/
├─ (authenticated)/
├─ (guest)/
└─ (neutral)/
```

- `(authenticated)` はログイン必須の画面。
- `(guest)` は未認証ユーザー専用の画面。
- `(neutral)` は誰でも入れる画面。

### 5.1 `layout.tsx` の役割

- `metadata` を export する。
- 対応する layout wrapper を描画する。
- 認証判定、共通クローム、必要なら hydration の外枠を用意する。
- 画面固有のデータ取得は行わない。

### 5.2 `page.tsx` の役割

- `props.params` と `props.searchParams` を `await` で受け取る。
- URL パラメータの最小限の正規化だけは許容する。
- 実際の描画とデータ取得は `features/<domain>/components/server/*Template.tsx` に委譲する。

原則:

- `page.tsx` は薄く保つ。

現行実装で許容している例:

- クエリパラメータからタブ状態やフィルタ値を正規化する。
- feature template に渡す props へ整形する。

## 6. Feature の標準構成

### 6.1 Client Component パターン

```text
features/<domain>/components/client/<Widget>/
├─ <Widget>Container.tsx
├─ <Widget>Presenter.tsx
├─ use<Widget>.ts
├─ <Widget>.test.tsx
└─ index.ts
```

- `Container` は orchestration を担当する。
- `Presenter` は純粋な JSX だけを担当する。
- `use<Widget>.ts` は TanStack Query、フォーム、派生状態、mutation 呼び出しを担当する。
- テストは同じディレクトリにコロケーションする。

### 6.2 Server Component パターン

```text
features/<domain>/components/server/<Page>/
├─ <Page>Template.tsx
└─ index.ts
```

- サーバーで必要なデータを取得する。
- query client へ prefetch する。
- `HydrationBoundary` で client component へ初期キャッシュを渡す。
- 静的表示だけで足りる場合は hydration しない。

## 7. データ取得と更新の標準フロー

### 7.1 読み取りフロー

```text
page.tsx
  -> Server Template
  -> external/handler/*/query.server.ts
  -> service
  -> repository / client
  -> DTO validation
  -> HydrationBoundary
  -> Container
  -> Hook
  -> Presenter
```

### 7.2 クライアント再利用フロー

```text
Client Hook
  -> external/handler/*/query.action.ts
  -> same query key
  -> DTO validation helper
```

### 7.3 更新フロー

```text
Presenter event
  -> Container callback
  -> mutation hook
  -> external/handler/*/command.action.ts
  -> external/handler/*/command.server.ts
  -> service
  -> repository
  -> query invalidation
```

### 7.4 重要ルール

- 初回表示を安定させたい画面は server で prefetch してから hydrate する。
- ダッシュボードや summary のように server で完結する静的表示は `Promise.all` で直接取得し、TanStack Query を使わない。
- DTO helper でレスポンスを検証してから UI に渡す。
- mutation 後の invalidate は最小範囲に絞る。

## 8. `external/` 実装規約

### 8.1 DTO

- `external/dto/**` に Zod schema と TypeScript 型を置く。
- 受信値、返却値、入力 payload をここで固定する。
- UI に渡す前に必ず DTO helper で検証する。

### 8.2 Handler

- feature から見える唯一のサーバー入口。
- `query.action.ts` は client から呼ぶ server action。
- `query.server.ts` は server component から直接使う読み取りロジック。
- `command.action.ts` は client から呼ぶ変更系 server action。
- `command.server.ts` は server 専用の変更系処理。

### 8.3 Service

- 複数 repository をまたぐ業務ロジックを閉じ込める。
- transaction、権限判定、状態遷移、通知連携などはここに置く。
- feature は service を直接 import しない。

### 8.4 Repository

- 永続化の詳細だけを担当する。
- query builder や SQL の詳細はここに閉じ込める。
- repository から UI 用の整形はしない。

## 9. 命名規則

| 種別 | 規則 | 例 |
|---|---|---|
| React Component | PascalCase | `RequestListContainer.tsx` |
| Presenter | PascalCase + `Presenter` | `RequestListPresenter.tsx` |
| Container | PascalCase + `Container` | `NotificationsListContainer.tsx` |
| Hook | `use` + PascalCase | `useRequestListQuery.ts` |
| Server Template | PascalCase + `Template` | `RequestsPageTemplate.tsx` |
| Query Action | `query.action.ts` | `query.action.ts` |
| Command Action | `command.action.ts` | `command.action.ts` |
| Server-only module | `.server.ts` | `query.server.ts` |
| DTO schema | camelCase + `Schema` | `createRequestSchema` |
| Query key factory | camelCase + `Keys` | `requestKeys` |
| Test | `.test.ts` / `.test.tsx` | `useRequestListQuery.test.ts` |

## 10. 新規ルート追加手順

1. 対象ルートが `(authenticated)`, `(guest)`, `(neutral)` のどれに属するか決める。
2. `app/<group>/<route>/layout.tsx` を作成し、`LayoutProps<'/path'>` と `metadata` を定義する。
3. `app/<group>/<route>/page.tsx` を作成し、`PageProps<'/path'>` で `params` / `searchParams` を受ける。
4. `features/<domain>/components/server/<Page>/<Page>Template.tsx` を作成する。
5. `page.tsx` から template を呼び出す。
6. 非同期処理が重い画面なら `loading.tsx` を追加する。
7. エラーで route 単位に閉じたい場合は `error.tsx` を追加する。
8. `frontend` で `pnpm typegen` を実行する。

完了条件:

- route の型が生成される。
- `page.tsx` にビジネスロジックが残っていない。
- layout が route group の責務を満たしている。

## 11. 新規 Feature 追加手順

1. `features/<domain>/types` に UI が使う型と enum を定義する。
2. `features/<domain>/queries` に query key factory と DTO helper を作る。
3. 読み取りが必要なら `features/<domain>/hooks/query` に hook を追加する。
4. 更新が必要なら `features/<domain>/hooks/mutation` に mutation hook を追加する。
5. `features/<domain>/components/client/<Widget>` に Container / Presenter / local hook を作る。
6. 初回描画でデータが必要なら `features/<domain>/components/server/<Page>/<Page>Template.tsx` を追加する。
7. feature 専用の薄い server action facade が必要なら `features/<domain>/actions` を追加する。
8. テストを追加する。

完了条件:

- Presenter が副作用を持たない。
- Container が UI と I/O をつなぐだけになっている。
- Query key と invalidate の対応が明確。

## 12. `external/` 追加手順

1. `external/dto/<domain>` に schema と型を追加する。
2. `external/repository/<backend or domain>` に永続化処理を追加する。
3. `external/service/<domain>` にユースケース単位の service を追加する。
4. `external/handler/<domain>` に `query.server.ts` または `command.server.ts` を追加する。
5. client から呼ぶ必要がある処理だけ `query.action.ts` または `command.action.ts` から公開する。
6. feature hook から handler を呼び出す。
7. DTO helper で response を検証する。

完了条件:

- feature が service や repository を直接 import していない。
- handler が入出力の境界になっている。
- DTO validation を通らない値が UI に渡らない。

## 13. 実装時の禁止事項

- `app/` から service や repository を直接呼ばない。
- Presenter に `useQuery`, `useMutation`, `useForm`, `useState` を置かない。
- feature から `external/domain/**` を直接 import しない。
- `server-only` が必要なファイルを client 側から参照しない。
- 画面ごとの一時都合で依存境界を崩さない。
- lint ルール違反を回避するために相対 import や re-export で抜け道を作らない。

## 14. 品質ゲート

変更後は `frontend` ディレクトリで次を実行する。

### 14.1 ルートや app 構造を触ったとき

```text
pnpm typegen
pnpm lint
```

### 14.2 hook, component, action, handler を触ったとき

```text
pnpm lint
pnpm test:run
```

### 14.3 大きめの整理やリファクタ時

```text
pnpm typegen
pnpm lint
pnpm test:run
pnpm format:check
```

### 14.4 チェック観点

- カスタム ESLint ルールに違反していないか。
- `PageProps` / `LayoutProps` を使っているか。
- client component に `'use client'` があるか。
- server 専用ファイルに `import 'server-only'` があるか。
- DTO validation helper を通しているか。
- mutation 後の invalidate 対象が妥当か。

## 15. AI 実装テンプレート

### 15.1 新規 page

```tsx
import { ExamplePageTemplate } from '@/features/example/components/server/ExamplePageTemplate'

export default async function ExamplePage(props: PageProps<'/example'>) {
  const searchParams = await props.searchParams

  return <ExamplePageTemplate searchParams={searchParams} />
}
```

### 15.2 新規 server template

```tsx
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { ExampleList } from '@/features/example/components/client/ExampleList'
import { exampleKeys } from '@/features/example/queries/keys'
import { ensureExampleListResponse } from '@/features/example/queries/exampleList.helpers'
import { getQueryClient } from '@/shared/lib/query-client'
import { listExamplesServer } from '@/external/handler/example/query.server'

export async function ExamplePageTemplate() {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: exampleKeys.list(),
    queryFn: async () => ensureExampleListResponse(await listExamplesServer()),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ExampleList />
    </HydrationBoundary>
  )
}
```

### 15.3 新規 client hook

```tsx
'use client'

import { useQuery } from '@tanstack/react-query'

import { listExamplesAction } from '@/external/handler/example/query.action'

import { exampleKeys } from '@/features/example/queries/keys'
import { ensureExampleListResponse } from '@/features/example/queries/exampleList.helpers'

export const useExampleListQuery = () => {
  return useQuery({
    queryKey: exampleKeys.list(),
    queryFn: async () => ensureExampleListResponse(await listExamplesAction()),
  })
}
```

## 16. 現行リポジトリの参照実装

- 読み取り + hydration の代表: `frontend/src/features/requests/components/server/RequestsPageTemplate/RequestsPageTemplate.tsx`
- query hook の代表: `frontend/src/features/requests/hooks/query/useRequestListQuery.ts`
- 認証付き layout wrapper の代表: `frontend/src/shared/components/layout/server/AuthenticatedLayoutWrapper/AuthenticatedLayoutWrapper.tsx`
- `page.tsx` の最小責務の例: `frontend/src/app/(authenticated)/requests/page.tsx`
- 品質ゲートの参照: `frontend/package.json`, `docs/checklists.md`, `frontend/docs/README.md`

## 17. 実装時の判断順序

AI は新規タスクを受けたら、次の順序で実装方針を決める。

1. その変更は route 追加か、feature 追加か、external 変更かを判定する。
2. 初回表示を server で完結させるべきか、hydrate するべきかを判定する。
3. UI が feature 固有か、全体共通かを判定して `features/` と `components/` を分ける。
4. 入出力境界に DTO が必要かを判定する。
5. handler だけを public entry point にする。
6. 最後に `typegen`, `lint`, `test:run` の必要範囲を決めて検証する。

この順序を崩すと、`app` が肥大化し、feature から server ロジックへ直接依存しやすくなる。