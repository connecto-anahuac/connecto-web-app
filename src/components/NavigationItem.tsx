import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/shared/lib/util";

type NavigationItemTone = "content" | "root";

type Props = ComponentProps<"div"> & {
	icon?: ReactNode;
	label?: string;
	selected?: boolean;
	tone?: NavigationItemTone;
	hasLabel?: boolean;
};

export function NavigationItem({
	className,
	icon,
	label = "materias ofertadas",
	selected = false,
	tone = "content",
	hasLabel = true,
	...props
}: Props) {
	const isRoot = tone === "root";
	const showLabel = hasLabel && label.length > 0;

	return (
		<div
			className={cn(
				"inline-flex items-center gap-2 rounded-md py-2 text-xs leading-none",
				showLabel ? "pl-1 pr-1.5" : "px-1.5",
				selected && isRoot && "bg-[#FFDBCF66]",
				selected && !isRoot && "bg-connecto-divider",
				!selected && "opacity-[0.84]",
				className,
			)}
			{...props}
		>
			<span className="flex size-4.5 shrink-0 items-center justify-center text-current">
				{icon}
			</span>
			{showLabel ? (
				<span
					className={cn(
						"whitespace-nowrap text-xs leading-none",
						selected && isRoot ? "font-semibold text-[#BC5F2F]" : "font-medium text-[#53433E]",
					)}
				>
					{label}
				</span>
			) : null}
		</div>
	);
}

export default NavigationItem;
