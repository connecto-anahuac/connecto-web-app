# Route Examples

Representative current files:

- `frontend/src/app/(authenticated)/requests/page.tsx`
- `frontend/src/app/(authenticated)/layout.tsx`

`page.tsx` excerpt:

```tsx
export default async function RequestsPage(props: PageProps<'/requests'>) {
	const { status } = await props.searchParams
	const rawStatus = Array.isArray(status) ? status[0] : status

	const filters: RequestFilterInput = {}
	let activeTabKey: RequestsStatusTabKey = RequestStatus.DRAFT

	const upperStatus = rawStatus?.toUpperCase()

	if (!upperStatus) {
		filters.status = RequestStatus.DRAFT
		activeTabKey = RequestStatus.DRAFT
	} else if (upperStatus === 'ALL') {
		activeTabKey = 'ALL'
	} else {
		const statusFilter = normalizeStatus(upperStatus)
		if (statusFilter) {
			filters.status = statusFilter
			activeTabKey = statusFilter
		} else {
			filters.status = RequestStatus.DRAFT
			activeTabKey = RequestStatus.DRAFT
		}
	}

	return <RequestsPageTemplate filters={filters} activeTabKey={activeTabKey} />
}
```

`layout.tsx` excerpt:

```tsx
export const metadata: Metadata = {
	title: 'Dashboard | Request & Approval System',
	description:
		'Workspace for authenticated users to review requests, approvals, and recent activity.',
}

export const dynamic = 'force-dynamic'

export default function AuthenticatedLayout(props: LayoutProps<'/'>) {
	return (
		<AuthenticatedLayoutWrapper>{props.children}</AuthenticatedLayoutWrapper>
	)
}
```

Expected pattern:

- `page.tsx` performs only parameter normalization that is needed to call the feature server template.
- `layout.tsx` owns metadata and layout chrome, not feature-level fetching.