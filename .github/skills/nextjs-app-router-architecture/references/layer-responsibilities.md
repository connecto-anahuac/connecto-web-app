# Layer Responsibilities

## `app/` — Routing Only

**Rule: Keep it thin.** No data fetching, no business logic, no direct imports from `external/`.

| File | Responsibility |
|---|---|
| `page.tsx` | Extract `params` / `searchParams` (always `await` them), delegate to `features/.../server/<Name>PageTemplate` |
| `layout.tsx` | Declare `metadata`, render the route-group layout wrapper from `shared/` |
| `loading.tsx` | Streaming skeleton for the route |
| `error.tsx` | Error boundary for the route |

```
app/(authenticated)/requests/[requestId]/
├─ page.tsx          ← thin, only extracts params
├─ layout.tsx        ← metadata + AuthenticatedLayout
├─ loading.tsx
└─ error.tsx
```

**Naming**: Route group folders use parentheses `(authenticated)`. Dynamic segments use brackets `[requestId]`.

---

## `features/<domain>/` — Domain Feature Module

Each domain owns its own components, hooks, queries, and types. **Features never import from other features** (use `shared/` for cross-cutting concerns).

### `components/server/`

Async Server Components only. Named `<Name>PageTemplate`.

- Prefetches TanStack Query data via `getQueryClient().prefetchQuery()`
- Wraps children in `<HydrationBoundary state={dehydrate(queryClient)}>`
- Calls `external/handler/<domain>/query.server.ts`
- Does NOT import from `external/service/` or `external/repository/`

### `components/client/`

Client-side React components. Each widget is a folder:

```
<Name>/
├─ <Name>Container.tsx    # 'use client' — wires hook → presenter
├─ <Name>Presenter.tsx    # Pure JSX, receives everything via props
├─ use<Name>.ts           # TanStack Query + local state
├─ <Name>.test.tsx        # Vitest + RTL
└─ index.ts
```

**Container**: Calls hook, passes data as props to Presenter. No JSX logic beyond the Presenter call.  
**Presenter**: Only renders what it receives. No `useQuery`, no `useState` (unless purely cosmetic).  
**Hook**: All data fetching, mutations, and derived state. Returns plain values — never JSX.

### `hooks/`

Mutation hooks (`use<Action>.ts`) that are shared across multiple components within the domain. Import `external/handler/<domain>/command.action.ts`.

### `queries/`

| File | Content |
|---|---|
| `keys.ts` | Hierarchical query key factory |
| `<entity>.helpers.ts` | `ensure<Entity>Response()` re-export + `select<Entity>Fetcher()` helpers |

### `types/`

Domain-local TypeScript types and enums. Do **not** put Zod schemas here (those live in `external/dto/`).

---

## `shared/` — Cross-Domain Utilities

| Subfolder | Content |
|---|---|
| `components/layout/server/` | `AuthenticatedLayoutWrapper`, `GuestLayoutWrapper`, `NeutralLayoutWrapper` |
| `components/` | Reusable UI components (buttons, modals, etc.) |
| `lib/` | `getQueryClient()`, auth helpers |
| `providers/` | React context providers |
| `types/` | `PageProps<T>`, `LayoutProps<T>`, global shared types |

---

## `external/` — Adapter Layer

The **only** layer that communicates with DB, external APIs, or other I/O. Features access it exclusively via `handler/`.

### `handler/<domain>/`

The entry point that features call. Always `'use server'` or `'server-only'`.

| File | Used by | Directive |
|---|---|---|
| `query.server.ts` | Server Components (PageTemplate) | `import 'server-only'` |
| `query.action.ts` | Client hooks (useQuery) | `'use server'` |
| `command.action.ts` | Client mutations (useMutation) | `'use server'` |
| `shared.ts` | Internal to handler | — |

Handler responsibilities: input validation (Zod), auth check, call service, error handling, response formatting.

### `service/<domain>/`

Business logic. Called only by handlers. May call multiple repositories or other services.

### `repository/db/<domain>/`

DB access via Drizzle ORM. Called only by services.

### `dto/<domain>/`

Zod schemas and TypeScript types for handler inputs/outputs. Also contains `ensure<Entity>Response()` validation helpers.

### `domain/`

Value objects (e.g., `RequestId`, `AccountId`). Immutable, no side effects.

### `client/`

External API clients (GCP Storage, etc.). Called only by services.

---

## Import Direction (strictly enforced)

```
app → features → shared
               ↓
            external/handler
               ↓
            external/service
               ↓
            external/repository
               ↓
            external/client (DB, APIs)
```

**Forbidden**:
- `features/` → `external/service/` (must go via `handler/`)
- `features/` → `external/repository/` (must go via `service/`)
- Client components importing `server-only` modules
- `app/` importing directly from `external/`
