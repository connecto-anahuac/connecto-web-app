"use client";

import type { Column, Header, Table } from "@tanstack/react-table";
import { useState, type MouseEvent as ReactMouseEvent } from "react";
import type { DataViewColumn, DataViewConfig } from "../dataView.types";
import type { FilterValue } from "./DataTable.types";
import { getSortIcon } from "@/components/icon/sorts/util";
import { IconName } from "@/components/icon";

export function useDataTable<TItem>(table: Table<TItem>) {
  const [resized, setResized] = useState(false);
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
    event: ReactMouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();
    setResized(true);
    header.getResizeHandler()(event);
  };

  const handleSort = (column: Column<TItem>) => {
    column.toggleSorting(column.getIsSorted() === "asc");
  };

  return {
    resized,
    preferredTotal,
    openMenuId,
    openFilterId,
    onFilterClose: () => setOpenFilterId(null),
    onFilterToggle: handleFilterToggle,
    onHide: (column: Column<TItem>) => column.toggleVisibility(false),
    onMenuOpenChange: handleMenuOpenChange,
    onPin: handlePin,
    onResize: handleResize,
    onSort: handleSort,
  };
}



export function getColumnConfig<TItem>(
  config: DataViewConfig<TItem>,
  id: string,
) {
  return config.columns.find((column) => column.id === id);
}

export function getTableSortIcon<TItem>(
  column: Column<TItem>,
  config: DataViewColumn<TItem>,
):IconName {
  const sorting = column.getIsSorted();
  if (!sorting) return getSortIcon("asc", config.valueType);
  return getSortIcon(sorting, config.valueType);
}
