import { cn } from '@/shared/lib/util'
import type { HTMLAttributes, ReactNode } from 'react'

type SelectBoxUnfillProps = HTMLAttributes<HTMLSpanElement> & {
  label?: string
  icon?: ReactNode
}

function SelectBoxUnfillChevron() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="size-4 shrink-0 text-connecto-muted-strong"
    >
      <path
        d="M4.46967 6.46967C4.76256 6.17678 5.23744 6.17678 5.53033 6.46967L8 8.93934L10.4697 6.46967C10.7626 6.17678 11.2374 6.17678 11.5303 6.46967C11.8232 6.76256 11.8232 7.23744 11.5303 7.53033L8.53033 10.5303C8.23744 10.8232 7.76256 10.8232 7.46967 10.5303L4.46967 7.53033C4.17678 7.23744 4.17678 6.76256 4.46967 6.46967Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function SelectBoxUnfill({
  label = 'contiene',
  icon,
  className,
  ...props
}: SelectBoxUnfillProps) {
  return (
    <span
      className={cn('inline-flex w-fit items-center gap-px align-middle', className)}
      {...props}
    >
      <span className="rounded-select-box-unfill h-17px inline-flex items-center px-0.75 text-xs leading-none font-medium whitespace-nowrap text-connecto-muted-strong">
        {label}
      </span>
      <span className="inline-flex size-4 items-center justify-center text-connecto-muted-strong">
        {icon ?? <SelectBoxUnfillChevron />}
      </span>
    </span>
  )
}