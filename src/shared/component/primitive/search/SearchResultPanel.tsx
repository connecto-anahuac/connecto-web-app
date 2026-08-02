import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/util";

import SearchResultItem from "./SearchResultItem";

type SearchResultPanelProps = ComponentProps<"div"> & {
  suggestions: string[];
  activeIndex?: number;
  onSuggestionClick?: (suggestion: string, index: number) => void;
};

export default function SearchResultPanel({
  suggestions,
  activeIndex,
  onSuggestionClick,
  className,
  ...props
}: SearchResultPanelProps) {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "w-full rounded-md border border-DividerMiddle bg-DividerLowest p-2",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col gap-1.5">
        {suggestions.map((suggestion, index) => (
          <SearchResultItem
            key={`${suggestion}-${index}`}
            label={suggestion}
            active={activeIndex === index}
            onClick={() => onSuggestionClick?.(suggestion, index)}
          />
        ))}
      </div>
    </div>
  );
}