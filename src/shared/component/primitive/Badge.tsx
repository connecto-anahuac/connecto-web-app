import { cn } from '@/shared/lib/util'

interface Props {
  value: string
  className?: string
}

export default function Badge({ value, className = '' }: Props) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center rounded-xl bg-connecto-muted-panel px-2 py-1 text-xs leading-none font-medium text-foreground',
        className,
      )}
    >
      {value}
    </span>
  )
}
