import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/lib/util";

type Props = {
  label: string;
  selected?: boolean;
  icon?: ReactNode;
  showDot?: boolean;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

export default function TabBadge({
  label,
  selected = false,
  icon,
  showDot = false,
  className,
  type = "button",
  ...props
}: Props) {
  const hasIcon = icon != null;

  return (
    <button
      type={type}
      className={cn(
        "inline-flex w-fit shrink-0 items-center whitespace-nowrap rounded-sm transition-colors",
        hasIcon ? "h-6 gap-1 pl-1 pr-2 py-1 text-sm font-medium leading-none" : "h-23px px-2 py-1 text-xs font-medium leading-none",
        selected ? "bg-connecto-muted-panel text-connecto-ink" : "bg-transparent text-connecto-muted",
        className,
      )}
      {...props}
    >
      {showDot && <span className="size-1 rounded-full bg-current" aria-hidden="true" />}
      {hasIcon && <span className="flex size-4 items-center justify-center text-current" aria-hidden="true">{icon}</span>}
      <span>{label}</span>
    </button>
  );
}