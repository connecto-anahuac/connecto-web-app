"use client";

import {
  DataTablePresenter,
  // TableFilterButtonGroupPresenter,
} from "./DataTablePresenter";
import type { DataTableProps } from "./DataTable.types";
import {
  useDataTable,
} from "./useDataTable";

export function DataTableContainer<TItem>({
  table,
  config,
  className,
}: DataTableProps<TItem>) {
  const {
      resized,
      hoveredResizeColumnId,
      focusedResizeColumnId,
      preferredTotal,
      openMenuId,
      openFilterId,
      onFilterClose,
      onFilterToggle,
      onHide,
      onMenuOpenChange,
      onPin,
      onResize,
      onResizeHoverChange,
      onResizeFocusChange,
      onSort,
    } = useDataTable(table);

  return (
    <DataTablePresenter
      className={className}
      config={config}
      table={table}
      resized={resized}
      hoveredResizeColumnId={hoveredResizeColumnId}
      focusedResizeColumnId={focusedResizeColumnId}
      preferredTotal={preferredTotal}
      openMenuId={openMenuId}
      openFilterId={openFilterId}
      onFilterClose={onFilterClose}
      onFilterToggle={onFilterToggle}
      onHide={onHide}
      onMenuOpenChange={onMenuOpenChange}
      onPin={onPin}
      onResize={onResize}
      onResizeHoverChange={onResizeHoverChange}
      onResizeFocusChange={onResizeFocusChange}
      onSort={onSort}
    />
  );
}

// export function TableFilterButtonGroupContainer<TItem>({
//   table,
//   config,
//   className,
// }: DataTableProps<TItem>) {

//   return (
//     <TanstackFilterButtonGroup
//      className={className}
//    config={config}
//    table={table}
//     />
//   );
// }
