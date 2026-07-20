import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/util";
import TildeIcon from "../icon/TildeIcon";

type TimeSlotRowHeaderState = "visible" | "highlighted" | "hidden";

type Props = ComponentProps<"div"> & {
	state?: TimeSlotRowHeaderState;
	label?: string;
	startTime?: string;
	endTime?: string;
};

const VISIBLE_ICON_PATH =
	"M12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5Z";

const HIDDEN_ICON_PATH =
	"M2.81 2 1.39 3.41 5.47 7.49C3.85 8.79 2.55 10.28 1.73 12C3.46 16.39 7.73 19.5 12.73 19.5C14.68 19.5 16.52 19.03 18.15 18.2L20.59 20.64L22 19.23L2.81 2ZM12.73 17.5C8.97 17.5 5.57 15.36 3.95 12C4.63 10.59 5.62 9.36 6.83 8.35L8.3 9.82C8.11 10.38 8 10.98 8 11.61C8 14.37 10.24 16.61 13 16.61C13.63 16.61 14.23 16.5 14.79 16.31L16.72 18.24C15.51 18.72 14.15 17.5 12.73 17.5ZM10.11 5.08L12.19 7.16C12.46 7.11 12.73 7.08 13 7.08C15.76 7.08 18 9.32 18 12.08C18 12.35 17.97 12.62 17.92 12.89L20.99 15.96C21.81 14.88 22.49 13.68 23 12.08C21.27 7.69 17 4.58 12 4.58C11.36 4.58 10.73 4.63 10.11 5.08ZM13.16 9.26L15.74 11.84L15.75 11.71C15.75 10.3 14.61 9.16 13.2 9.16L13.16 9.26ZM9.25 10.35L11.79 12.89L11.78 12.76C11.78 11.35 10.64 10.21 9.23 10.21L9.25 10.35ZM12.95 13.95L14.96 15.96C14.35 16.34 13.63 16.58 12.86 16.61L12.95 13.95Z";

export default function TimeSlotRowHeader({
	state = "visible",
	label = "T2",
	startTime = "8:30",
	endTime = "10:00",
	className,
	...props
}: Props) {
	const isHighlighted = state === "highlighted";
	const isHidden = state === "hidden";
	const iconPath = isHidden ? HIDDEN_ICON_PATH : VISIBLE_ICON_PATH;

	return (
		<div
			className={cn(
				"flex w-12 flex-col items-center justify-center rounded-sm text-xs font-medium",
				isHidden
					  ? "h-10 bg-DividerMiddle text-OnSurfaceVariant"
					  : "min-h-25.5 px-1 py-2.5",
				isHighlighted
					? "border border-Primary bg-PrimaryContainerLow text-onPrimaryContainerLow"
					: "border border-DividerMiddle bg-DividerMiddle text-OnSurfaceVariant",
				className,
			)}
			{...props}
		>
			<svg
				viewBox="0 0 24 24"
				fill="currentColor"
				className="size-5 shrink-0"
				aria-hidden="true"
			>
				<path d={iconPath} />
			</svg>

			{isHidden ? null : (
				<>
					<span className="mt-1 leading-none">{label}</span>
					<div className="mt-1.5 flex w-full flex-col items-center gap-0.5">
						<span className={cn("leading-none", isHighlighted ? "text-onPrimaryContainerLow" : "text-OnSurface/40")}>
							{startTime}
						</span>
						{/* <div className={cn("h-px w-full", isHighlighted ?  "text-onPrimaryContainerLow" : "text-OnSurface-40")} /> */}
						<TildeIcon  className={cn("h-2", isHighlighted ?  "text-onPrimaryContainerLow" : "text-OnSurface/60")} />
                        <span className={cn("leading-none", isHighlighted ? "text-onPrimaryContainerLow" : "text-OnSurface/40")}>
							{endTime}
						</span>
					</div>
				</>
			)}
		</div>
	);
}
