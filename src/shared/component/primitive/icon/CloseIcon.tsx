import { cn } from "@/shared/lib/util";
import { ComponentProps } from "react";

type Props = ComponentProps<'svg'> & {
  // strokeWidth?: number;
}

export default function CloseIcon({ className,strokeWidth, ...props }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("w-6 h-6 aspect-square", className)}
      {...props}
    >
      <path
        strokeWidth={strokeWidth ?? 0}
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
        d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z"
        fill="currentColor"
      />
    </svg>
  );
}