import { cn } from "@/shared/lib/util";
import { ComponentProps } from "react";

type Props = ComponentProps<"svg"> & {};

export default function PinIcon({ className, ...props }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("w-6 h-6 aspect-square", className)}
      {...props}
    >
      <path
        fill="currentColor"
        d="M16 12L18 14V16H13V22L12 23L11 22V16H6V14L8 12V5H7V3H17V5H16V12ZM8.85 14H15.15L14 12.85V5H10V12.85L8.85 14Z"
      />
    </svg>
  );
}
