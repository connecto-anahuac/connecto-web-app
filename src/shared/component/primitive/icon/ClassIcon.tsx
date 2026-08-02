import { cn } from "@/shared/lib/util";
import { ComponentProps } from "react";

type Props = ComponentProps<"svg"> & {};

export default function ClassIcon({ className, ...props }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("w-6 h-6 aspect-square", className)}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="currentColor"
        d="M21.2969 12.7C21.2969 13.0314 21.0282 13.3 20.6969 13.3H17.2969V17.4C17.2969 17.7314 17.0282 18 16.6969 18H3.89688C3.5655 18 3.29688 17.7314 3.29688 17.4V6.6C3.29688 6.26863 3.5655 6 3.89688 6H16.6969C17.0282 6 17.2969 6.26863 17.2969 6.6V10.7H20.6969C21.0282 10.7 21.2969 10.9686 21.2969 11.3V12.7ZM15.2969 15.4C15.2969 15.7314 15.0282 16 14.6969 16H5.89688C5.5655 16 5.29688 15.7314 5.29688 15.4V8.6C5.29688 8.26863 5.5655 8 5.89688 8H14.6969C15.0282 8 15.2969 8.26863 15.2969 8.6V15.4Z"
      />
    </svg>
  );
}


