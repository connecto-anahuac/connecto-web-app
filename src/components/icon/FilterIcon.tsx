import { cn } from "@/shared/lib/util";
import { ComponentProps } from "react";

type Props = ComponentProps<'svg'> & {}

export default function FilterIcon({ className, ...props }: Props) {
  return (
    <svg
      viewBox="0 0 22 22"
      fill="none"
      className={cn("w-6 h-6 aspect-square", className)}
      {...props}
    >
      <path
        d="M10.0723 18.3339C9.81254 18.3339 9.59483 18.2461 9.41913 18.0704C9.24344 17.8947 9.15559 17.677 9.15559 17.4172V11.9172L3.83892 5.1339C3.60976 4.82835 3.57538 4.50751 3.7358 4.1714C3.89622 3.83529 4.17504 3.66724 4.57226 3.66724H17.4056C17.8028 3.66724 18.0816 3.83529 18.2421 4.1714C18.4025 4.50751 18.3681 4.82835 18.1389 5.1339L12.8223 11.9172V17.4172C12.8223 17.677 12.7344 17.8947 12.5587 18.0704C12.383 18.2461 12.1653 18.3339 11.9056 18.3339H10.0723ZM10.9889 11.2756L15.5264 5.50057H6.45143L10.9889 11.2756Z"
        fill="currentColor"
      />
    </svg>
  );
}