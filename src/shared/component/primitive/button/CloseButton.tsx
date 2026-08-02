import { ComponentProps } from "react";
import CloseIcon from "../icon/CloseIcon";
import { cn } from "@/shared/lib/util";

type Props = ComponentProps<"button"> & {};
export default function CloseButton({
  "aria-label": ariaLabel,
  className,
  ...props
}: Props) {
  return (
    <button
      type="button"
      aria-label={ariaLabel ?? `Close`}
      className={cn(
        "inline-flex size-5 items-center justify-center rounded-full p-1 text-OnSurface transition-colors  hover:bg-OnSurfaceVariant/30",
        className,
      )}
      {...props}
    >
      <CloseIcon className="size-full" strokeWidth={1} />
    </button>
  );
}
