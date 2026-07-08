---
name: nextjs-arch-feature-slice
description: 'Feature slice rules for this architecture. Use for features/**, container presenter hook separation, feature types, local queries, feature actions, and colocated tests.'
user-invocable: false
---

# Next.js Architecture Feature Slice

## When to Use

- Creating or editing `features/**`
- Building client widgets with Container and Presenter
- Adding feature-local queries, hooks, types, or actions
- Reviewing whether UI belongs in `features/` or shared `components/`

## Procedure

1. Read [feature checklist](./references/feature-checklist.md).
2. Read [feature patterns](./references/feature-patterns.md).
3. Keep domain-specific UI in `features/<domain>/`.
4. Keep cross-app UI in `components/`.
5. Keep behavior in hooks and containers, not presenters.

## Constraints

- Presenter files must stay stateless.
- Feature code must not import service or repository layers directly.
- Tests should stay colocated with the feature slice.


# template
When props inheritance is needed, use the following template:
```tsx
import type { ComponentProps } from "react";
type Props = ComponentProps<"div"> & {
  // any value
};
```