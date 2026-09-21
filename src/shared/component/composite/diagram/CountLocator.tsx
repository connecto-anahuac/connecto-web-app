import { cn } from "@/shared/lib/util";
import { Icons } from "../../primitive/icon";

export type LocatorDirection = "top" | "right" | "bottom" | "left";

const iconRotation: Record<LocatorDirection, string> = {
  top: "rotate-180",
  right: "-rotate-90",
  bottom: "rotate-0",
  left: "rotate-90",
};
const textPosition: Record<LocatorDirection, string> = {
  top:  "left-1/2 -translate-x-1/2 bottom-0",
  right: "top-1/2 -translate-y-1/2 left-0",
  bottom:  "left-1/2 -translate-x-1/2 top-0",
  left: "top-1/2 -translate-y-1/2 right-0",
};

export default function CountLocator({
  value,
  direction,
  className,
}: {
  value: number;
  direction: LocatorDirection;
  className?: string;
}) {
  if (value <= 0) return null;

  return (
    <div
      aria-label={`${value} items outside the ${direction} edge`}
      className={cn("relative size-7.5", className)}
      role="status"
    >
      <Icons.roundedPin
        aria-hidden="true"
        className={cn(
          "size-7.5 text-PrimaryContainer ",
          iconRotation[direction],
        )}
      />

      <div
        className={cn(
          "absolute   size-6  z-20 flex items-center justify-center text-sm font-medium text-OnPrimaryContainer",
            textPosition[direction],
        )}
      >
        <span className="leading-none">{value}</span>
      </div>
    </div>
  );
}
