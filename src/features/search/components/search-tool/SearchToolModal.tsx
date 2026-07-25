import TabBadge from "@/components/TabBadge";
import {
  FilterIcon,
  SortIcon,
} from "@/features/home/components/server/icons/HomeIcons";
import { ComponentProps } from "react";
import { FilterRenderer } from "../filter/FilterRenderer";
import { getStudentFilterIcon } from "../../../student/types/filter-metadata";
import { FilterDefinition } from "../../shared/filter-definition";
import { cn } from "@/shared/lib/util";

type Props<TItem> = ComponentProps<"div"> & {
  definitions: FilterDefinition<TItem>[];
};

export default function SearchToolModal<TItem>({
  definitions,
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
      {/* <div className="flex flex-col  gap-3 sticky top-0 z-20"> */}
        <div className="flex items-center gap-2.5 ">
              <TabBadge label={"filter"} icon={<FilterIcon />} selected={true} />
          <TabBadge label={"sort"} icon={<SortIcon />} />
        </div>
        <div className="w-full  min-h-px bg-Outline/40" />
      {/* </div> */}
      <div className="flex flex-col gap-5 pb-5 flex-1 w-full   overflow-auto scrollbar-none">
        {definitions.map((definition) => (
          <FilterRenderer
            key={definition.key}
            filter={definition}
            icon={getStudentFilterIcon(definition.key)}
          />
        ))}
      </div>
    </div>
  );
}
