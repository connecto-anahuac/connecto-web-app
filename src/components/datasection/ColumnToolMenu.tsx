import { Column } from "@tanstack/react-table";
import { ComponentPropsWithRef } from "react";
import { IconName, Icons } from "../icon";
import { DataViewConfig } from "../table/dataView.types";

type ColumnToolMenuProps<TItem> = ComponentPropsWithRef<"div">&{
  
  columns: Column<TItem, unknown>[];
  config: DataViewConfig<TItem>;
  onChoice: (column: Column<TItem, unknown>) => void;
  value: (column: Column<TItem, unknown>) => boolean;
  visibleIcon: IconName;
  hiddenIcon: IconName;
}


//TODO 一般化！！
export function ColumnToolMenu<TItem>({
  columns,
  config,
  onChoice,
  value,
  visibleIcon,
  hiddenIcon,
  ...props
}:ColumnToolMenuProps<TItem>) { 
  // absolute left-0 top-9 z-40
  return (
    <div  className=" flex min-w-56 flex-col rounded-md border border-Outline bg-InverseSurface p-1 text-InverseOnSurface shadow-lg"
    {...props}>
      {columns.map((column) => {
        //TODO 配列、型問題ない？
        const entry = config.fields.find((item) => item.fieldId === column.id);
        if (!entry) return null;
        const Icon = value(column) ? Icons[visibleIcon] : Icons[hiddenIcon];
        return (
          <button
            className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-Primary hover:text-OnPrimary"
            key={column.id}
            onClick={() => onChoice(column)}
            type="button"
          >
            <Icon className="size-4" /> {entry.label}
          </button>
        );
      })}
    </div>
  );
}
