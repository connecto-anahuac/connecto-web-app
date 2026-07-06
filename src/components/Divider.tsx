import { cn } from "@/shared/lib/util";

type Props = {
  className?: string;
  direction?: "horizontal" | "vertical";
};

export default function Divider({ className, direction = "vertical" }: Props) {
  return (
    <div
      className={cn(
        "w-0 min-h-full flex justify-center overflow-visible",
        direction === "horizontal" && "min-w-full min-h-0",
        className,
      )}
    >
      <div
        className={cn(
          "bg-divider h-full min-w-px rounded-2xl",
          direction === "horizontal" && "min-h-2 h-2 w-full",
        )}
      />
    </div>
  );
}
