import TabBadge from "@/components/TabBadge";
import {
  FilterIcon,
  SortIcon,
} from "@/features/home/components/server/icons/HomeIcons";
import { ComponentProps } from "react";
import { FilterCard } from "../filter/FilterCard";
import { STUDENT_FILTER_METADATA } from "../../shared/filter-metadata";
import { FilterDefinition, operators } from "../../shared/filter-definition";
import { MultiSelectFilter } from "../MultiselectFilter";

type Props = ComponentProps<"div"> & {};
export default function SearchToolModal({}: Props) {
  
  return (
    <div className="w-64 p-20 flex flex-col gap-3 rounded-2xl border border-Outline/70 bg-SurfaceContainerLowest">
      <div className="flex items-center gap-2.5">
        <TabBadge label={"filter"} icon={<FilterIcon />} />
        <TabBadge label={"sort"} icon={<SortIcon />} />
      </div>
      <div className="w-full h-px bg-Outline/40" />
      {Object.values(STUDENT_FILTER_METADATA).map((filterMetadata) => {
        const filter: FilterDefinition<string> = {
          key: filterMetadata.label,
          label: filterMetadata.label,
          editor: filterMetadata.editor,
          valueType: filterMetadata.valueType,
          inputType: filterMetadata.inputType,
          operators: filterMetadata.operators,
          getValue: () => null,
          options: filterMetadata.options 
        };
        return (
          <MultiSelectFilter
            key={filterMetadata.label}
            filterMetadata={filterMetadata}
            filter={filter}
          />
        );
      })}
    </div>
  );
}
