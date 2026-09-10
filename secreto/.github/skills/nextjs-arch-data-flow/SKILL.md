---
name: nextjs-arch-data-flow
description: 'Data fetching and mutation rules for this architecture. Use for TanStack Query, HydrationBoundary, server prefetch, query keys, invalidation, server-first fetching, and mutation flow.'
user-invocable: false
---

# Next.js Architecture Data Flow

## When to Use

- Editing prefetch logic in server templates
- Editing TanStack Query hooks
- Choosing between server-only fetches and hydration
- Designing query invalidation after mutations

## Procedure

1. Read [server prefetch](./references/server-prefetch.md).
2. Read [mutation and invalidation](./references/mutation-invalidation.md).
3. Use shared query keys across server prefetch and client hooks.
4. Validate DTOs before values reach presenters.
5. Skip hydration for static server-only views.

## Constraints

- Do not hydrate when server-only rendering is enough.
- Do not invent separate query keys for the same dataset.
- Do not return unvalidated handler responses to UI.