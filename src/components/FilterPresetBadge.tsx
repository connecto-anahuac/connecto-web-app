import { cn } from "@/shared/lib/util";

interface Props {
  value: string;
  isSelected: boolean;
  className?: string;
}

export default function FilterPresetBadge({
  value,
  isSelected,
  className ,
}: Props) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-xl px-2 py-1 text-xs leading-none font-medium",
        "bg-Tertiary  text-OnTertiary",
        !isSelected && "bg-transparent  text-Outline border border-Outline",

        className,
      )}
    >
      {value}
    </span>
  );
}
