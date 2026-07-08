import { FilterDefinition } from "../../shared/filter-definition";

export function NumberFilter<TItem>({
  filter,
}: {
  filter: FilterDefinition<TItem>;
}) {
  return (
    <input
      aria-label={filter.label}
      placeholder={filter.label}
      type="number"
    />
  );
}