import { useEffect, useRef, type ComponentProps } from "react";
import InsideCircleCloseButton from "@/shared/component/primitive/InsideCircleCloseButton";
import SearchInlineChip from "@/shared/component/primitive/chip/SearchInlineChip";
import { cn } from "@/shared/lib/util";

type FilterSearchInputProps = ComponentProps<"input"> & {
  chips?: readonly {
    value: string;
    label: string;
    removeLabel?: string;
  }[];
  onChipRemove?: (value: string) => void;
  onClear?: () => void;
  isFocusedInitially?: boolean;
};

export function FilterSearchInput({
  chips = [],
  className,
  onChipRemove,
  onClear,
  isFocusedInitially = true,
  ...props
}: FilterSearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isFocusedInitially) inputRef.current?.focus();
  }, [isFocusedInitially]);

  return (
    <div
      className={cn(
        "flex min-h-9 w-full flex-wrap items-center gap-1 rounded-sm border border-Outline bg-gray-400/20 px-2 py-1",
        "focus-within:border-2 focus-within:border-Primary focus-within:bg-SurfaceContainerLow",
      )}
    >
      {chips.map((chip) => (
        <SearchInlineChip
          key={chip.value}
          label={chip.label}
          removeLabel={chip.removeLabel}
          onRemove={() => onChipRemove?.(chip.value)}
        />
      ))}

      <div className="relative h-6 min-w-20 flex-1">
        <input
          ref={inputRef}
          className={cn(
            "h-full w-full min-w-0 bg-transparent p-0 text-sm leading-none font-normal text-OnSurfaceVariant outline-none placeholder:text-OnSurfaceVariant/70",
            Boolean(props.value) && "pr-6",
            className,
          )}
          type="text"
          {...props}
          {...(chips.length > 0 && { placeholder: "" } )}
        />

        {(Boolean(props.value) || chips.length > 0) && (
          <InsideCircleCloseButton
            className="absolute right-0 top-1/2 size-4 -translate-y-1/2"
            onClick={
              onClear}
          />
        )}
      </div>
    </div>
  );
}
