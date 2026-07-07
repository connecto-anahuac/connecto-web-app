import { FilterDefinition } from "../shared/filter-definition";

function FilterRenderer({
  filter,
}: {
  filter: FilterDefinition;
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