import { FilterDefinition } from "../../shared/filter-definition";

export function DateFilter<TItem>({
  filter,
}: {
  filter: FilterDefinition<TItem>;
}) {
  return (
    <input
      aria-label={filter.label}
      type="date"
    />
  );
}