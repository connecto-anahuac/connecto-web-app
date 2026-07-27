import type { ComponentProps } from "react";
import { useState } from "react";

import CloseIcon from "@/components/icon/CloseIcon";
import SearchIcon from "@/components/icon/SearchIcon";
import { cn } from "@/shared/lib/util";

export type SearchBarState = "empty" | "writing" | "hasDefinedQuery";

type SearchBarProps = Omit<ComponentProps<"input">, "className" | "type"> & {
  className?: string;
  inputClassName?: string;
  onClear?: () => void;
  /** @deprecated Search state is now derived from the input value. */
  state?: SearchBarState;
  /** @deprecated Use value instead. */
  queryText?: string;
  /** @deprecated Defined-query UI is not rendered. */
  definedQueryLabel?: string;
  /** @deprecated Suggestions are not rendered. */
  suggestions?: string[];
  /** @deprecated Suggestions are not rendered. */
  activeSuggestionIndex?: number;
  /** @deprecated Defined-query UI is not rendered. */
  onRemoveDefinedQuery?: () => void;
  /** @deprecated Suggestions are not rendered. */
  onSuggestionClick?: (suggestion: string, index: number) => void;
  /** @deprecated Suggestions are not rendered. */
  panelClassName?: string;
};

export default function SearchBar({
  className,
  inputClassName,
  onClear,
  value,
  defaultValue,
  onChange,
  placeholder = "buscar en los estudiantes",
  disabled,
  state: _state,
  queryText: _queryText,
  definedQueryLabel: _definedQueryLabel,
  suggestions: _suggestions,
  activeSuggestionIndex: _activeSuggestionIndex,
  onRemoveDefinedQuery: _onRemoveDefinedQuery,
  onSuggestionClick: _onSuggestionClick,
  panelClassName: _panelClassName,
  ...inputProps
}: SearchBarProps) {
  void _state;
  void _queryText;
  void _definedQueryLabel;
  void _suggestions;
  void _activeSuggestionIndex;
  void _onRemoveDefinedQuery;
  void _onSuggestionClick;
  void _panelClassName;

  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    defaultValue === undefined ? "" : String(defaultValue),
  );
  const isControlled = value !== undefined;
  const inputValue = isControlled ? String(value) : uncontrolledValue;

  return (
    <div className={cn("inline-flex w-full min-w-64", className)}>
      <div
        className={cn(
          "flex h-7 w-full items-center gap-3 rounded-full border border-transparent bg-DividerLowest px-3.5 text-OnSurface",
          "focus-within:border-Primary/40 focus-within:bg-PrimaryContainerLow",
          disabled && "opacity-60",
        )}
      >
        <SearchIcon className="size-4 shrink-0 text-OnSurface" />
        <input
          {...inputProps}
          type="search"
          value={inputValue}
          disabled={disabled}
          placeholder={placeholder}
          aria-label={inputProps["aria-label"] ?? placeholder}
          className={cn(
            "min-w-0 flex-1 bg-transparent text-sm leading-none font-medium outline-none placeholder:text-xs placeholder:text-OnSurface-40",
            disabled && "cursor-not-allowed",
            inputClassName,
          )}
          onChange={(event) => {
            if (!isControlled) {
              setUncontrolledValue(event.target.value);
            }
            onChange?.(event);
          }}
        />
        {inputValue ? (
          <button
            type="button"
            aria-label="Clear search"
            className="inline-flex size-4 shrink-0 items-center justify-center rounded-full text-OnSurface-60 transition-colors hover:bg-OnSurface/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-Primary/30"
            onClick={() => {
              if (!isControlled) {
                setUncontrolledValue("");
              }
              onClear?.();
            }}
          >
            <CloseIcon className="size-3" strokeWidth={1.2} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
