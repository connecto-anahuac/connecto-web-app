# Template: `external/handler/<domain>/`

Three files per domain. All must be in `external/handler/<domain>/`.

## `query.server.ts` — called by Server Components

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

## `query.action.ts` — called by client hooks (`useQuery`)

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

## `command.action.ts` — called by client mutations (`useMutation`)

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

## Notes

- `query.server.ts` must start with `import 'server-only'` (ESLint: `require-server-only`).
- `query.action.ts` and `command.action.ts` must start with `'use server'` (ESLint: `use-server-check`).
- Handler is the **only** layer allowed to import from `external/service/**` (ESLint: `restrict-service-imports`).
- Always return a typed discriminated union `{ success: true, ... } | { success: false, error: string }`.
