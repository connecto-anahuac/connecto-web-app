# Template: `features/<domain>/components/server/<Name>PageTemplate/`

## `<Name>PageTemplate.tsx`

```tsx
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { <Name>List } from '@/features/<domain>/components/client/<Name>List'
import { <domain>Keys } from '@/features/<domain>/queries/keys'
import { ensure<Entity>ListResponse } from '@/features/<domain>/queries/<entity>List.helpers'
import { getQueryClient } from '@/shared/lib/query-client'
import { list<Entity>sServer } from '@/external/handler/<domain>/query.server'

import type { <Entity>FilterInput } from '@/features/<domain>/types'

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

## `index.ts`

```ts
export { <Name>PageTemplate } from './<Name>PageTemplate'
```

## Notes

- This is an **async Server Component** — no `'use client'`.
- Call `list<Entity>sServer` (not the action variant) here.
- The `queryKey` must exactly match what the client hook uses — that's what makes hydration work.
- If the page has **only static server data** with no client re-fetching, skip `HydrationBoundary` and pass data directly as props to a Presenter.
- For multiple prefetches (e.g. list + stats), use `Promise.all`:

```tsx
await Promise.all([
  queryClient.prefetchQuery({ queryKey: <domain>Keys.list(filters), queryFn: ... }),
  queryClient.prefetchQuery({ queryKey: <domain>Keys.summary(userId), queryFn: ... }),
])
```
