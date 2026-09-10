# Template: Mutation Hook

Lives in `features/<domain>/hooks/use<Action>.ts`.

## `use<Action>.ts`

```ts
'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { <action>Action } from '@/external/handler/<domain>/command.action'
import { <domain>Keys } from '@/features/<domain>/queries/keys'

import type { <Action>Input } from '@/features/<domain>/types'

export function use<Action>() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: <Action>Input) => {
      const result = await <action>Action(input)
      if (!result.success) throw new Error(result.error ?? 'Action failed')
      return result.data
    },
    onSuccess: async (_data, variables) => {
      // Invalidate only the keys that actually changed
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: <domain>Keys.list() }),
        queryClient.invalidateQueries({ queryKey: <domain>Keys.detail(variables.id) }),
        // Add other affected domain keys here
      ])
    },
  })
}
```

## Usage in a Container

```tsx
'use client'

export function <Name>Container({ id }: { id: string }) {
  const { mutate, isPending, error } = use<Action>()

  return (
    <button
      onClick={() => mutate({ id })}
      disabled={isPending}
    >
      {isPending ? 'Processing…' : 'Submit'}
    </button>
  )
}
```

## Notes

- Import from `command.action.ts` (not `query.action.ts`).
- Always check `result.success` and throw on failure — TanStack Query will surface it via `error`.
- **Invalidate the minimum set of keys**: list the specific `queryKey` values that will be stale after this mutation. Never call `queryClient.invalidateQueries()` with no arguments.
- If a mutation affects multiple domains (e.g., approving a request also changes notifications), invalidate all affected domain keys in `onSuccess`.
