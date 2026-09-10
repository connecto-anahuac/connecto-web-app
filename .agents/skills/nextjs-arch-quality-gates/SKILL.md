---
name: nextjs-arch-quality-gates
description: 'Validation rules for this architecture. Use for pnpm typegen, lint, test:run, format:check, route validation, feature validation, and change-scoped verification.'
user-invocable: false
---

# Next.js Architecture Quality Gates

## When to Use

- Deciding what to validate after a change
- Checking route or app structure changes
- Checking component, hook, handler, or external layer changes
- Reviewing minimum verification scope for a task

## Procedure

1. Read [validation matrix](./references/validation-matrix.md).
2. Choose the narrowest command set that can falsify the current change.
3. Run the first focused validation immediately after the first substantive edit.
4. Expand validation only after the first check succeeds.

## Constraints

- Do not use broad diff-only validation when a narrower executable check exists.
- Do not skip `pnpm typegen` after route changes.
- Do not skip tests for behavior that lives in hooks or client orchestration.