"use client";

import type { ComponentPropsWithRef } from "react";
import type { IconName } from "@/components/icon";
import type { FilterDefinition } from "../../../shared/filterDefinition";
import { MultiselectFilterPresenter } from "./MultiselectFilterPresenter";
import { useMultiselectFilter } from "./useMultiselectFilter";

type Props<TItem> = {
  filter: FilterDefinition<TItem>;
  icon?: IconName;
} & ComponentPropsWithRef<"section">;

export function MultiSelectFilter<TItem>({
  filter,
  icon,
  ...props
}: Props<TItem>) {
  const multiselectFilter = useMultiselectFilter(filter);

  if (filter.inputType !== "option") {
    return null;
  }

  return (
    <MultiselectFilterPresenter
      {...props}
      filter={filter}
      icon={icon}
      {...multiselectFilter}
    />
  );
}
