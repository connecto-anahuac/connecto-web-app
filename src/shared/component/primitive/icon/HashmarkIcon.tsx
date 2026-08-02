import { cn } from "@/shared/lib/util";
import { ComponentProps } from "react";

type Props = ComponentProps<'svg'> & {};

export default function HashmarkIcon({ className, strokeWidth, ...props }: Props) {
  return (
    <svg
      viewBox="0 0 13 13"
      fill="none"
      className={cn("w-6 h-6 aspect-square", className)}
      {...props}
    >
      <path
        d="M2.16797 4.875H10.8346"
        stroke="currentColor"
        strokeWidth={strokeWidth ?? 1.08333}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.16797 8.125H10.8346"
        stroke="currentColor"
        strokeWidth={strokeWidth ?? 1.08333}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.41536 1.625L4.33203 11.375"
        stroke="currentColor"
        strokeWidth={strokeWidth ?? 1.08333}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.66536 1.625L7.58203 11.375"
        stroke="currentColor"
        strokeWidth={strokeWidth ?? 1.08333}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
