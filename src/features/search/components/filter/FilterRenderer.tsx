import type { ReactNode } from "react";
import { DateFilter } from "./DateFilter";
import { MultiSelectFilter } from "../MultiselectFilter";
import { NumberFilter } from "./NumberFilter";
import { SelectFilter } from "../SelectFilter";
import { TextFilter } from "./TextFilter";
import { FilterDefinition } from "../../shared/filter-definition";

export function FilterRenderer<TItem>({
  filter,
  icon,
}: {
  filter: FilterDefinition<TItem>;
  icon?: ReactNode;
}) {
  switch (filter.editor) {
    case "text":
      return <TextFilter filter={filter} icon={icon} />;

    case "number":
      return <NumberFilter filter={filter} icon={icon} />;

    case "select":
      return <SelectFilter filter={filter} icon={icon} />;

    case "enum":
      return <MultiSelectFilter filter={filter} icon={icon} />;

    case "date":
      return <DateFilter filter={filter} icon={icon} />;
  }
}