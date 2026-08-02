import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/util";

type SearchResultItemProps = Omit<ComponentProps<"button">, "children"> & {
  label: string;
  active?: boolean;
};

export default function SearchResultItem({
  label,
  active = false,
  className,
  type = "button",
  ...props
}: SearchResultItemProps) {
  return (
    <button
      type={type}
      className={cn(
        "flex min-h-6 w-full items-center rounded-sm px-2 py-1 text-left text-sm  font-medium text-OnSurface transition-colors hover:bg-SurfaceContainerHighest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-Primary/30",
        active && "bg-SurfaceContainerHighest",
        className,
      )}
      {...props}
    >
      <span className="truncate">{label}</span>
    </button>
  );
}