import { cn } from "@/shared/lib/util";
import { ComponentProps } from "react";

type Props = ComponentProps<"svg"> & {};

export default function FilterIcon({ className, ...props }: Props) {
  return (
    <svg
      viewBox="0 0 22 22"
      fill="none"
      className={cn("w-6 h-6 aspect-square", className)}
      {...props}
    > <path
            d="M10.0762 18.3337C9.81644 18.3337 9.59873 18.2458 9.42304 18.0701C9.24735 17.8944 9.1595 17.6767 9.1595 17.417V11.917L3.84283 5.13366C3.61366 4.8281 3.57929 4.50727 3.73971 4.17116C3.90012 3.83505 4.17894 3.66699 4.57616 3.66699H17.4095C17.8067 3.66699 18.0855 3.83505 18.246 4.17116C18.4064 4.50727 18.372 4.8281 18.1428 5.13366L12.8262 11.917V17.417C12.8262 17.6767 12.7383 17.8944 12.5626 18.0701C12.3869 18.2458 12.1692 18.3337 11.9095 18.3337H10.0762ZM10.9928 11.2753L15.5303 5.50033H6.45533L10.9928 11.2753Z"
            fill="currentColor"
          />
          <path
            d="M10.9928 11.2753L15.5303 5.50033H6.45533L10.9928 11.2753Z"
            fill="currentColor"
          />
  
    </svg>
  );
}
