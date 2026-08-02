import { cn } from "@/shared/lib/util";
import { ComponentProps } from "react";

type Props = ComponentProps<'svg'> & {}

export default function NumberAscendingIcon({ className, ...props }: Props) {
  return (
    <svg
      viewBox="0 0 17 20"
      fill="none"
      className={cn("w-6 h-6 aspect-square", className)}
      {...props}
    >
      <path
        d="M7 13L4 16L1 13M4 16V4M14 1C14.5304 1 15.0391 1.21071 15.4142 1.58579C15.7893 1.96086 16 2.46957 16 3V6C16 6.53043 15.7893 7.03914 15.4142 7.41421C15.0391 7.78929 14.5304 8 14 8C13.4696 8 12.9609 7.78929 12.5858 7.41421C12.2107 7.03914 12 6.53043 12 6V3C12 2.46957 12.2107 1.96086 12.5858 1.58579C12.9609 1.21071 13.4696 1 14 1ZM12 14C12 14.5304 12.2107 15.0391 12.5858 15.4142C12.9609 15.7893 13.4696 16 14 16C14.5304 16 15.0391 15.7893 15.4142 15.4142C15.7893 15.0391 16 14.5304 16 14C16 13.4696 15.7893 12.9609 15.4142 12.5858C15.0391 12.2107 14.5304 12 14 12C13.4696 12 12.9609 12.2107 12.5858 12.5858C12.2107 12.9609 12 13.4696 12 14Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 14V17C16 17.5304 15.7893 18.0391 15.4142 18.4142C15.0391 18.7893 14.5304 19 14 19H12.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}