import SelectBoxUnfill from "@/components/select-box/SelectBoxUnfill";

import { FilterCard } from "./filter/FilterCard";
import { FilterSearchInput } from "./filter/FilterSearchInput";
import {
  FilterDefinition,
  operators,
  operatorTextLabels,
} from "../shared/filter-definition";
import CloseButton from "@/components/button/CloseButton";
import { FilterMetadata } from "../shared/filter-metadata";
import IconWithText from "@/components/IconWithText";
import SelectMenu from "@/components/selectMenu";
import { useSelectBox } from "@/components/select-box/hooks";

// function CloseIcon() {
//   return (
//     <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="size-4">
//       <path
//         d="M4.46967 4.46967C4.76256 4.17678 5.23744 4.17678 5.53033 4.46967L8 6.93934L10.4697 4.46967C10.7626 4.17678 11.2374 4.17678 11.5303 4.46967C11.8232 4.76256 11.8232 5.23744 11.5303 5.53033L9.06066 8L11.5303 10.4697C11.8232 10.7626 11.8232 11.2374 11.5303 11.5303C11.2374 11.8232 10.7626 11.8232 10.4697 11.5303L8 9.06066L5.53033 11.5303C5.23744 11.8232 4.76256 11.8232 4.46967 11.5303C4.17678 11.2374 4.17678 10.7626 4.46967 10.4697L6.93934 8L4.46967 5.53033C4.17678 5.23744 4.17678 4.76256 4.46967 4.46967Z"
//         fill="currentColor"
//       />
//     </svg>
//   );
// }

export function MultiSelectFilter<TItem>({
  filter,
  filterMetadata,
}: {
  filter: FilterDefinition<TItem>;
  filterMetadata: FilterMetadata;
}) {
  if (filter.inputType !== "option") {
    return null;
  }
  const isMulti = true;
  const options = filter.options.map((option) => ({
    label: option.label,
    value: String(option.value),
  }));
  const defaultValue = null; // options.map((option) => String(option.value));

  const {
    // isOpen,
    hoveredIndex,
    selectedLabel,
    // toggleMenu,
    setHoveredIndex,
    isSelected,
    selectValue,
    containerRef,
  } = useSelectBox({
    isMulti,
    options,
    defaultValue,
  });

  return (
    <FilterCard
      aria-label={`${filter.label} filter`}
      header={
        <div className="flex items-center gap-1 text-OnSurface">
          {filterMetadata.icon ? (
            <IconWithText
              label={filterMetadata.label}
              icon={filterMetadata.icon}
            />
          ) : (
            <span className="text-xs leading-none font-medium text-OnSurfaceVariant">
              {filter.label}
            </span>
          )}

              <SelectBoxUnfill
                  className="text-sm"
                //   label={operatorTextLabels["eq"]}
                  defaultValue={operators[0]}
            isMulti={false}
            options={filter.operators.map((option) => ({
              label: operatorTextLabels[option] || option,
              value: String(option),// operatorTextLabels[option] || option,//
            }))}
          />
        </div>
      }
      trailingAction={<CloseButton />}
    >
      <FilterSearchInput
        aria-label={filter.label}
        defaultValue="Busacar filtros"
      />

      {/* <SelectBoxUnfill
        label={filter.label}
        isMulti
        options={filter.options.map((option) => ({
          label: option.label,
          value: String(option.value),
        }))}
          /> */}
      <SelectMenu
        isMulti={isMulti}
        hoveredIndex={hoveredIndex}
        selectedValues={options
          .filter((option) => isSelected(option.value))
          .map((option) => option.value)}
        onHoverItem={setHoveredIndex}
        onSelectItem={selectValue}
        isOpen={true}
        className="p-0 border-0 bg-transparent"
        options={options}
      />
    </FilterCard>
  );
}
