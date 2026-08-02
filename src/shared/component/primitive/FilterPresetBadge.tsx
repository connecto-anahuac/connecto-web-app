import { cn } from "@/shared/lib/util";

interface Props {
  value: string;
  isSelected: boolean;
  className?: string;
  onClick?: () => void;
}

export default function FilterPresetBadge({
  value,
  isSelected,
  className,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex w-fit items-center rounded-xl px-2 py-1 text-xs leading-none font-medium",
        "transition-colors",
        onClick && "cursor-pointer",
        "bg-Tertiary  text-OnTertiary",
        !isSelected && "bg-transparent  text-Outline border border-Outline",

        className,
      )}
    >
      {value}
    </button>
  );
}
