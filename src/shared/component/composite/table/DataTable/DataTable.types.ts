import type { Column, Header, Table } from "@tanstack/react-table";
import type {
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
} from "react";
import type { DataFieldConfig, DataViewConfig } from "../../../../types/dataView.types";
import { FilterCondition } from "@/shared/service/dataPipeline/filterDefinition";
// import type { FilterCondition } from "@/features/table/type";

export type DataTableProps<TItem> = {
  table: Table<TItem>;
  config: DataViewConfig<TItem>;
  className?: string;
  onRowClick?: (
    item: TItem,
    event: ReactMouseEvent<HTMLDivElement>,
  ) => void;
  onRowDoubleClick?: (
    item: TItem,
    event: ReactMouseEvent<HTMLDivElement>,
  ) => void;
  isRowActive?: (item: TItem) => boolean;
  isRowHoverable?: boolean;
  bgColor?: string;
};

export type DataTablePresenterProps<TItem> = DataTableProps<TItem> & {
  resized: boolean;
  hoveredResizeColumnId: string | null;
  focusedResizeColumnId: string | null;
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
    event:
      | ReactMouseEvent<HTMLButtonElement>
      | ReactTouchEvent<HTMLButtonElement>,
  ) => void;
  onResizeHoverChange: (columnId: string, hovered: boolean) => void;
  onResizeFocusChange: (columnId: string, focused: boolean) => void;
  onSort: (column: Column<TItem>) => void;
  bgColor: string;
};

export type TableFilterButtonGroupPresenterProps<TItem> =
  DataTableProps<TItem> & {
    openedId: string | null;
    onClose: () => void;
    onToggle: (columnId: string) => void;
  };

export type TableColumnFilterProps<TItem> = {
  column: Column<TItem>;
  config: DataFieldConfig<TItem>;
  onClose?: () => void;
};

export type TableColumnFilterPresenterProps<TItem> =
  TableColumnFilterProps<TItem> & {
    currentValue: FilterCondition | undefined;
    onClear: () => void;
    onEnumValueToggle: (value: string) => void;
    onInputChange: (value: string) => void;
  };
