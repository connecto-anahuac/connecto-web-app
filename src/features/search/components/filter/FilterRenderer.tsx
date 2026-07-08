import { DateFilter } from "./DateFilter";
import { MultiSelectFilter } from "../MultiselectFilter";
import { NumberFilter } from "./NumberFilter";
import { SelectFilter } from "../SelectFilter";
import { TextFilter } from "./TextFilter";
import { FilterDefinition } from "../../shared/filter-definition";

export function FilterRenderer<TItem>({
  filter,
}: {
  filter: FilterDefinition<TItem>;
}) {
  switch (filter.editor) {
    case "text":
      return (
        <TextFilter
          filter={filter}
        />
      );

    case "number":
      return (
        <NumberFilter
          filter={filter}
        />
      );

    case "select":
      return (
        <SelectFilter
          filter={filter}
        />
      );

    case "multiSelect":
      return (
        <MultiSelectFilter
          filter={filter}
        />
      );

    case "date":
      return (
        <DateFilter
          filter={filter}
        />
      );
  }
}