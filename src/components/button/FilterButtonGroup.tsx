"use client";

import { useState, type ComponentProps } from "react";
import { cn } from "@/shared/lib/util";
import { FilterDefinition } from "@/features/search/shared/filterDefinition";
import FilterButton from "./FilterButton";
import Button from "./Button";

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
          // icon={} //TODO icon
          key={definition.key}
          definition={definition}
          open={openedKey === definition.key}
          onOpenChange={(open) => {
            setOpenedKey(open ? definition.key : null);
          }}
          label={definition.label}
        />
      ))}

      <Button
          icon="plus"
          label="Añadir"
          intent="darkInk"
          appearance="text"
        size="md"
        className="shrink-0"
      />
      
          {/* scroll margin */}
          <div className="w-4/5 shrink-0"/>
    </div>
  );
}
