# CLAUDE.md — Anahuac Manager

> **このファイルはAIエージェント向けの唯一の信頼できる情報源です。変更前に必ずこのファイルを読んでください。**


## 2. ディレクトリ構成

```
/
└── 
    ├── src/
    │   ├── app/                        # ルーティング・レイアウト・メタデータのみ。ビジネスロジック禁止
    │   │   ├── (authenticated)/        # 認証必須ルート
    │   │   ├── (guest)/                # 未認証専用ルート (ログイン、サインアップ)
    │   │   ├── (neutral)/              # 認証不問ルート
    │   │   ├── api/                    # Route Handlers (REST エンドポイント)
    │   │   ├── layout.tsx              # ルートレイアウト + CSP
    │   │   └── page.tsx                # ルートリダイレクト
    │   ├── features/                   # ドメインスライス
    │   │   └── <domain>/
    │   │       ├── actions/            # Server Actions
    │   │       ├── components/
    │   │       │   ├── client/         # Client Components (Container / Presenter / Hook)
    │   │       │   └── server/         # Server Component テンプレート
    │   │       ├── constants/
    │   │       ├── hooks/
    │   │       │   ├── query/          # TanStack Query hooks
    │   │       │   └── mutation/       # TanStack Mutation hooks
    │   │       ├── lib/
    │   │       ├── providers/
    │   │       ├── queries/            # クエリキーファクトリ + DTO バリデーター
    │   │       ├── schemas/            # Zod フォームスキーマ
    │   │       ├── servers/            # サーバー専用ユーティリティ (token.server.ts 等)
    │   │       └── types/
    │   ├── shared/                     # ドメイン知識ゼロの横断的モジュール
    │   │   ├── actions/
    │   │   ├── components/
    │   │   │   └── layout/
    │   │   │       └── server/         # AuthenticatedLayoutWrapper, GuestLayoutWrapper
    │   │   ├── lib/                    # query-client.ts, utils
    │   │   ├── providers/              # TanStack Query provider, Auth provider
    │   │   └── types/
    │   ├── external/                   # サーバーサイドインフラ — クライアントから絶対にインポートしない
    │   │   ├── client/                 # サードパーティ API クライアント (Identity Platform 等)
    │   │   ├── domain/                 # external 横断の共有ドメインモデル型
    │   │   ├── dto/                    # Zod スキーマ + 推論済み TS 型 (全 I/O)
    │   │   ├── handler/                # Server Actions のエントリポイント
    │   │   │   └── <domain>/
    │   │   │       ├── command.server.ts   # 変更操作
    │   │   │       └── query.server.ts     # 読み取り操作
    │   │   ├── repository/             # DB クエリ (Drizzle)
    │   │   └── service/                # ドメインサービス / オーケストレーション
    │   │       └── auth/
    │   │           └── AuthenticationService.ts
    │   └── middleware.ts               # Edge ミドルウェア (認証ガード、リダイレクト)
    ├── docs/
    │   └── README.md                   # フロントエンドアーキテクチャ概要
    └── eslint-local-rules/             # 境界強制のカスタム ESLint ルール
```

---

## 3. アーキテクチャ層と境界ルール

依存方向（上から下。逆方向インポート禁止）:

```
app/  ->  features/  ->  shared/
                   \
               external/handler  ->  external/service  ->  external/repository  ->  DB
                                                       \
                                                    external/client  ->  3rd-party API
```

### ESLint で強制されるルール

| ルール | 意味 |
|---|---|
| `restrict-service-imports` | `external/handler/**` のみがサービスをインポート可。features は直接触らない |
| `restrict-action-imports` | Server Actions は hooks/containers のみがインポート可。presenters は不可 |
| `use-nextjs-helpers` | `page.tsx` / `layout.tsx` は `PageProps<'/path'>` / `LayoutProps<'/path'>` ヘルパーを使う |

**ルールが発火した場合は設計を見直す。回避策を取らない。**

---

## 4. コンポーネントパターン: Container / Presenter / Hook

`features/<domain>/components/client/<Widget>/` 内の3ファイル構成:

```
<Widget>Container.tsx   # 'use client' — hooks を呼び出し、フラットな props を Presenter へ渡す
<Widget>Presenter.tsx   # 純粋 JSX — 状態なし、副作用なし
use<Widget>.ts          # TanStack Query / RHF / 派生状態
*.test.tsx              # コロケーションテスト (Vitest)
index.ts                # バレルエクスポート
```

**ルール:**
- Container が全副作用とオーケストレーションを担う
- Presenter はステートレス。フラットな型付き props を受け取り JSX を返すのみ
- Hook は TanStack Query、React Hook Form、派生状態をカプセル化する
- テストは実装ファイルとコロケーション配置

**Server Component テンプレート** (`components/server/<Thing>/`):
```
<Thing>.tsx    # async Server Component — フェッチ + プリフェッチ、HydrationBoundary でラップ
index.ts
```

---

## 5. データフェッチパターン

### インタラクティブ画面: TanStack Query ハイドレーション

```tsx
// features/<domain>/components/server/<Domain>PageTemplate.tsx
import 'server-only'
import { getQueryClient } from '@/shared/lib/query-client'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'

const queryClient = getQueryClient()
await queryClient.prefetchQuery({
  queryKey: domainKeys.list(filters),
  queryFn: async () => ensureDomainListResponse(await fetchDomainList(filters)),
})

return (
  <HydrationBoundary state={dehydrate(queryClient)}>
    <DomainListContainer filters={filters} />
  </HydrationBoundary>
)
```

### 読み取り専用ダッシュボード: Promise.all

```tsx
const [summary, recent] = await Promise.all([
  getSummaryHandler(),
  getRecentItemsHandler(),
])
return <DashboardPresenter summary={summary} recent={recent} />
```

### Mutation hooks

```ts
// features/<domain>/hooks/mutation/useDomainMutation.ts
'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useDomainMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: domainCommandHandler,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: domainKeys.all }),
        queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
      ]),
  })
}
```

---

## 6. ルート & レイアウトルール

**ルートグループ:**
- `(authenticated)/` — ログイン必須。レイアウトは `AuthenticatedLayoutWrapper` を適用
- `(guest)/` — 未認証専用。レイアウトは `GuestLayoutWrapper` を適用
- `(neutral)/` — どちらもアクセス可

**`layout.tsx`** — メタデータのエクスポート、`LayoutProps<'/path'>` 使用、レイアウトクロームの描画のみ。ビジネスロジック禁止。

**`page.tsx`** — `PageProps<'/path'>` で `props.params` / `props.searchParams` を await し、即座に feature server テンプレートへ委譲。ページ自体にロジックを書かない。

```tsx
// app/(authenticated)/requests/[requestId]/page.tsx
import { RequestDetailPageTemplate } from '@/features/requests/components/server/RequestDetailPageTemplate'

export default async function RequestDetailPage(
  props: PageProps<'/requests/[requestId]'>,
) {
  const { requestId } = await props.params
  return <RequestDetailPageTemplate requestId={requestId} />
}
```

> `page.tsx` を追加・削除したら必ず `pnpm typegen` を実行する。

---

## 7. external 層ルール

- `external/` 配下の全ファイルは必ず `import 'server-only'` で始める
- `external/dto/` — Zod スキーマ + 推論済み TypeScript 型 (全サーバー I/O)
- `external/handler/<domain>/command.server.ts` — 変更系 Server Actions
- `external/handler/<domain>/query.server.ts` — 読み取り系 Server Actions
- `external/service/` — リポジトリ呼び出しを集約するドメインサービス。`external/handler` 外からインポート禁止
- `external/repository/` — 生の Drizzle クエリ。`external/service` 外からインポート禁止
- `external/client/` — サードパーティ API の薄いラッパー

**ハンドラーシグネチャテンプレート:**

```ts
// external/handler/<domain>/command.server.ts
import 'server-only'
import { <Domain>CommandInputSchema } from '@/external/dto/<domain>'
import { <Domain>Service } from '@/external/service/<domain>'

export async function create<Domain>Handler(rawInput: unknown) {
  const input = <Domain>CommandInputSchema.parse(rawInput)   // Zod で先にバリデーション
  const service = new <Domain>Service()
  return service.create(input)
}
```

---

## 8. Server Actions (features 層)

`features/<domain>/actions/` の Server Actions は薄く保つ: バリデーション → ハンドラー呼び出し → revalidate/redirect

```ts
// features/<domain>/actions/create<Domain>.ts
'use server'
import { revalidatePath } from 'next/cache'
import { create<Domain>Handler } from '@/external/handler/<domain>/command.server'

export async function create<Domain>Action(formData: FormData) {
  const result = await create<Domain>Handler(Object.fromEntries(formData))
  revalidatePath('/<domain>')
  return result
}
```

---

## 9. 認証 & トークン管理

- Cookie 管理 (id-token, refresh-token) は `features/auth/servers/token.server.ts` にのみ存在する
- そのファイル以外で auth Cookie を読み書きしない
- トークンリフレッシュロジックはクライアントに漏らさない
- `AuthenticationService` は全外部呼び出しを `IdentityPlatformClient` に委譲する。DB には触れない

---

## 10. 命名規則

| 種別 | 規則 | 例 |
|---|---|---|
| React コンポーネント | PascalCase | `RequestListContainer.tsx` |
| Hooks | camelCase + `use` プレフィックス | `useRequestListQuery.ts` |
| Server Actions | camelCase + `Action` サフィックス | `createRequestAction.ts` |
| Handlers | camelCase + `Handler` サフィックス | `createRequestHandler` |
| Services | PascalCase + `Service` サフィックス | `RequestService` |
| Repositories | PascalCase + `Repository` サフィックス | `RequestRepository` |
| Zod スキーマ | camelCase + `Schema` サフィックス | `createRequestSchema` |
| クエリキーファクトリ | camelCase + `Keys` サフィックス | `requestKeys` |
| サーバー専用ファイル | `.server.ts` サフィックス | `token.server.ts` |
| テストファイル | 同名 + `.test.tsx` / `.test.ts` | `RequestList.test.tsx` |

---

## 11. インポート順

ESLint が強制 (`pnpm lint:fix` で自動修正可能):

1. Node 組み込み / Next.js コア
2. 外部 npm パッケージ
3. `@/features/**`
4. `@/shared/**`
5. `@/external/**`
6. 相対インポート (`./`, `../`)
7. スタイルインポート (`*.css`)

---

## 12. コミット前チェックリスト

- [ ] `pnpm lint` がエラーなしで通る
- [ ] `pnpm test` が通る
- [ ] `page.tsx` を追加・削除した場合は `pnpm typegen` を実行済み
- [ ] `external/` 配下の全ファイルが `import 'server-only'` で始まっている
- [ ] Client Components は `'use client'` が最初の行にある
- [ ] 新しい Server Actions は `features/<domain>/actions/` にあり、ハンドラーのみを呼び出している
- [ ] 新しいハンドラーはサービスに委譲する前に Zod でインプットをバリデーションしている
- [ ] Auth Cookie は `features/auth/servers/token.server.ts` 経由でのみ操作している
- [ ] `app/**` のページやレイアウトにビジネスロジックがない
- [ ] テストが実装ファイルとコロケーション配置されている (`.test.tsx` / `.test.ts`)

---

## 13. 機能ドメイン一覧

| ドメインフォルダ | 説明 |
|---|---|
| `features/auth` | サインアップ、サインイン、メール確認、パスワードリセット |
| `features/account` | アカウントプロフィール読み取り |
| `features/settings` | プロフィール更新 (名前、メール、パスワード) |
| `features/requests` | リクエストの下書き、編集、提出 |
| `features/approvals` | 承認ワークフロー、決定履歴 |
| `features/notifications` | アプリ内通知、未読数 |
| `features/dashboard` | サマリーダッシュボード |

---

## 14. 主要ファイルの場所

| 内容 | パス |
|---|---|
| ルートレイアウト + CSP | `src/app/layout.tsx` |
| 認証ガードレイアウトラッパー | `src/shared/components/layout/server/AuthenticatedLayoutWrapper.tsx` |
| トークン/Cookie 管理 | `src/features/auth/servers/token.server.ts` |
| TanStack Query クライアント | `src/shared/lib/query-client.ts` |
| 認証サービス | `src/external/service/auth/AuthenticationService.ts` |
| Identity Platform クライアント | `src/external/client/gcp/identity-platform/` |
| Edge ミドルウェア | `src/middleware.ts` |
| ESLint アーキテクチャルール | `eslint-local-rules/` |
| システムガイド | `docs/README.md` |
| フロントエンドガイド | `docs/README.md` |
| コミット前チェックリスト | `docs/checklists.md` |
