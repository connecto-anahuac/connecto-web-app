"use client";

import type { Column } from "@tanstack/react-table";
import { cn } from "@/shared/lib/util";
import { Icons } from "../icon";
import { TableColumnFilterContainer } from "../table/DataTable/TableColumnFilterContainer";
import type { DataViewColumn } from "../table/dataView.types";
import ButtonModal from "../ButtonModal";
import type { FilterCondition } from "@/features/table/type";

type TanstackFilterButtonProps<TItem> = {
  column: Column<TItem>;
  config: DataViewColumn<TItem>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function getSelectedValueLabel<TItem>(
  config: DataViewColumn<TItem>,
  value: unknown,
) {
  const getOptionLabel = (optionValue: unknown) =>
    config.options?.find((option) => option.value === optionValue)?.label ??
    String(optionValue);

  if (Array.isArray(value)) {
    return value.length > 0 ? value.map(getOptionLabel).join(",") : null;
  }

  return value === undefined || value === null ? null : getOptionLabel(value);
}

/** A DataViewConfig-driven filter control backed by a TanStack Table column. */
export function TanstackFilterButton<TItem>({
  column,
  config,
  open,
  onOpenChange,
}: TanstackFilterButtonProps<TItem>) {
  const filterValue = column.getFilterValue() as FilterCondition | undefined;
  const hasCondition = filterValue !== undefined;
  const selectedValueLabel = getSelectedValueLabel(config, filterValue?.value);
  const Icon = Icons[config.icon];

  return (
    <>
      <ButtonModal open={open} onOpenChange={() => onOpenChange(!open)}>
        <ButtonModal.Trigger>
          <button
            aria-expanded={open}
            aria-pressed={open}
            className={cn(
              "bg-transparent text-OnSurfaceVariant border border-OutlineVariant",
              "hover:bg-SurfaceContainerLow",
              "aria-pressed:text-OnPrimary aria-pressed:bg-Primary",
              "active:bg-SurfaceContainer active:text-OnSurface",
              "rounded-full h-7 gap-1 flex items-center",
              "py-2 pl-3 pr-3.5",
              "text-sm font-medium whitespace-nowrap",
            )}
            // onClick={() => onOpenChange(!open)}
            type="button"
          >
            <Icon className="size-4" />
            <span className="flex items-baseline gap-px">
              <span>{config.label}</span>
              {hasCondition && (
                <>
                  <span className="ml-px font-semibold">:</span>
                  <span className="ml-px max-w-30 truncate text-xs">
                    {selectedValueLabel}
                  </span>
                </>
              )}
            </span>
          </button>
        </ButtonModal.Trigger>

        <ButtonModal.Content>
          <TableColumnFilterContainer
            column={column}
            config={config}
            // onClose={() => onOpenChange(false)}
          />
        </ButtonModal.Content>
      </ButtonModal>
    </>
  );
}
