# Route Checklist

- Pick the correct route group: `(authenticated)`, `(guest)`, or `(neutral)`.
- Add `layout.tsx` with `metadata` and `LayoutProps<'/path'>`.
- Add `page.tsx` with `PageProps<'/path'>`.
- Await `props.params` and `props.searchParams`.
- Delegate rendering to `features/<domain>/components/server/<Page>/<Page>Template.tsx`.
- Add `loading.tsx` or `error.tsx` when route-level async or failure handling is needed.
- Run `pnpm typegen` after changing route files.