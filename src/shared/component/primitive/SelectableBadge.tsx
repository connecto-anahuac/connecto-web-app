import { cn } from '@/shared/lib/util'
import type { HTMLAttributes, MouseEvent } from 'react'

interface SelectableBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  label: string
  selected?: boolean
  removable?: boolean
  removeLabel?: string
  onRemove?: (event: MouseEvent<HTMLButtonElement>) => void
}

export default function SelectableBadge({
  label,
  selected = false,
  removable = selected,
  removeLabel,
  onRemove,
  className,
  ...props
}: SelectableBadgeProps) {
  const showRemove = selected && removable

  return (
    <span
      className={cn(
        'inline-flex h-5 w-fit items-center rounded-full px-2 py-1 text-xs leading-none font-medium',
        selected
          ? 'gap-1 bg-connecto-muted-panel text-connecto-ink'
          : 'border border-connecto-divider bg-transparent text-connecto-muted',
        className,
      )}
      {...props}
    >
      <span>{label}</span>
      {showRemove ? (
        <button
          type="button"
          aria-label={removeLabel ?? `Remove ${label}`}
          className="flex h-3 w-3 items-center justify-center rounded-full bg-neutral-400 text-white"
          onClick={onRemove}
        >
          <svg
            viewBox="0 0 12 12"
            aria-hidden="true"
            className="h-2.5 w-2.5"
            fill="none"
          >
            <path
              d="M3 3L9 9M9 3L3 9"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
            />
          </svg>
        </button>
      ) : null}
    </span>
  )
}