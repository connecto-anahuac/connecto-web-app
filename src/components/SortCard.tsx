import { cn } from '@/shared/lib/util'
import Divider from '@/components/Divider'

import SortCardFieldChip from './SortCardFieldChip'
import SortCardSortBadge from './SortCardSortBadge'

type SortCardProps = {
  fieldLabel: string
  className?: string
}

function DragHandleIcon() {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className="size-3 text-connecto-muted"
    >
      <circle cx="3" cy="2.5" r="0.75" fill="currentColor" />
      <circle cx="3" cy="6" r="0.75" fill="currentColor" />
      <circle cx="3" cy="9.5" r="0.75" fill="currentColor" />
      <circle cx="9" cy="2.5" r="0.75" fill="currentColor" />
      <circle cx="9" cy="6" r="0.75" fill="currentColor" />
      <circle cx="9" cy="9.5" r="0.75" fill="currentColor" />
    </svg>
  )
}

function CloseSmallIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="size-4 text-connecto-muted"
    >
      <path
        d="M4.47 4.47L11.53 11.53M11.53 4.47L4.47 11.53"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function SortCard({ fieldLabel, className }: SortCardProps) {
  return (
    <div
      className={cn(
        'inline-flex h-12 w-[260px] items-center gap-2.5 rounded-md bg-background px-2 py-3 text-sm font-medium text-connecto-ink',
        className,
      )}
    >
      <button
        type="button"
        aria-label="Reorder sort rule"
        className="inline-flex size-4 shrink-0 items-center justify-center rounded-sm text-connecto-muted transition-colors hover:bg-connecto-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-connecto-muted/30"
      >
        <DragHandleIcon />
      </button>

      <SortCardSortBadge />
      <SortCardFieldChip label={fieldLabel} />

      <Divider direction="horizontal" className="h-px min-w-0 flex-1 self-center" />

      <button
        type="button"
        aria-label="Remove sort rule"
        className="inline-flex size-4 shrink-0 items-center justify-center rounded-sm text-connecto-muted transition-colors hover:bg-connecto-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-connecto-muted/30"
      >
        <CloseSmallIcon />
      </button>
    </div>
  )
}