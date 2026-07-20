# Server Prefetch

Use server templates to warm TanStack Query cache when the client needs immediate interactive state.

Flow:

1. Create or reuse a query key.
2. Prefetch in the server template with `getQueryClient()`.
3. Validate the server response with DTO helpers.
4. Wrap the client component with `HydrationBoundary`.

Representative current file:

- `frontend/src/features/requests/components/server/RequestsPageTemplate/RequestsPageTemplate.tsx`

Excerpt:

```tsx
export async function RequestsPageTemplate({
	filters = {},
	activeTabKey,
}: RequestsPageTemplateProps) {
	const queryClient = getQueryClient()
	await queryClient.prefetchQuery({
		queryKey: requestKeys.list(filters),
		queryFn: async () => {
			const fetcher = selectRequestListFetcher(filters, {
				listMine: listMyRequestsServer,
				listAssigned: listAssignedRequestsServer,
				listAll: listAllRequestsServer,
			})

			const response = await fetcher()
			return ensureRequestListResponse(response)
		},
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<RequestList filters={filters} />
		</HydrationBoundary>
	)
}
```