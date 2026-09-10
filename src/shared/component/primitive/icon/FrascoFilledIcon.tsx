import { cn } from "@/shared/lib/util";
import { ComponentProps } from "react";

type Props = ComponentProps<'svg'> & {};

export default function FrascoFilledIcon({ className, ...props }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("w-6 h-6 aspect-square", className)}
      {...props}
    >
      <path
        d="M5.0005 21C4.1505 21 3.5465 20.621 3.1885 19.863C2.8305 19.105 2.91783 18.4007 3.4505 17.75L9.0005 11V5H7.0005V3H17.0005V5H15.0005V11L20.5505 17.75C21.0838 18.4 21.1715 19.1043 20.8135 19.863C20.4555 20.6217 19.8512 21.0007 19.0005 21H5.0005Z"
        fill="currentColor"
      />
    </svg>
  );
}
