"use client";

import { cn } from "@/shared/lib/util";
import {
  Children,
  cloneElement,
  createContext,
  useContext,
  type ComponentProps,
  type ReactElement,
} from "react";

export type SelectMenuOptionChildProps = {
  checked: boolean;
  isHovered: boolean;
  className: string;
  onMouseEnter: () => void;
  onFocus: () => void;
  onClick: () => void;
};

type SelectMenuContextValue = {
  hoveredIndex: number;
  selectedValues: readonly string[];
  onHoverItem?: (index: number) => void;
  onSelectItem?: (value: string) => void;
};

const SelectMenuContext = createContext<SelectMenuContextValue | null>(null);
const OptionIndexContext = createContext<number | null>(null);

type SelectMenuRootProps = ComponentProps<"div"> & {
  isOpen?: boolean;
  hoveredIndex?: number;
  selectedValues?: readonly string[];
  onHoverItem?: (index: number) => void;
  onSelectItem?: (value: string) => void;
};

function SelectMenuRoot({
  isOpen = false,
  hoveredIndex = 0,
  selectedValues = [],
  onHoverItem,
  onSelectItem,
  className,
  children,
  ...props
}: SelectMenuRootProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <SelectMenuContext.Provider
      value={{
        hoveredIndex,
        selectedValues,
        onHoverItem,
        onSelectItem,
      }}
    >
      <div
        className={cn(
          "inline-flex min-w-36 flex-col rounded-md border border-Outline bg-InverseSurface px-1 py-1 text-InverseOnSurface",
          className,
        )}
        role="menu"
        {...props}
      >
        {Children.map(children, (child, index) => (
          <OptionIndexContext.Provider value={index}>
            {child}
          </OptionIndexContext.Provider>
        ))}
      </div>
    </SelectMenuContext.Provider>
  );
}

type SelectMenuOptionProps = {
  value: string;
  children: ReactElement<Partial<SelectMenuOptionChildProps>>;
};

function SelectMenuOption({ value, children }: SelectMenuOptionProps) {
  const context = useContext(SelectMenuContext);
  const index = useContext(OptionIndexContext);

  if (!context || index === null) {
    throw new Error("SelectMenuNew.Option must be used inside SelectMenuNew.Root");
  }

  return cloneElement(children, {
    checked: context.selectedValues.includes(value),
    isHovered: context.hoveredIndex === index,
    className: cn("w-full", children.props.className),
    onMouseEnter: () => context.onHoverItem?.(index),
    onFocus: () => context.onHoverItem?.(index),
    onClick: () => context.onSelectItem?.(value),
  });
}

const SelectMenuNew = {
  Root: SelectMenuRoot,
  Option: SelectMenuOption,
};

export default SelectMenuNew;
