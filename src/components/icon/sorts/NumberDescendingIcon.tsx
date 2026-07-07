import { cn } from "@/shared/lib/util";
import { ComponentProps } from "react";

type Props = ComponentProps<'svg'> & {}

export default function NumberDescendingIcon({ className, ...props }: Props) {
  return (
    <svg
      viewBox="0 0 17 20"
      fill="none"
      className={cn("w-6 h-6 aspect-square", className)}
      {...props}
    >
      <path
        d="M7 13L4 16L1 13M4 16V4M14 12C14.5304 12 15.0391 12.2107 15.4142 12.5858C15.7893 12.9609 16 13.4696 16 14V17C16 17.5304 15.7893 18.0391 15.4142 18.4142C15.0391 18.7893 14.5304 19 14 19C13.4696 19 12.9609 18.7893 12.5858 18.4142C12.2107 18.0391 12 17.5304 12 17V14C12 13.4696 12.2107 12.9609 12.5858 12.5858C12.9609 12.2107 13.4696 12 14 12ZM12 3C12 3.53043 12.2107 4.03914 12.5858 4.41421C12.9609 4.78929 13.4696 5 14 5C14.5304 5 15.0391 4.78929 15.4142 4.41421C15.7893 4.03914 16 3.53043 16 3C16 2.46957 15.7893 1.96086 15.4142 1.58579C15.0391 1.21071 14.5304 1 14 1C13.4696 1 12.9609 1.21071 12.5858 1.58579C12.2107 1.96086 12 2.46957 12 3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 3V6C16 6.53043 15.7893 7.03914 15.4142 7.41421C15.0391 7.78929 14.5304 8 14 8H12.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}