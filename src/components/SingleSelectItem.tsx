import { cn } from "@/shared/lib/util";
import type { ButtonHTMLAttributes } from "react";

type SingleSelectItemProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  label: string;
  checked: boolean;
  isHovered?: boolean;
  checkboxClassName?: string;
};

function CheckMark() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-5">
      <path
        d="M5.5 10L8.5 13L14.5 7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SingleSelectItem({
  label,
  checked,
  isHovered = false,
  className,
  disabled,
  type = "button",
  ...buttonProps
}: SingleSelectItemProps) {
  return (
    <button
      {...buttonProps}
      type={type}
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      className={cn(
        "inline-flex min-h-6 w-40 items-center gap-2 rounded-sm px-1 py-0.5 text-left text-sm leading-none font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-connecto-muted/30 disabled:cursor-not-allowed disabled:opacity-60",
        "bg-transparent text-InverseOnSurface",
        // checked && "bg-Primary text-OnPrimary",

        isHovered && "bg-Primary text-OnPrimary",
        className,
      )}
    >
      <span
        className={cn(
          "inline-flex size-5 shrink-0 items-center justify-center",
           "text-transparent",
          checked && "text-InverseOnSurface",
        )}
      >
        <CheckMark />
      </span>

      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}
