import { cn } from "@/shared/lib/util"
import type { ButtonHTMLAttributes, InputHTMLAttributes } from "react"

type SearchToolProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
	className?: string
	inputWrapperClassName?: string
	inputClassName?: string
	filterButtonAriaLabel?: string
	filterButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "onClick" | "children" | "aria-label">
	onFilterClick?: () => void
}

function SearchIcon() {
	return (
		<svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-5 shrink-0">
			<circle cx="9" cy="9" r="5.75" stroke="currentColor" strokeWidth="1.5" />
			<path d="M13.2 13.2L16.5 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
		</svg>
	)
}

function FilterIcon() {
	return (
		<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-6 shrink-0">
			<path
				d="M4 7H10M14 7H20M8 12H20M4 12H4.5M4 17H13M17 17H20"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
			/>
			<circle cx="12" cy="7" r="1.75" stroke="currentColor" strokeWidth="1.8" />
			<circle cx="6.5" cy="12" r="1.75" stroke="currentColor" strokeWidth="1.8" />
			<circle cx="15" cy="17" r="1.75" stroke="currentColor" strokeWidth="1.8" />
		</svg>
	)
}

export default function SearchTool({
	className,
	inputWrapperClassName,
	inputClassName,
	filterButtonAriaLabel = "Open search filters",
	filterButtonProps,
	onFilterClick,
	placeholder = "buscar por nombre, id,estatus,...",
	type = "search",
	disabled,
	...inputProps
}: SearchToolProps) {
	return (
		<div className={cn("search-tool-w flex items-center gap-3", className)}>
			<label
				className={cn(
					"flex-1 py-1.5 pl-3.5 pr-4.5 flex h-8 items-center gap-3.5 rounded-full border-2 border-connecto-divider bg-connecto-muted-panel",
					disabled && "opacity-60",
					inputWrapperClassName,
				)}
			>
				<span className="text-connecto-muted" aria-hidden="true">
					<SearchIcon />
				</span>
				<input
					{...inputProps}
					type={type}
					disabled={disabled}
					placeholder={placeholder}
					aria-label={inputProps["aria-label"] ?? placeholder}
					className={cn(
						"min-w-0 flex-1 bg-transparent text-[12px] font-semibold leading-none text-connecto-ink outline-none placeholder:text-header-on-container-variant",
						disabled && "cursor-not-allowed",
						inputClassName,
					)}
				/>
			</label>

			<button
				{...filterButtonProps}
				type="button"
				aria-label={filterButtonAriaLabel}
				onClick={onFilterClick}
				disabled={disabled || filterButtonProps?.disabled}
				className={cn(
					"flex size-7 items-center justify-center text-connecto-ink transition-colors hover:text-connecto-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-connecto-muted/30 disabled:cursor-not-allowed disabled:opacity-60",
					filterButtonProps?.className,
				)}
			>
				<FilterIcon />
			</button>
		</div>
	)
}
