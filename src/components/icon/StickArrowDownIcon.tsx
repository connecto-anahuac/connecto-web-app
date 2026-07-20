import { cn } from "@/shared/lib/util";
import { ComponentProps } from "react";

type Props = ComponentProps<"svg"> & {};

export default function StickArrowDownIcon({ className, ...props }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("w-6 h-6 aspect-square", className)}
      {...props}
    >
      <path
        fill="currentColor"
        d="M13.4142 16.5858C12.6332 17.3668 11.3668 17.3668 10.5858 16.5858L6.7 12.7C6.3134 12.3134 6.3134 11.6866 6.7 11.3C7.0866 10.9134 7.7134 10.9134 8.1 11.3L11 14.2V6C11 5.44771 11.4477 5 12 5C12.5523 5 13 5.44772 13 6V14.2L15.9 11.3C16.2866 10.9134 16.9134 10.9134 17.3 11.3C17.6866 11.6866 17.6866 12.3134 17.3 12.7L13.4142 16.5858Z"
      />
    </svg>
  );
}
