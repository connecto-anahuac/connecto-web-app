"use client";

import {
  DataTablePresenter,
  TableFilterButtonGroupPresenter,
} from "./DataTablePresenter";
import type { DataTableProps } from "./DataTable.types";
import {
  useDataTable,
  useTableFilterButtonGroup,
} from "./useDataTable";

export function DataTableContainer<TItem>({
  table,
  config,
  className,
}: DataTableProps<TItem>) {
  const {
      resized,
      preferredTotal,
      openMenuId,
      openFilterId,
      onFilterClose,
      onFilterToggle,
      onHide,
      onMenuOpenChange,
      onPin,
      onResize,
      onSort,
    } = useDataTable(table);

  return (
    <DataTablePresenter
      className={className}
      config={config}
      table={table}
      resized={resized}
      preferredTotal={preferredTotal}
      openMenuId={openMenuId}
      openFilterId={openFilterId}
      onFilterClose={onFilterClose}
      onFilterToggle={onFilterToggle}
      onHide={onHide}
      onMenuOpenChange={onMenuOpenChange}
      onPin={onPin}
      onResize={onResize}
      onSort={onSort}
    />
  );
}

export function TableFilterButtonGroupContainer<TItem>({
  table,
  config,
  className,
}: DataTableProps<TItem>) {
  const filterButtonGroup = useTableFilterButtonGroup();

  return (
    <TableFilterButtonGroupPresenter
      className={className}
      config={config}
      table={table}
      {...filterButtonGroup}
    />
  );
}
