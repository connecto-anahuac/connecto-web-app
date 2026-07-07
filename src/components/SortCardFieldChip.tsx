import { cn } from '@/shared/lib/util'

type SortCardFieldChipProps = {
  label: string
  className?: string
}

function FieldTypeIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="size-4 text-connecto-muted"
    >
      <path
        d="M4 4.75C4 4.34 4.34 4 4.75 4H11.25C11.66 4 12 4.34 12 4.75C12 5.16 11.66 5.5 11.25 5.5H8.72V11.25C8.72 11.66 8.38 12 7.97 12C7.56 12 7.22 11.66 7.22 11.25V5.5H4.75C4.34 5.5 4 5.16 4 4.75Z"
        fill="currentColor"
      />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="size-4 rotate-180 text-connecto-muted"
    >
      <path
        d="M4.47 9.53L8 6L11.53 9.53"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function SortCardFieldChip({
  label,
  className,
}: SortCardFieldChipProps) {
  return (
    <button
      type="button"
      aria-label={`Sort field: ${label}`}
      className={cn(
        'inline-flex h-6 shrink-0 items-stretch rounded bg-connecto-muted-panel text-sm font-medium text-connecto-ink',
        className,
      )}
    >
      <span className="inline-flex items-center gap-1 rounded-l-[4px] rounded-r-[2px] px-1.5">
        <FieldTypeIcon />
        <span className="leading-none whitespace-nowrap">{label}</span>
      </span>
      <span className="inline-flex w-5 items-center justify-center rounded-l-[2px] rounded-r-[4px] border-l border-connecto-divider">
        <ChevronIcon />
      </span>
    </button>
  )
}