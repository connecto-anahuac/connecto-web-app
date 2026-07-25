"use client";

import { useState, type ComponentProps } from "react";
import { cn } from "@/shared/lib/util";
import { IconName, Icons } from "../icon";
import { DisableProps, LoadableProps } from "@/shared/lib/cva";
import { ButtonVariantProps, buttonVariants } from "./button_cva";
import Button from "./Button";
import { FilterRenderer } from "@/features/search/components/filter/FilterRenderer";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from "@floating-ui/react";
import { getStudentFilterIcon } from "@/features/student/types/filter-metadata";
import { FilterDefinition } from "@/features/search/shared/filter-definition";
import FilterButton from "./FilterButton";

type Props<TItem> = ComponentProps<"div"> & {
  definitions: FilterDefinition<TItem>[];
};

export default function FilterButtonGroup<TItem>({
  className,
  definitions,
  ...props
}: Props<TItem>) {
  const [openedKey, setOpenedKey] = useState<string | null>(null);

  return (
    <div
      className={cn(
        "flex items-center min-w-0 gap-2   scrollbar-none",

        openedKey ? "overflow-x-hidden" : "overflow-x-auto",
        className,
      )}
      {...props}
    >
      {definitions.map((definition) => (
        <FilterButton
          icon={}
          key={definition.key}
          definition={definition}
          open={openedKey === definition.key}
          onOpenChange={(open) => {
            setOpenedKey(open ? definition.key : null);
          }}
          label={definition.label}
        />
      ))}
    </div>
  );
}
