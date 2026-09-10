# Template: Container / Presenter / Hook

All three files live together in `features/<domain>/components/client/<Name>/`.

## `<Name>Container.tsx`

```tsx
'use client'

import { <Name>Presenter } from './<Name>Presenter'
import { use<Name> } from './use<Name>'

import type { <Entity>FilterInput } from '@/features/<domain>/types'

type Props = { filters: <Entity>FilterInput }

export function <Name>Container({ filters }: Props) {
  const { items, isLoading, isRefetching, errorMessage } = use<Name>({ filters })

  return (
    <<Name>Presenter
      items={items}
      isLoading={isLoading}
      isRefetching={isRefetching}
      errorMessage={errorMessage}
    />
  )
}
```

## `<Name>Presenter.tsx`

```tsx
import type { <Entity>Summary } from '@/features/<domain>/types'

type Props = {
  items: <Entity>Summary[]
  isLoading: boolean
  isRefetching: boolean
  errorMessage?: string
}

export function <Name>Presenter({ items, isLoading, errorMessage }: Props) {
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

## `use<Name>.ts`

```ts
'use client'

import { useQuery } from '@tanstack/react-query'
import { <domain>Keys } from '@/features/<domain>/queries/keys'
import { ensure<Entity>ListResponse } from '@/features/<domain>/queries/<entity>List.helpers'
import { list<Entity>sAction } from '@/external/handler/<domain>/query.action'

import type { <Entity>FilterInput } from '@/features/<domain>/types'

export function use<Name>({ filters }: { filters: <Entity>FilterInput }) {
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

## `index.ts`

```ts
export { <Name>Container as <Name> } from './<Name>Container'
```

## Notes

- `Container` must have `'use client'` (ESLint: `use-client-check`).
- `Presenter` receives **only plain props** — no hooks, no queries, no contexts.
- `Hook` returns **plain values** — never JSX.
- Test file goes alongside: `<Name>.test.tsx` (Vitest + RTL). Test the Presenter with static props; test the Hook with `renderHook`.
