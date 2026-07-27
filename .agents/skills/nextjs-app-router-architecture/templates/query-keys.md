# Template: `features/<domain>/queries/keys.ts`

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

## Notes

- Always use `as const` so keys are narrowly typed.
- The `list()` factory omits filters from the key when the filters object is empty — this prevents cache fragmentation.
- Add extra factory functions (e.g. `history`, `summary`, `pending`) as needed for the domain.
- These same keys are used in **both** `prefetchQuery` (Server Template) and `useQuery` (client hook). They must match exactly for hydration to work.
- When invalidating after a mutation, target the **minimum** set of keys that actually changed. Avoid invalidating `all` unless necessary.
