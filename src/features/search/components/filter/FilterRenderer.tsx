import type { ComponentPropsWithRef, ReactNode } from "react";
import { DateFilter } from "./DateFilter";
import { MultiSelectFilter } from "./MultiselectFilter";
import { NumberFilter } from "./NumberFilter";
import { SelectFilter } from "./SelectFilter";
import { TextFilter } from "./TextFilter";
import { FilterDefinition } from "../../shared/filter-definition";
import { IconName } from "@/components/icon";

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

    case "enum":
      return <MultiSelectFilter filter={filter} icon={icon} {...props} />;

    case "date":
      return <DateFilter filter={filter} icon={icon} {...props} />;
  }
}