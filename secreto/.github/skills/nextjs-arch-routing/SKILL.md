---
name: nextjs-arch-routing
description: 'Routing rules for this Next.js architecture. Use for page.tsx, layout.tsx, route groups, loading.tsx, error.tsx, PageProps, LayoutProps, metadata, and typegen.'
user-invocable: false
---

# Next.js Architecture Routing

## When to Use

- Adding or editing `app/**/page.tsx`
- Adding or editing `app/**/layout.tsx`
- Working with `(authenticated)`, `(guest)`, `(neutral)` route groups
- Adding `loading.tsx` or `error.tsx`
- Fixing typed route usage or `pnpm typegen` issues

## Procedure

1. Read [source priority](./references/source-priority.md).
2. Read [route checklist](./references/route-checklist.md).
3. If needed, read [route examples](./references/route-examples.md).
4. Keep `app/` thin and delegate rendering to feature server templates.
5. After edits, run the routing validation from the quality gate skill.

## Constraints

- Do not put business logic in `app/`.
- Do not skip `PageProps<'/path'>` or `LayoutProps<'/path'>`.
- Do not forget `pnpm typegen` after route surface changes.