import { cn } from "@/shared/lib/util";
import { ComponentProps } from "react";

type Props = ComponentProps<"svg"> & {};

export default function ExpandCenterColumnIcon({ className, ...props }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("w-6 h-6 aspect-square", className)}
      {...props}
    >
      <path
        fill="currentColor"
        d="M5 17C4.45 17 3.97917 16.8042 3.5875 16.4125C3.19583 16.0208 3 15.55 3 15V9C3 8.45 3.19583 7.97917 3.5875 7.5875C3.97917 7.19583 4.45 7 5 7H19C19.55 7 20.0208 7.19583 20.4125 7.5875C20.8042 7.97917 21 8.45 21 9V15C21 15.55 20.8042 16.0208 20.4125 16.4125C20.0208 16.8042 19.55 17 19 17H5ZM5 15H19V9H5V15ZM3 5V3H21V5H3ZM3 21V19H21V21H3Z"
      />
    </svg>
  );
}
