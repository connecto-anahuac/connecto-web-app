---
name: nextjs-arch-external-layer
description: 'External layer rules for this architecture. Use for external/dto, external/handler, external/service, external/repository, server-only boundaries, DTO validation, and handler entry points.'
user-invocable: false
---

# Next.js Architecture External Layer

## When to Use

- Editing `external/dto/**`
- Editing handlers, services, or repositories
- Fixing architecture violations across the server boundary
- Designing new DTO, handler, service, repository flows

## Procedure

1. Read [boundary rules](./references/boundary-rules.md).
2. Read [implementation order](./references/implementation-order.md).
3. Add DTOs before wiring handlers and hooks.
4. Keep handlers as the only public entry point to `external/`.
5. Keep business rules in services and persistence in repositories.

## Constraints

- `features/` must not import `external/service` or `external/repository`.
- Server-only files must stay server-only.
- DTO boundaries must be explicit and validated.