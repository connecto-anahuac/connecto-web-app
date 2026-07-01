import { cn } from "@/lib/util";

type Props = {
  className?: string;
};

export default function EmailIcon({ className }: Props) {
  // left arrow <
  return (
    <svg
      viewBox="0 0 23 24"
      fill="none"
      className={cn("w-6 h-6 aspect-23/24", className)}
    >
      <path
        d="M3.72995 20C3.21661 20 2.77717 19.8042 2.41161 19.4125C2.04606 19.0208 1.86328 18.55 1.86328 18V6C1.86328 5.45 2.04606 4.97917 2.41161 4.5875C2.77717 4.19583 3.21661 4 3.72995 4H18.6633C19.1766 4 19.6161 4.19583 19.9816 4.5875C20.3472 4.97917 20.53 5.45 20.53 6V18C20.53 18.55 20.3472 19.0208 19.9816 19.4125C19.6161 19.8042 19.1766 20 18.6633 20H3.72995ZM11.1966 13L3.72995 8V18H18.6633V8L11.1966 13ZM11.1966 11L18.6633 6H3.72995L11.1966 11ZM3.72995 8V6V18V8Z"
        fill="currentColor"
      />
    </svg>
  );
}
