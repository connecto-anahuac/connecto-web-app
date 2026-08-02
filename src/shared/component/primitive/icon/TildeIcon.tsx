import { cn } from "@/shared/lib/util";
import { ComponentProps } from "react";

type Props = ComponentProps<"svg"> & {};

export default function TildeIcon({ className, ...props }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("w-6 h-6 aspect-square", className)}
      {...props}
    >
      <path
        d="M12 2L10.6056 3.85926C8.64746 6.47005 9.28462 10.1897 12 12C14.7154 13.8103 15.3525 17.5299 13.3944 20.1407L12 22"
        stroke="currentColor"
        strokeOpacity="0.4"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}
