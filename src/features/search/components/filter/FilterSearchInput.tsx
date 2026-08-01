import { useEffect, useRef, type ComponentProps } from "react";
import InsideCircleCloseButton from "@/components/InsideCircleCloseButton";
import { cn } from "@/shared/lib/util";

type FilterSearchInputProps = ComponentProps<"input"> & {
  onClear?: () => void;
  isFocusedInitially?: boolean;
};

export function FilterSearchInput({
  className,
  onClear,
  isFocusedInitially = true,
  ...props
}: FilterSearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isFocusedInitially) inputRef.current?.focus();
  }, [isFocusedInitially]);

  return (
    <div className="relative w-full h-9">
      <input
        ref={inputRef}
        className={cn(
          "h-full w-full p-2 pr-8 rounded-sm border border-Outline bg-gray-400/20 text-sm leading-none font-normal text-OnSurfaceVariant outline-none placeholder:text-OnSurfaceVariant/70",
          "focus:border-2 focus:border-Primary focus:bg-SurfaceContainerLow",
          className,
        )}
        type="text"
        {...props}
      />

      {Boolean(props.value) && (
        <InsideCircleCloseButton
          className="absolute right-2 top-1/2 -translate-y-1/2 size-4"
          onClick={onClear}
        />
      )}
    </div>
  );
}
