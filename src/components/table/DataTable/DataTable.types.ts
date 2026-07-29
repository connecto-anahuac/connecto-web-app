import type { Column, Header, Table } from "@tanstack/react-table";
import type { MouseEvent as ReactMouseEvent } from "react";
import type { DataViewColumn, DataViewConfig } from "../dataView.types";

export type DataTableProps<TItem> = {
  table: Table<TItem>;
  config: DataViewConfig<TItem>;
  className?: string;
};

export type FilterValue = string | number | string[] | undefined;

export type DataTablePresenterProps<TItem> = DataTableProps<TItem> & {
  resized: boolean;
  preferredTotal: number;
  openMenuId: string | null;
  openFilterId: string | null;
  onFilterClose: () => void;
  onFilterToggle: (columnId: string) => void;
  onHide: (column: Column<TItem>) => void;
  onMenuOpenChange: (columnId: string, open: boolean) => void;
  onPin: (column: Column<TItem>) => void;
  onResize: (
    header: Header<TItem, unknown>,
    event: ReactMouseEvent<HTMLButtonElement>,
  ) => void;
  onSort: (column: Column<TItem>) => void;
};

export type TableFilterButtonGroupPresenterProps<TItem> =
  DataTableProps<TItem> & {
    openedId: string | null;
    onClose: () => void;
    onToggle: (columnId: string) => void;
  };

export type TableColumnFilterProps<TItem> = {
  column: Column<TItem>;
  config: DataViewColumn<TItem>;
  onClose?: () => void;
};

export type TableColumnFilterPresenterProps<TItem> =
  TableColumnFilterProps<TItem> & {
    currentValue: FilterValue;
    onClear: () => void;
    onEnumValueToggle: (value: string) => void;
    onInputChange: (value: string) => void;
  };
