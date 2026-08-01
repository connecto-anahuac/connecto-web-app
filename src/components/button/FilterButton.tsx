"use client";

import type { ComponentProps } from "react";
import { Icons } from "../icon";
import type {
  DataFieldConfig,
  DataFieldOption,
} from "../table/dataView.types";
import { cn } from "@/shared/lib/util";
import { FilterRenderer } from "@/features/search/components/filter/FilterRenderer";
import { useDataSearchQuery } from "@/features/search/components/Provider/useFilterStore";
import { operatorNumberButtonLabels } from "@/features/search/shared/operatorPolicy";
import ButtonModal from "../ButtonModal";

type Props<TItem> = ComponentProps<"button"> & {
  column: DataFieldConfig<TItem>;
  options: readonly DataFieldOption[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function FilterButton<TItem>({
  column,
  options,
  open,
  onOpenChange,
  className,
  ...props
}: Props<TItem>) {
  const query = useDataSearchQuery();
  const condition = query.conditions.find(
    (current) => current.fieldId === column.fieldId,
  );
  const hasCondition = condition?.value !== undefined && condition.value !== null;
  const operator =
    hasCondition && column.valueType === "number"
      ? (operatorNumberButtonLabels[condition.operator] ?? ":")
      : hasCondition
        ? ":"
        : null;
  const optionLabels = new Map(options.map((option) => [option.value, option.label]));
  const selectedValueLabel = Array.isArray(condition?.value)
    ? condition.value.map((value) => optionLabels.get(String(value)) ?? String(value)).join(",")
    : condition?.value === undefined || condition.value === null
      ? null
      : String(condition.value);
  const Icon = Icons[column.icon];

  return (
    <ButtonModal open={open} onOpenChange={onOpenChange}>
      <ButtonModal.Trigger>
        <button
          className={cn(
            "bg-transparent text-OnSurfaceVariant border border-OutlineVariant",
            "hover:bg-SurfaceContainerLow aria-pressed:text-OnPrimary aria-pressed:bg-Primary",
            "active:bg-SurfaceContainer active:text-OnSurface",
            "rounded-full h-7 gap-1 flex items-center py-2 pl-3 pr-3.5",
            "text-sm font-medium whitespace-nowrap",
            className,
          )}
          aria-pressed={open}
          {...props}
        >
          <Icon className="size-4" />
          <span className="flex gap-px items-baseline">
            <span>{column.label}</span>
            {operator && <span className="ml-px font-semibold">{operator}</span>}
            {selectedValueLabel && (
              <span className="ml-px text-xs max-w-30 truncate">
                {selectedValueLabel}
              </span>
            )}
          </span>
        </button>
      </ButtonModal.Trigger>
      <ButtonModal.Content>
        <FilterRenderer column={column} options={options} />
      </ButtonModal.Content>
    </ButtonModal>
  );
}
