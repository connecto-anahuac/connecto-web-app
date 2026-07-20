# ESLint Import Boundary Rules

All custom rules live in `frontend/eslint-local-rules/` and are loaded as a local plugin in `eslint.config.mjs`.

---

## `restrict-service-imports`

**Blocks**: Any import of `external/service/**` from outside `external/handler/**/*.command.ts` or `external/handler/**/*.query.ts`.

**Why**: Services contain business logic that must not be called directly from React components or feature modules.

**Violation example**:
```ts
// features/requests/hooks/useRequest.ts ← INVALID
import { requestService } from '@/external/service/request/requestService'
```

**Fix**: Call via `external/handler/<domain>/query.action.ts` instead.

---

## `restrict-action-imports`

**Blocks**: Importing `*.action.ts` files from anywhere other than `features/**/(client|hooks)/**` or `features/**/hooks/**`.

**Why**: Server Actions must only be called from client-side hooks, never from Server Components or other server-side code.

**Violation example**:
```ts
// features/requests/components/server/RequestsPageTemplate.tsx ← INVALID
import { listMyRequestsAction } from '@/external/handler/request/query.action'
```

**Fix**: Server Components call `query.server.ts`; client hooks call `query.action.ts`.

---

## `use-client-check`

**Enforces**: Components under `components/client/**` must have `'use client'` as the first statement.

**Violation example**:
```tsx
// features/requests/components/client/RequestList/RequestListContainer.tsx
// missing 'use client' ← INVALID
import { useRequestList } from './useRequestList'
```

---

## `use-server-check`

**Enforces**: All `*.action.ts` files must declare `'use server'`.

**Violation example**:
```ts
// external/handler/request/command.action.ts
// missing 'use server' ← INVALID
export async function createRequestAction(input) { ... }
```

---

## `require-server-only`

**Enforces**: Files under `external/handler/**/*.server.ts` and `external/service/**` must import `'server-only'` at the top.

**Why**: Prevents accidental inclusion of server-only code in the client bundle.

```ts
// external/handler/request/query.server.ts
import 'server-only'   // ← required
```

---

## `no-external-domain-imports`

**Blocks**: Importing from `external/domain/**` outside of the `external/` layer itself.

**Why**: Value objects are internal details of the adapter layer.

---

## `use-nextjs-helpers`

**Enforces**:
- Use `PageProps<'/path'>` and `LayoutProps<'/path'>` from `@/shared/types/next` instead of raw `{ params, searchParams }` types.
- Use `next/navigation` hooks (e.g., `useRouter`) instead of direct window manipulation.

---

## Adding a New ESLint Rule

1. Create `frontend/eslint-local-rules/<rule-name>.js`
2. Register it in `frontend/eslint-local-rules/index.js`:
   ```js
   module.exports = {
     rules: {
       // ...existing rules...
       '<rule-name>': require('./<rule-name>'),
     },
   }
   ```
3. Enable it in `frontend/eslint.config.mjs` under the local-rules plugin section.
4. Run `pnpm --dir frontend lint` to verify.

---

## CI Integration

Lint runs in CI via `.github/workflows/`. A PR with import boundary violations will fail before merge.

To check locally before pushing:
```bash
pnpm --dir frontend lint
pnpm --dir frontend typecheck   # if available
pnpm --dir frontend test:run
```
