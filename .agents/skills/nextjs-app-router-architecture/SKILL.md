---
name: nextjs-app-router-architecture
description: "Implement features using the Next.js App Router layered architecture. Use when: adding a new page, feature domain, server action, client component, handler, DTO, query key, or TanStack Query hook in this project. Covers server-first data fetching, Container/Presenter/Hook pattern, external adapter layer, and ESLint-enforced import boundaries."
argument-hint: "Describe the feature to implement (e.g. 'Add a notification list page', 'Create a new approval action')"
---

# Next.js App Router Architecture Skill

Implements features in this project's layered architecture where every layer has a single, strict responsibility. Violations are caught by ESLint; CI fails on import boundary violations.

## Architecture at a Glance

```
src/
├─ app/           # Routing only — thin page/layout files
├─ features/      # Domain feature modules (auth, requests, approvals, …)
│   └─ <domain>/
│       ├─ components/server/   # Server Components (PageTemplates)
│       ├─ components/client/   # Container / Presenter / Hook
│       ├─ hooks/               # TanStack Query hooks (mutations)
│       ├─ queries/             # Query keys + DTO helpers
│       ├─ actions/             # Server Actions thin wrappers (if needed at feature level)
│       └─ types/               # Domain types & enums
├─ shared/        # Cross-domain UI, providers, layout wrappers
└─ external/      # Adapter layer — the ONLY place that touches DB / external APIs
    ├─ dto/       # Zod schemas + TypeScript types
    ├─ handler/   # Entry point called by features (query.server.ts / query.action.ts / command.action.ts)
    ├─ service/   # Business logic
    ├─ repository/# DB access (Drizzle)
    ├─ domain/    # Value objects, domain entities
    └─ client/    # External API clients (GCP, etc.)
```

See [Layer Responsibilities](./references/layer-responsibilities.md) for detailed rules and naming conventions.

## When to Use This Skill

- Adding a new page or route
- Adding a new feature domain (or extending an existing one)
- Creating a server-side data fetch with TanStack Query hydration
- Creating a client component (Container + Presenter + Hook)
- Implementing a Server Action (command)
- Adding a DTO schema and validation helper
- Setting up query keys for a new entity
- Checking ESLint import boundary rules

## Procedure for Adding a New Feature

### Step 1 — Identify the domain

Determine which domain this feature belongs to. If none fits, create a new domain folder under `features/`.

### Step 2 — Add the external layer (handler + DTO)

For **read** operations:
1. Add Zod schema + TypeScript types to `external/dto/<domain>/` → [dto-schema template](./templates/dto-schema.md)
2. Implement `external/handler/<domain>/query.server.ts` (Server Component usage) and `query.action.ts` (client hook usage) → [handler template](./templates/external-handler.md)
3. Business logic lives in `external/service/<domain>/`; DB calls in `external/repository/db/<domain>/`

For **write** operations:
1. Add input Zod schema to `external/dto/<domain>/` → [dto-schema template](./templates/dto-schema.md)
2. Implement `external/handler/<domain>/command.action.ts` (always a Server Action) → [handler template](./templates/external-handler.md)
3. Return a typed `{ success: boolean; error?: string; data?: T }` response

### Step 3 — Add DTO validation helper

Add an `ensure<Entity>Response()` function in `external/dto/<domain>/` that validates the handler response and throws on failure. See [dto-schema template](./templates/dto-schema.md).

### Step 4 — Add query keys

Create or extend `features/<domain>/queries/keys.ts` following the hierarchical key pattern. See [query-keys template](./templates/query-keys.md).

```ts
export const <domain>Keys = {
  all: ['<domain>'] as const,
  list: (filters = {}) => [...<domain>Keys.all, 'list', filters] as const,
  detail: (id: string) => [...<domain>Keys.all, 'detail', id] as const,
}
```

### Step 5 — Create the Server Component Page Template

Create `features/<domain>/components/server/<Name>PageTemplate/`:
- `<Name>PageTemplate.tsx` — async Server Component that prefetches queries and wraps with `<HydrationBoundary>`
- `index.ts` — barrel export

Template: [page-template](./templates/page-template.md)

### Step 6 — Create the Client Component (Container / Presenter / Hook)

Create `features/<domain>/components/client/<Name>/`:
- `<Name>Container.tsx` — `'use client'`, calls Hook, passes data to Presenter
- `<Name>Presenter.tsx` — pure JSX, no data-fetching logic
- `use<Name>.ts` — TanStack Query `useQuery` / `useMutation` + local state
- `<Name>.test.tsx` — Vitest + RTL unit tests
- `index.ts` — barrel export

Template: [container-presenter-hook](./templates/container-presenter-hook.md)

### Step 7 — Wire the page in `app/`

Create the page file under the correct route group:

| Route group | When | Layout wrapper |
|---|---|---|
| `(authenticated)` | Requires login | `AuthenticatedLayoutWrapper` |
| `(guest)` | Not logged in | `GuestLayoutWrapper` |
| `(neutral)` | Anyone | `NeutralLayoutWrapper` |

Keep `page.tsx` thin — extract params, pass to `<Name>PageTemplate`. See [page-file template](./templates/page-file.md).

Add metadata to the **layout**, not the page.

### Step 8 — Run validation

```bash
# Type-check generated route types
pnpm --dir frontend typegen

# Lint (catches import boundary violations)
pnpm --dir frontend lint

# Tests
pnpm --dir frontend test:run
```

---

## Key Invariants (ESLint-enforced)

| Rule | What it prevents |
|---|---|
| `restrict-service-imports` | `features/` or `app/` importing `external/service/**` directly |
| `restrict-action-imports` | Server Actions used outside `client/` hooks |
| `use-client-check` | Missing `'use client'` in client components |
| `use-server-check` | Missing `'use server'` in Server Actions |
| `require-server-only` | Server-only modules leaking to client bundles |
| `no-external-domain-imports` | Domain value objects imported from wrong layer |

See [ESLint Rules Reference](./references/eslint-rules.md) for configuration details.

---

## Quick Reference: Mutation Pattern

Mutations live in `features/<domain>/hooks/use<Action>.ts`. Always invalidate only the keys that actually changed. See [mutation-hook template](./templates/mutation-hook.md).

## Quick Reference: Static Server Data (No Hydration)

If data is server-only and never re-fetched on the client, **do not use TanStack Query**. Fetch directly in the Server Component using `Promise.all` and pass as props to a Presenter.
