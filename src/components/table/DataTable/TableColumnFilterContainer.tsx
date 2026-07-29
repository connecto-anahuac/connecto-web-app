"use client";

import { TableColumnFilterPresenter } from "./TableColumnFilterPresenter";
import type { TableColumnFilterProps } from "./DataTable.types";
import { useTableColumnFilter } from "./useTableColumnFilter";

export function TableColumnFilterContainer<TItem>({
  column,
  config,
  onClose,
  ...props
}: TableColumnFilterProps<TItem>) {
  const filter = useTableColumnFilter(column, config, onClose);

  return (
    <TableColumnFilterPresenter
      column={column}
      config={config}
      onClose={onClose}
      {...filter}
      {...props}
    />
  );
}
