import { cn } from "@/shared/lib/util"
import type { ButtonHTMLAttributes, InputHTMLAttributes } from "react"
import SearchIcon from "../../../components/icon/SearchIcon"
import FilterIcon from "../../../components/icon/FilterIcon"
import ToolOutlineIcon from "../../../components/icon/ToolOutlineIcon"

type SearchToolProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
	className?: string
	inputWrapperClassName?: string
	inputClassName?: string
	filterButtonAriaLabel?: string
	filterButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "onClick" | "children" | "aria-label">
	onFilterClick?: () => void
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
		<div className={cn("search-tool-w flex items-center gap-3 text-OnSurface/70", className)}>
			<label
				className={cn(
					"flex-1 py-1.5 pl-2 pr-4.5 flex h-8 items-center gap-1 rounded-full border-2 border-Outline bg-connecto-muted-panel",
					disabled && "opacity-60",
					inputWrapperClassName,
				)}
			>
				<span className="h-full w-fit p-px flex items-center justify-center" aria-hidden="true">
					<SearchIcon className="aspect-square h-full w-auto w-4.5 h-4.5" />
				</span>
				<input
				
					{...inputProps}
					type={type}
					disabled={disabled}
					placeholder={placeholder}
					aria-label={inputProps["aria-label"] ?? placeholder}
					className={cn(
						"min-w-0 flex-1 bg-transparent text-sm font-medium leading-none  outline-none placeholder:text-Outline ",
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
				<ToolOutlineIcon className="size-5" />
			</button>
		</div>
	)
}
