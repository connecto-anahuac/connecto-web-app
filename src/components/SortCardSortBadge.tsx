import { cn } from '@/shared/lib/util'

type SortCardSortBadgeProps = {
  className?: string
}

function SortDirectionIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="size-4 text-connecto-muted"
    >
      <path
        d="M4.5 11.25L4.5 4.75M4.5 4.75L2.75 6.5M4.5 4.75L6.25 6.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.75 5H12.25M8.75 8H11M8.75 11H9.75"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function SortCardSortBadge({ className }: SortCardSortBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex size-6 shrink-0 items-center justify-center rounded-sm bg-connecto-muted-panel text-connecto-muted',
        className,
      )}
    >
      <SortDirectionIcon />
    </span>
  )
}