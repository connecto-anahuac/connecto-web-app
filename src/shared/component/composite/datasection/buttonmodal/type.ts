import type { Table } from "@tanstack/react-table";
import type { DataViewConfig } from "@/shared/types/dataView.types";

export type SearchTool = "sort" | "filter" | "pivot" | "hide";

export type ColumnToolButtonModalProps<TItem> = {
  open: boolean;
  onOpenChange: () => void;
  disabled: boolean;
  table?: Table<TItem>;
  tableConfig?: DataViewConfig<TItem>;
  hasBadge?: boolean;
};
