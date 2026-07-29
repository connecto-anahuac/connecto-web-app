import type { ComponentPropsWithRef } from "react";
import { DateFilter } from "./DateFilter";
import { NumberFilter } from "./NumberFilter";
import { SelectFilter } from "./SelectFilter";
import { TextFilter } from "./TextFilter";
import { FilterDefinition } from "../../shared/filterDefinition";
import { IconName } from "@/components/icon";
import { MultiSelectFilter } from "./multiselector/MultiselectFilter";

type Props<TItem> = ComponentPropsWithRef<"section"> & {
  
  filter: FilterDefinition<TItem>;
  icon?: IconName;
};

export function FilterRenderer<TItem>({
  filter,
  icon,
  ...props
}: Props<TItem>) {
  switch (filter.editor) {
    case "text":
      return <TextFilter filter={filter} icon={icon} {...props} />;

    case "number":
      return <NumberFilter filter={filter} icon={icon} {...props} />;

    case "select":
      return <SelectFilter filter={filter} icon={icon} {...props} />;

    case "multiSelect":
      return <MultiSelectFilter filter={filter} icon={icon} {...props} />;

    case "date":
      return <DateFilter filter={filter} icon={icon} {...props} />;
  }
}
