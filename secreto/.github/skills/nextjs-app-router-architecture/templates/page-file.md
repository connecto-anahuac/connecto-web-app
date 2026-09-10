# Template: `app/` Page & Layout Files

## `page.tsx`

```tsx
// app/(authenticated)/<domain>/[id]/page.tsx
import { <Name>PageTemplate } from '@/features/<domain>/components/server/<Name>PageTemplate'
import type { PageProps } from '@/shared/types/next'

export default async function <Name>Page(
  props: PageProps<'/<domain>/[id]'>
) {
  const { id } = await props.params
  const searchParams = await props.searchParams

  return <Name>PageTemplate id={id} searchParams={searchParams} />
}
```

## `layout.tsx`

```tsx
// app/(authenticated)/<domain>/layout.tsx
import type { LayoutProps } from '@/shared/types/next'

export const metadata = {
  title: '<Page Title> | App Name',
  description: 'Short description for SEO.',
}

export default function <Domain>Layout({ children }: LayoutProps<'/'>) {
  return <>{children}</>
}
```

## Notes

- Always `await props.params` and `await props.searchParams` — Next.js requires it in App Router.
- Use `PageProps<'/path'>` and `LayoutProps<'/path'>` from `@/shared/types/next` (enforced by `use-nextjs-helpers` ESLint rule).
- Put `metadata` in `layout.tsx`, not `page.tsx`, so it is inherited by nested routes.
- Place the page under the correct route group:

| Route group | When |
|---|---|
| `(authenticated)` | Requires login |
| `(guest)` | Not logged in |
| `(neutral)` | Anyone |
