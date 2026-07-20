# Code Templates

## `app/` — Page File {#page-file}

```tsx
// app/(authenticated)/<domain>/[id]/page.tsx
import { <Name>PageTemplate } from '@/features/<domain>/components/server/<Name>PageTemplate'
import type { PageProps } from '@/shared/types/next'

export default async function <Name>Page(
  props: PageProps<'/<domain>/[id]'>
) {
  const { id } = await props.params
  const searchParams = await props.searchParams

  return <Name>PageTemplate id={id} searchParams={searchParams} />
}
```

```tsx
// app/(authenticated)/<domain>/layout.tsx
import type { LayoutProps } from '@/shared/types/next'

export const metadata = {
  title: '<Page Title> | App Name',
  description: 'Short description for SEO.',
}

export default function <Domain>Layout({ children }: LayoutProps<'/'>) {
  return <>{children}</>
}
```

---

## `external/handler/<domain>/query.server.ts` {#external-handler}

```ts
import 'server-only'

import { ZodError } from 'zod'
import { getSessionServer } from '@/features/auth/servers/session.server'
import { <entity>ListSchema } from '@/external/dto/<domain>'
import { <domain>Service } from './shared'

import type { <Entity>ListInput, <Entity>ListResponse } from '@/external/dto/<domain>'

async function requireSessionAccount() {
  const session = await getSessionServer()
  if (!session?.account) throw new Error('Unauthorized')
  return session.account
}

export async function list<Entity>sServer(
  params?: <Entity>ListInput
): Promise<<Entity>ListResponse> {
  try {
    const account = await requireSessionAccount()
    const validated = <entity>ListSchema.parse(params ?? {})
    const items = await <domain>Service.listFor(account.id, validated)
    return { success: true, items, total: items.length }
  } catch (err) {
    if (err instanceof ZodError) return { success: false, error: 'Invalid input' }
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}
```

---

## `external/handler/<domain>/query.action.ts`

```ts
'use server'

import { list<Entity>sServer } from './query.server'
import type { <Entity>ListInput, <Entity>ListResponse } from '@/external/dto/<domain>'

export async function list<Entity>sAction(
  params?: <Entity>ListInput
): Promise<<Entity>ListResponse> {
  return list<Entity>sServer(params)
}
```

---

## `external/handler/<domain>/command.action.ts`

```ts
'use server'

import { ZodError } from 'zod'
import { getSessionServer } from '@/features/auth/servers/session.server'
import { create<Entity>Schema } from '@/external/dto/<domain>'
import { <domain>Service } from './shared'

import type { Create<Entity>Input } from '@/external/dto/<domain>'

type CommandResult<T = void> = { success: true; data?: T } | { success: false; error: string }

export async function create<Entity>Action(
  input: Create<Entity>Input
): Promise<CommandResult<{ id: string }>> {
  try {
    const session = await getSessionServer()
    if (!session?.account) return { success: false, error: 'Unauthorized' }

    const validated = create<Entity>Schema.parse(input)
    const result = await <domain>Service.create(session.account.id, validated)
    return { success: true, data: { id: result.id } }
  } catch (err) {
    if (err instanceof ZodError) return { success: false, error: 'Validation failed' }
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}
```

---

## `external/dto/<domain>/` — DTO Schema & Types {#dto-helper}

```ts
// external/dto/<domain>/schemas.ts
import { z } from 'zod'

export const <entity>ListSchema = z.object({
  limit: z.number().int().positive().default(20),
  offset: z.number().int().nonnegative().default(0),
})

export type <Entity>ListInput = z.input<typeof <entity>ListSchema>

export type <Entity>ListResponse =
  | { success: true; items: <Entity>Dto[]; total: number }
  | { success: false; error: string }

export type <Entity>ListResult = {
  items: <Entity>Dto[]
  total: number
  limit: number
  offset: number
}
```

```ts
// external/dto/<domain>/ensure<Entity>Response.ts
import type { <Entity>ListResponse, <Entity>ListResult } from './schemas'

const DEFAULT_LIMIT = 20

export function ensure<Entity>ListResponse(
  response: <Entity>ListResponse
): <Entity>ListResult {
  if (!response.success) {
    throw new Error(response.error ?? 'Failed to load <entity>s')
  }
  return {
    items: response.items,
    total: response.total,
    limit: DEFAULT_LIMIT,
    offset: 0,
  }
}
```

---

## `features/<domain>/queries/keys.ts`

```ts
import type { <Entity>FilterInput } from '@/features/<domain>/types'

export const <domain>Keys = {
  all: ['<domain>'] as const,
  list: (filters: <Entity>FilterInput = {}) =>
    Object.keys(filters).length > 0
      ? ([...<domain>Keys.all, 'list', filters] as const)
      : ([...<domain>Keys.all, 'list'] as const),
  detail: (id: string) => [...<domain>Keys.all, 'detail', id] as const,
}
```

---

## `features/<domain>/components/server/<Name>PageTemplate` {#page-template}

```tsx
// features/<domain>/components/server/<Name>PageTemplate/<Name>PageTemplate.tsx
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { <Name>List } from '@/features/<domain>/components/client/<Name>List'
import { <domain>Keys } from '@/features/<domain>/queries/keys'
import { ensure<Entity>ListResponse } from '@/features/<domain>/queries/<entity>List.helpers'
import { getQueryClient } from '@/shared/lib/query-client'
import { list<Entity>sServer } from '@/external/handler/<domain>/query.server'

type <Name>PageTemplateProps = {
  filters?: <Entity>FilterInput
}

export async function <Name>PageTemplate({ filters = {} }: <Name>PageTemplateProps) {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: <domain>Keys.list(filters),
    queryFn: async () => {
      const response = await list<Entity>sServer(filters)
      return ensure<Entity>ListResponse(response)
    },
  })

  return (
    <section className="space-y-6 px-6 py-8">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <<Name>List filters={filters} />
      </HydrationBoundary>
    </section>
  )
}
```

```ts
// features/<domain>/components/server/<Name>PageTemplate/index.ts
export { <Name>PageTemplate } from './<Name>PageTemplate'
```

---

## `features/<domain>/components/client/<Name>List/` {#container-presenter-hook}

### Container

```tsx
// <Name>ListContainer.tsx
'use client'

import { <Name>ListPresenter } from './<Name>ListPresenter'
import { use<Name>List } from './use<Name>List'

import type { <Entity>FilterInput } from '@/features/<domain>/types'

type Props = { filters: <Entity>FilterInput }

export function <Name>ListContainer({ filters }: Props) {
  const { items, isLoading, isRefetching, errorMessage } = use<Name>List({ filters })

  return (
    <<Name>ListPresenter
      items={items}
      isLoading={isLoading}
      isRefetching={isRefetching}
      errorMessage={errorMessage}
    />
  )
}
```

### Presenter

```tsx
// <Name>ListPresenter.tsx
import type { <Entity>Summary } from '@/features/<domain>/types'

type Props = {
  items: <Entity>Summary[]
  isLoading: boolean
  isRefetching: boolean
  errorMessage?: string
}

export function <Name>ListPresenter({ items, isLoading, errorMessage }: Props) {
  if (isLoading) return <p>Loading…</p>
  if (errorMessage) return <p className="text-destructive">{errorMessage}</p>
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.title}</li>
      ))}
    </ul>
  )
}
```

### Hook

```ts
// use<Name>List.ts
'use client'

import { useQuery } from '@tanstack/react-query'
import { <domain>Keys } from '@/features/<domain>/queries/keys'
import { ensure<Entity>ListResponse } from '@/features/<domain>/queries/<entity>List.helpers'
import { list<Entity>sAction } from '@/external/handler/<domain>/query.action'

import type { <Entity>FilterInput } from '@/features/<domain>/types'

export function use<Name>List({ filters }: { filters: <Entity>FilterInput }) {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: <domain>Keys.list(filters),
    queryFn: async () => {
      const response = await list<Entity>sAction(filters)
      return ensure<Entity>ListResponse(response)
    },
  })

  return {
    items: data?.items ?? [],
    isLoading,
    isRefetching: isFetching && !isLoading,
    errorMessage: error instanceof Error ? error.message : undefined,
  }
}
```

### Barrel

```ts
// index.ts
export { <Name>ListContainer as <Name>List } from './<Name>ListContainer'
```

---

## Mutation Hook {#mutation-hook}

```ts
// features/<domain>/hooks/use<Action>.ts
'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { <action>Action } from '@/external/handler/<domain>/command.action'
import { <domain>Keys } from '@/features/<domain>/queries/keys'

export function use<Action>() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: <Action>Input) => {
      const result = await <action>Action(input)
      if (!result.success) throw new Error(result.error ?? 'Action failed')
      return result.data
    },
    onSuccess: async (_data, variables) => {
      // Invalidate only affected keys
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: <domain>Keys.all }),
        // Add other affected keys here
      ])
    },
  })
}
```
