import { cn } from "@/shared/lib/util";
import { ComponentProps } from "react";

type Props = ComponentProps<"svg"> & {};

export default function ZoomOutIcon({ className, ...props }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("w-6 h-6 aspect-square", className)}
      {...props}
    >
      <path
        fill="currentColor"
        d="M3.9 21.5L2.5 20.1L5.6 17H3V15H9V21H7V18.4L3.9 21.5ZM20.1 21.5L17 18.4V21H15V15H21V17H18.4L21.5 20.1L20.1 21.5ZM3 9V7H5.6L2.5 3.9L3.9 2.5L7 5.6V3H9V9H3ZM15 9V3H17V5.6L20.1 2.5L21.5 3.9L18.4 7H21V9H15Z"
      />
    </svg>
  );
}
