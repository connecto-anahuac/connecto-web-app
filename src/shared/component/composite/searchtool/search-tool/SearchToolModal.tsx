import type { ComponentProps } from "react";
import TabBadge from "@/shared/component/primitive/TabBadge";
import type {
  DataViewConfig,
  DataViewMetadata,
} from "@/shared/types/dataView.types";
import {
  FilterIcon,
  SortIcon,
} from "@/features/home/components/server/icons/HomeIcons";
import { cn } from "@/shared/lib/util";
import { FilterRenderer } from "../../filter/FilterRenderer";

type Props<TItem> = ComponentProps<"div"> & {
  config: DataViewConfig<TItem>;
  metadata: DataViewMetadata;
};

export default function SearchToolModal<TItem>({
  config,
  metadata,
  className,
  ...props
}: Props<TItem>) {
  return (
    <div
      className={cn(
        "w-72 p-2 h-[70vh] overflow-x-visible flex flex-col justify-start gap-3 rounded-lg border border-Outline/70 bg-SurfaceContainerLowest",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2.5">
        <TabBadge label="filter" icon={<FilterIcon />} selected />
        <TabBadge label="sort" icon={<SortIcon />} />
      </div>
      <div className="w-full min-h-px bg-Outline/40" />
      <div className="flex flex-col gap-5 pb-5 flex-1 w-full overflow-auto scrollbar-none">
        {config.fields
          .filter((column) => column.filterable !== false)
          .map((column) => (
            <FilterRenderer
              key={column.fieldId}
              column={column}
              options={metadata.optionsByFieldId[column.fieldId] ?? []}
            />
          ))}
      </div>
    </div>
  );
}
