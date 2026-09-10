import { cn } from "@/shared/lib/util";
import type { ButtonHTMLAttributes } from "react";

type MultiSelectProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  label: string;
  checked?: boolean;
  isHovered?: boolean;
  checkboxClassName?: string;
};

function CheckMark() {
  return (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" className="size-3">
      <path
        d="M4.5 9.25L7.375 12L13.5 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function MultiSelect({
  label,
  checked = false,
  isHovered = false,
  className,
  checkboxClassName,
  disabled,
  type = "button",
  ...buttonProps
}: MultiSelectProps) {
  return (
    <button
      {...buttonProps}
      type={type}
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      className={cn(
        "",
        "h-7 inline-flex items-center gap-2 rounded-sm px-1 py-0 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-connecto-muted/30 disabled:cursor-not-allowed disabled:opacity-60",
        isHovered && "bg-gray-400/20",
        className,
      )}
    >
      {/* <span className="flex h-full  w-fit items-center py-0.75"> */}
      <span
        className={cn(
          "border-Outline border h-full",
          "flex size-3.5 shrink-0 items-center justify-center rounded-sm border bg-transparent text-Outline",

          checkboxClassName,
          checked && "border-Primary bg-Primary text-OnPrimary ",
        )}
      >
        {checked ? <CheckMark /> : null}
      </span>
      {/* </span> */}

      <span
        className={cn(
          "text-OnSurfaceVariant",
          " text-sm leading-none font-normal whitespace-nowrap",
        )}
      >
        {label}
      </span>
    </button>
  );
}
