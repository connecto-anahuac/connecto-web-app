# Template: `external/dto/<domain>/`

## `schemas.ts` — Zod schemas + TypeScript types

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

## `ensure<Entity>Response.ts` — validation helper

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

## Notes

- Zod schemas validate handler **inputs**; `ensure*Response` validates handler **outputs**.
- `ensure*Response` throws on failure — TanStack Query will catch this and expose it via `error`.
- Export everything from `external/dto/<domain>/index.ts` for clean imports.
