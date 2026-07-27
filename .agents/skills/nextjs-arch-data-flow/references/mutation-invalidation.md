# Mutation And Invalidation

- Fire mutations from hooks in `features/**/hooks/mutation`.
- Use `*.action.ts` for client-triggered server writes.
- Invalidate the smallest set of query keys that covers the changed data.
- Prefer matching the same key factory used by query hooks.

If the page is server-only and non-interactive, prefer direct server refetch over client cache complexity.

Representative current file:

- `frontend/src/features/requests/hooks/mutation/useSubmitRequestMutation.ts`

Excerpt:

```tsx
export const useSubmitRequestMutation = (requestId: string) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async () => {
			const result = await submitRequestAction({ requestId })
			if (!result.success) {
				throw new Error(result.error ?? 'Failed to submit request')
			}
			return result
		},
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: requestKeys.detail(requestId),
				}),
				queryClient.invalidateQueries({ queryKey: requestKeys.all }),
				queryClient.invalidateQueries({
					queryKey: notificationKeys.list(false),
				}),
				queryClient.invalidateQueries({
					queryKey: notificationKeys.list(true),
				}),
			])
		},
	})
}
```