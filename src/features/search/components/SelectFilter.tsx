import SelectBoxUnfill from "@/components/select-box/SelectBoxUnfill";

import { FilterDefinition } from "../shared/filter-definition";

export function SelectFilter<TItem>({
  filter,
}: {
  filter: FilterDefinition<TItem>;
}) {
  if (filter.inputType !== "option") {
    return null;
  }

  return (
    <SelectBoxUnfill
      aria-label={filter.label}
      label={filter.label}
      options={filter.options.map((option) => ({
        label: option.label,
        value: String(option.value),
      }))}
    />
  );
}