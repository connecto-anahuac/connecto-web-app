"use client";

import type { Column, Header, Table } from "@tanstack/react-table";
import {
  useState,
  type MouseEvent as ReactMouseEvent,
  type TouchEvent as ReactTouchEvent,
} from "react";
import type { DataFieldConfig, DataViewConfig } from "../../../../types/dataView.types";
import { getSortIcon } from "@/shared/component/primitive/icon/sorts/util";
import { IconName } from "@/shared/component/primitive/icon";

export function useDataTable<TItem>(table: Table<TItem>) {
  const [resized, setResized] = useState(false);
  const [hoveredResizeColumnId, setHoveredResizeColumnId] = useState<
    string | null
  >(null);
  const [focusedResizeColumnId, setFocusedResizeColumnId] = useState<
    string | null
  >(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [openFilterId, setOpenFilterId] = useState<string | null>(null);
  const preferredTotal = table
    .getVisibleLeafColumns()
    .reduce((total, column) => total + column.getSize(), 0);

  const handleFilterToggle = (columnId: string) => {
    setOpenMenuId(null);
    setOpenFilterId((currentId) =>
      currentId === columnId ? null : columnId,
    );
  };

  const handleMenuOpenChange = (columnId: string, open: boolean) => {
    setOpenMenuId(open ? columnId : null);
  };

  const handlePin = (column: Column<TItem>) => {
    column.pin(column.getIsPinned() === "left" ? false : "left");
  };

  const handleResize = (
    header: Header<TItem, unknown>,
    event:
      | ReactMouseEvent<HTMLButtonElement>
      | ReactTouchEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();
    setResized(true);
    header.getResizeHandler()(event);
  };

  const handleResizeHoverChange = (
    columnId: string,
    hovered: boolean,
  ) => {
    setHoveredResizeColumnId((currentColumnId) => {
      if (hovered) return columnId;
      return currentColumnId === columnId ? null : currentColumnId;
    });
  };

  const handleResizeFocusChange = (columnId: string, focused: boolean) => {
    setFocusedResizeColumnId((currentColumnId) => {
      if (focused) return columnId;
      return currentColumnId === columnId ? null : currentColumnId;
    });
  };

  const handleSort = (column: Column<TItem>) => {
    column.toggleSorting(column.getIsSorted() === "asc");
  };

  return {
    resized,
    hoveredResizeColumnId,
    focusedResizeColumnId,
    preferredTotal,
    openMenuId,
    openFilterId,
    onFilterClose: () => setOpenFilterId(null),
    onFilterToggle: handleFilterToggle,
    onHide: (column: Column<TItem>) => column.toggleVisibility(false),
    onMenuOpenChange: handleMenuOpenChange,
    onPin: handlePin,
    onResize: handleResize,
    onResizeHoverChange: handleResizeHoverChange,
    onResizeFocusChange: handleResizeFocusChange,
    onSort: handleSort,
  };
}



export function getColumnConfig<TItem>(
  config: DataViewConfig<TItem>,
  id: string,
) {
  return config.fields.find((column) => column.fieldId === id);
}

export function getTableSortIcon<TItem>(
  column: Column<TItem>,
  config: DataFieldConfig<TItem>,
):IconName {
  const sorting = column.getIsSorted();
  if (!sorting) return getSortIcon("asc", config.valueType);
  return getSortIcon(sorting, config.valueType);
}
