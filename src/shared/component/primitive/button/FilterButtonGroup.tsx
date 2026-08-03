"use client";

import { useState, type ComponentProps } from "react";
import type {
  DataFieldConfig,
  DataViewConfig,
  DataViewMetadata,
} from "../../../types/dataView.types";
import { cn } from "@/shared/lib/util";
import SelectMenuNew, {
  type SelectMenuOptionChildProps,
} from "../selectMenuNew";
import { Icons } from "../icon";
import ButtonModal from "../ButtonModal";
import Button from "./Button";
import FilterButton from "./FilterButton";
import { useDataSearchQuery } from "@/shared/store/filter/useFilterStore";

type Props<TItem> = ComponentProps<"div"> & {
  config: DataViewConfig<TItem>;
  metadata: DataViewMetadata;
  requestedFieldId?: string | null;
  onOpenFieldChange?: (fieldId: string | null) => void;
};

const ADD_FILTER_MENU_ID = "add-filter";

type AddFilterOptionProps<TItem> = Partial<SelectMenuOptionChildProps> & {
  column: DataFieldConfig<TItem>;
};

function AddFilterOption<TItem>({
  column,
  checked,
  isHovered = false,
  className,
  ...props
}: AddFilterOptionProps<TItem>) {
  const Icon = Icons[column.icon];

  return (
    <button
      type="button"
      role="menuitem"
      data-checked={checked || undefined}
      className={cn(
        "flex min-h-8 items-center gap-2 rounded-sm px-2 text-left text-sm font-medium",
        "bg-transparent text-InverseOnSurface transition-colors",
        isHovered && "bg-Primary text-OnPrimary",
        className,
      )}
      {...props}
    >
      <Icon className="size-4 shrink-0" />
      <span className="whitespace-nowrap">{column.label}</span>
    </button>
  );
}

export default function FilterButtonGroup<TItem>({
  className,
  config,
  metadata,
  requestedFieldId,
  onOpenFieldChange,
  ...props
}: Props<TItem>) {
  const { conditions } = useDataSearchQuery();
  const [openedId, setOpenedId] = useState<string | null>(null);
  const [selectedFieldIds, setSelectedFieldIds] = useState<readonly string[]>(
    [],
  );
  const [hoveredIndex, setHoveredIndex] = useState(0);
  const effectiveOpenedId =
    requestedFieldId === undefined ? openedId : requestedFieldId;
  const filterableColumns = config.fields.filter(
    (column) => column.filterable !== false,
  );
  const visibleFieldIds = new Set([
    ...selectedFieldIds,
    ...conditions.map((condition) => condition.fieldId),
    ...(requestedFieldId ? [requestedFieldId] : []),
  ]);
  const selectedColumns = filterableColumns.filter((column) =>
    visibleFieldIds.has(column.fieldId),
  );
  const availableColumns = filterableColumns.filter(
    (column) => !visibleFieldIds.has(column.fieldId),
  );

  const setOpenField = (fieldId: string | null) => {
    setOpenedId(fieldId);
    onOpenFieldChange?.(fieldId);
  };

  const addFilter = (fieldId: string) => {
    setSelectedFieldIds((current) =>
      current.includes(fieldId) ? current : [...current, fieldId],
    );
    setOpenField(fieldId);
    setHoveredIndex(0);
  };

  return (
    <div
      className={cn(
        "flex items-center min-w-0 gap-2 scrollbar-none",
        effectiveOpenedId ? "overflow-x-hidden" : "overflow-x-auto",
        className,
      )}
      {...props}
    >
      {availableColumns.length > 0 && (
        <ButtonModal
          open={effectiveOpenedId === ADD_FILTER_MENU_ID}
          onOpenChange={(open) =>
            setOpenField(open ? ADD_FILTER_MENU_ID : null)
          }
        >
          <ButtonModal.Trigger>
            <Button
              icon="filter"
              label="Filtro"
              intent="darkInk"
              appearance="text"
              size="md"
              className="shrink-0"
            />
          </ButtonModal.Trigger>
          <ButtonModal.Content>
            <SelectMenuNew.Root
              isOpen
              hoveredIndex={hoveredIndex}
              onHoverItem={setHoveredIndex}
              onSelectItem={addFilter}
            >
              {availableColumns.map((column) => (
                <SelectMenuNew.Option
                  key={column.fieldId}
                  value={column.fieldId}
                >
                  <AddFilterOption column={column} />
                </SelectMenuNew.Option>
              ))}
            </SelectMenuNew.Root>
          </ButtonModal.Content>
        </ButtonModal>
      )}
      {selectedColumns.map((column) => (
        <FilterButton
          key={column.fieldId}
          column={column}
          options={metadata.optionsByFieldId[column.fieldId] ?? []}
          open={effectiveOpenedId === column.fieldId}
          onOpenChange={(open) =>
            setOpenField(open ? column.fieldId : null)
          }
          onClose={() =>
            setSelectedFieldIds((current) =>
              current.filter((fieldId) => fieldId !== column.fieldId),
            )
          }
        />
      ))}
      

      {/* scroll margin */}
      <div className="w-4/5 shrink-0" />
    </div>
  );
}
