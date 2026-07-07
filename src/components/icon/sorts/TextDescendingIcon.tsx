import { cn } from "@/shared/lib/util";
import { ComponentProps } from "react";

type Props = ComponentProps<'svg'> & {}

export default function TextDescendingIcon({ className, ...props }: Props) {
  return (
    <svg
      viewBox="0 0 17 20"
      fill="none"
      className={cn("w-6 h-6 aspect-square", className)}
      {...props}
    >
      <path
        d="M12 19V14C12 12.62 12.62 12 14 12C15.38 12 16 12.62 16 14V19M16 16H12M16 8H12L16 1H12M7 13L4 16L1 13M4 16V4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}