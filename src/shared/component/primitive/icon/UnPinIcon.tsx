import { cn } from "@/shared/lib/util";
import { ComponentProps } from "react";

type Props = ComponentProps<"svg"> & {};

export default function UnPinIcon({ className, ...props }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("w-6 h-6 aspect-square", className)}
      {...props}
    >
      <path
        fill="currentColor"
        d="M16.9984 2.9998V4.9998H15.9984V13.1748L13.9984 11.1748V4.9998H9.99844V7.1748L6.99844 4.1748V2.9998H16.9984ZM11.9984 22.9998L10.9984 21.9998V15.9998H5.99844V13.9998L7.99844 11.9998V10.8498L1.39844 4.1998L2.79844 2.7998L21.1984 21.1998L19.7484 22.5998L13.1484 15.9998H12.9984V21.9998L11.9984 22.9998ZM8.84844 13.9998H11.1484L9.99844 12.8498L8.84844 13.9998Z"
      />
    </svg>
  );
}
