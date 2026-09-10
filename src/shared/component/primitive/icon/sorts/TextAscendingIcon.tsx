import { cn } from "@/shared/lib/util";
import { ComponentProps } from "react";

type Props = ComponentProps<'svg'> & {}

export default function TextAscendingIcon({ className, ...props }: Props) {
  return (
    <svg
      viewBox="0 0 17 20"
      fill="none"
      className={cn("w-6 h-6 aspect-square", className)}
      {...props}
    >
      <path
        d="M12 8V3C12 1.62 12.62 1 14 1C15.38 1 16 1.62 16 3V8M16 5H12M16 19H12L16 12H12M7 13L4 16L1 13M4 16V4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}