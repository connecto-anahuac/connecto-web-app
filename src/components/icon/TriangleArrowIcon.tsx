import { cn } from "@/shared/lib/util";
import { ComponentProps } from "react";

type Props = ComponentProps<"svg"> & {};

export default function TriangleArrowIcon({ className, ...props }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("w-6 h-6 aspect-square", className)}
      {...props}
    >
      <path
        d="M11.7071 15.2929C11.0771 15.9229 10 15.4767 10 14.5858V9.41421C10 8.52331 11.0771 8.07714 11.7071 8.70711L14.2929 11.2929C14.6834 11.6834 14.6834 12.3166 14.2929 12.7071L11.7071 15.2929Z"
        fill="currentColor"
      />
    </svg>
  );
}
