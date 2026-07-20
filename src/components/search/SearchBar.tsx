import type { ComponentProps } from "react";

import SearchInlineChip from "@/components/chip/SearchInlineChip";
import CloseIcon from "@/components/icon/CloseIcon";
import SearchIcon from "@/components/icon/SearchIcon";
import { cn } from "@/shared/lib/util";

import SearchResultPanel from "./SearchResultPanel";

export type SearchBarState = "empty" | "writing" | "hasDefinedQuery";

type SearchBarProps = ComponentProps<"div"> & {
  state?: SearchBarState;
  placeholder?: string;
  queryText?: string;
  definedQueryLabel?: string;
  suggestions?: string[];
  activeSuggestionIndex?: number;
  onClear?: ComponentProps<"button">["onClick"];
  onRemoveDefinedQuery?: ComponentProps<typeof SearchInlineChip>["onRemove"];
  onSuggestionClick?: (suggestion: string, index: number) => void;
  panelClassName?: string;
};

function getContainerStateClassName(state: SearchBarState) {
  if (state === "writing") {
    return "gap-3.5 border border-Primary/40 bg-PrimaryContainerLow";
  }

  if (state === "hasDefinedQuery") {
    return "gap-3.5 border border-DividerMiddle bg-DividerLow";
  }

  return "gap-3 border border-transparent bg-DividerLowest";
}

export default function SearchBar({
  state = "empty",
  placeholder = "buscar en los estudiantes",
  queryText = "arquite",
  definedQueryLabel = "arquitectura",
  suggestions = [
    "Arquitectura de computadoras y la nube",
    "Arquitectura de braa uyuyube 2",
    "Arquitectura del mundo ube alalalal alalala",
  ],
  activeSuggestionIndex,
  onClear,
  onRemoveDefinedQuery,
  onSuggestionClick,
  className,
  panelClassName,
  ...props
}: SearchBarProps) {
  return (
    <div className={cn("inline-flex w-full min-w-64 flex-col gap-1.5", className)} {...props}>
      <div
        className={cn(
          "flex h-7 items-center rounded-full px-3.5 text-OnSurface",
          getContainerStateClassName(state),
        )}
      >
        <SearchIcon className="size-4 shrink-0 text-OnSurface" />

        {state === "hasDefinedQuery" ? (
          <SearchInlineChip
            className="min-w-0"
            label={definedQueryLabel}
            onRemove={onRemoveDefinedQuery}
          />
        ) : (
          <span
            className={cn(
              "min-w-0 flex-1 truncate leading-none font-medium",
              state === "empty" ? "text-xs text-OnSurface-40" : "text-sm text-OnSurface",
            )}
          >
            {state === "empty" ? placeholder : queryText}
          </span>
        )}

        {state === "writing" ? (
          <button
            type="button"
            aria-label="Clear search"
            className="inline-flex size-4 shrink-0 items-center justify-center rounded-full text-OnSurface-60 transition-colors hover:bg-OnSurface/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-Primary/30"
            onClick={onClear}
          >
            <CloseIcon className="size-3" strokeWidth={1.2} />
          </button>
        ) : null}
      </div>

      {state === "writing" ? (
        <SearchResultPanel
          suggestions={suggestions}
          activeIndex={activeSuggestionIndex}
          className={panelClassName}
          onSuggestionClick={onSuggestionClick}
        />
      ) : null}
    </div>
  );
}