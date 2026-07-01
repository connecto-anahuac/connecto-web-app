import { cn } from "@/lib/util";

type Props = {
  className?: string;
  direction?: "left" | "right" | "up" | "down";
};

export default function Arrow({ className, direction = "left" }: Props) {
  // left arrow <
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn(
        "w-6 h-6 aspect-square",
        className,
        direction === "right" && "rotate-180",
        direction === "up" && "rotate-90",
        direction === "down" && "-rotate-90",
      )}
    >
      <path
        d="M14 18L8 12L14 6L15.4 7.4L10.8 12L15.4 16.6L14 18Z"
        fill="currentColor"
      />
    </svg>
  );
}
