

import { cn } from "@/shared/lib/util";
import { ComponentProps } from "react";

type Props = ComponentProps<"svg"> & {};

export default function PlusIcon({ className, ...props }: Props) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      className={cn("w-6 h-6 aspect-square", className)}
      {...props}
    >
      <path
        fill="currentColor"
       d="M9.7802 14.5122C9.7802 14.9427 9.43123 15.2916 9.00076 15.2916C8.57028 15.2916 8.22131 14.9427 8.22131 14.5122L8.22131 9.76112L3.48987 9.77685C3.0591 9.77828 2.70913 9.42948 2.70913 8.99871C2.70913 8.56895 3.05752 8.22056 3.48728 8.22056L8.23963 8.22056L8.2239 3.48782C8.22247 3.05777 8.5707 2.70838 9.00075 2.70838C9.43081 2.70838 9.77904 3.05777 9.77761 3.48782L9.76188 8.22056L14.5142 8.22056C14.944 8.22056 15.2924 8.56895 15.2924 8.99871C15.2924 9.42948 14.9424 9.77828 14.5116 9.77685L9.7802 9.76112L9.7802 14.5122Z"
   />
    </svg>
  );
}
