"use client"

import { cn } from '@/shared/lib/util'
import type { HTMLAttributes, ReactNode } from 'react'
import SelectMenu from '../selectMenu'
import { useSelectBox } from './hooks'

type SelectBoxUnfillProps = HTMLAttributes<HTMLSpanElement> & {
  label?: string
  icon?: ReactNode
  isMulti?: boolean
  options?: {
    label: string
    value: string
  }[]
  defaultValue?: string | string[] | null
  onValueChange?: (values: string[]) => void
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
  isMulti = false,
  options = [],
  defaultValue,
  onValueChange,
  ...props
}: SelectBoxUnfillProps) {
  const {
    isOpen,
    hoveredIndex,
    selectedLabel,
    toggleMenu,
    setHoveredIndex,
    isSelected,
    selectValue,
    containerRef,
  } = useSelectBox({
    isMulti,
    options,
    defaultValue,
    onValueChange,
  })

  // const displayLabel = selectedLabel || label
  // const hasSelection = isMulti ? selectedLabel.length > 0 : options.some((option) => isSelected(option.value))

  return (
    <div
      ref={containerRef}
      className={cn('relative inline-flex w-fit rounded-sm text-xs items-center gap-0 align-middle text-OnSurface',
     isOpen&&   "bg-Outline"
        , className)}
      {...props}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={toggleMenu}
        className="inline-flex h-4 items-center gap-0 rounded-sm pl-1  font-medium whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-connecto-muted/30"
      >
        <span>{selectedLabel}</span>
        <span className="inline-flex size-4 items-center justify-center">
          {icon ?? <SelectBoxUnfillChevron />}
        </span>
      </button>
      <SelectMenu
        isMulti={isMulti}
        isOpen={isOpen}
        options={options}
        hoveredIndex={hoveredIndex}
        selectedValues={options.filter((option) => isSelected(option.value)).map((option) => option.value)}
        onHoverItem={setHoveredIndex}
        onSelectItem={selectValue}
        className="absolute left-0 top-5 z-10"
      />
    </div>
  )
}