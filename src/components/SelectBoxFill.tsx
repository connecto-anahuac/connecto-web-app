import type { ReactNode } from 'react'

import Arrow from '@/components/icon/Arrow'
import { cn } from '@/shared/lib/util'

type SelectBoxFillSize = 'small' | 'middle'

interface SelectBoxFillProps {
  value: string
  size?: SelectBoxFillSize
  leadingIcon?: ReactNode
  className?: string
  labelClassName?: string
  triggerClassName?: string
}

const sizeStyles: Record<
  SelectBoxFillSize,
  {
    container: string
    label: string
    icon: string
    chevron: string
  }
> = {
  small: {
    container: 'h-[22px]',
    label: 'text-[12px] font-normal',
    icon: 'size-3',
    chevron: 'size-4',
  },
  middle: {
    container: 'h-[24px]',
    label: 'text-sm font-medium',
    icon: 'size-3',
    chevron: 'size-4',
  },
}

export default function SelectBoxFill({
  value,
  size = 'small',
  leadingIcon,
  className,
  labelClassName,
  triggerClassName,
}: SelectBoxFillProps) {
  const styles = sizeStyles[size]

  return (
    <div
      className={cn(
        'inline-flex items-center gap-[1px] text-connecto-select-ink',
        styles.container,
        className,
      )}
    >
      <div
        className={cn(
          'inline-flex h-full items-center rounded-select-fill-left bg-connecto-select-fill',
          leadingIcon ? 'gap-[3px] pl-4px pr-7px py-5px' : 'px-7px',
        )}
      >
        {leadingIcon ? (
          <span className={cn('inline-flex shrink-0 items-center justify-center', styles.icon)}>
            {leadingIcon}
          </span>
        ) : null}
        <span className={cn('leading-none whitespace-nowrap', styles.label, labelClassName)}>{value}</span>
      </div>

      <button
        type="button"
        aria-label={`${value} options`}
        className={cn(
          'inline-flex h-full w-[22px] items-center justify-center rounded-select-fill-right bg-connecto-select-fill px-3px text-connecto-select-ink',
          triggerClassName,
        )}
      >
        <Arrow className={styles.chevron} direction="down" />
      </button>
    </div>
  )
}