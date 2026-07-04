# Feature Patterns

Client widget pattern:

- `<Widget>Container.tsx` orchestrates hooks and passes flat props.
- `<Widget>Presenter.tsx` renders JSX only.
- `use<Widget>.ts` owns derived state and library hooks.

Representative current files:

- `frontend/src/features/notifications/components/client/NotificationsList/NotificationsListContainer.tsx`
- `frontend/src/features/notifications/components/client/NotificationsList/NotificationsListPresenter.tsx`
- `frontend/src/features/requests/hooks/query/useRequestListQuery.ts`

`NotificationsListContainer.tsx` excerpt:

```tsx
export function NotificationsListContainer() {
	const [activeTab, setActiveTab] = useState<TabValue>('unread')
	const {
		notifications,
		unreadNotifications,
		total,
		unreadCount,
		isLoading,
		isRefetching,
		errorMessage,
		markRead,
		isMarkingRead,
	} = useNotifications(false)

	return (
		<NotificationsListPresenter
			notifications={notifications}
			unreadNotifications={unreadNotifications}
			total={total}
			unreadCount={unreadCount}
			isLoading={isLoading}
			isRefetching={isRefetching}
			errorMessage={errorMessage}
			activeTab={activeTab}
			onTabChange={setActiveTab}
			onNotificationClick={async (notificationId) => {
				if (isMarkingRead) {
					return
				}
				await markRead({ notificationId })
			}}
		/>
	)
}
```

`NotificationsListPresenter.tsx` excerpt:

```tsx
export function NotificationsListPresenter({
	notifications,
	unreadNotifications,
	total,
	unreadCount,
	isLoading = false,
	isRefetching = false,
	errorMessage,
	activeTab,
	onTabChange,
	onNotificationClick,
}: NotificationsListPresenterProps) {
	if (errorMessage) {
		return <div className="text-destructive ...">{errorMessage}</div>
	}

	if (isLoading) {
		return <div className="text-muted-foreground ...">Loading notifications…</div>
	}

	return (
		<section className="space-y-6">
			<header className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h1 className="text-2xl font-semibold">Notifications</h1>
				</div>
			</header>
			<div className="space-y-3">
				{(activeTab === 'unread' ? unreadNotifications : notifications).map(
					(notification) => (
						<NotificationCard
							key={notification.id}
							notification={notification}
							onClick={onNotificationClick}
						/>
					)
				)}
			</div>
		</section>
	)
}
```

`useRequestListQuery.ts` excerpt:

```tsx
export const useRequestListQuery = (filters: RequestFilterInput = {}) => {
	return useQuery({
		queryKey: requestKeys.list(filters),
		queryFn: async () => {
			const fetcher = selectRequestListFetcher(filters, {
				listMine: listMyRequestsAction,
				listAssigned: listAssignedRequestsAction,
				listAll: listAllRequestsAction,
			})

			const response = await fetcher()
			return ensureRequestListResponse(response)
		},
	})
}
```