"use client";

import type { ReactNode } from "react";
import { DataTable } from "@/shared/component/composite/table/DataTable";
import type { DataTableProps } from "@/shared/component/composite/table/DataTable/DataTable.types";
import IconButton from "@/shared/component/primitive/button/IconButton";
import PanelControllButton from "@/shared/component/primitive/button/PanelControllButton";
import { cn } from "@/shared/lib/util";

export type DataTableWithPreviewProps<TItem> = Omit<
  DataTableProps<TItem>,
  "onRowClick" | "onRowDoubleClick" | "isRowActive"
> & {
  selectedRowId?: string;
  getRowId: (item: TItem) => string;
  onRowSelect: (id: string) => void;
  onRowOpen: (id: string) => void;
  onPreviewClose: () => void;
  renderPreview: (id: string) => ReactNode;
  previewAriaLabel: string;
  openDetailAriaLabel: string;
  closePreviewAriaLabel: string;
  panelClassName?: string;
};

export function DataTableWithPreview<TItem>({
  selectedRowId,
  getRowId,
  onRowSelect,
  onRowOpen,
  onPreviewClose,
  renderPreview,
  previewAriaLabel,
  openDetailAriaLabel,
  closePreviewAriaLabel,
  panelClassName,
  ...tableProps
}: DataTableWithPreviewProps<TItem>) {
  return (
    <div className="relative h-full w-full">
      <DataTable
        {...tableProps}
        isRowActive={(item) => getRowId(item) === selectedRowId}
        onRowClick={(item) => onRowSelect(getRowId(item))}
        onRowDoubleClick={(item) => onRowOpen(getRowId(item))}
      />
      {selectedRowId && (
        <aside
          aria-label={previewAriaLabel}
          className={cn(
            "absolute inset-y-0 right-0 z-50 flex w-2/5 max-w-2xl flex-col gap-1 overflow-y-auto bg-SurfaceContainerLowest shadow-xl",
            panelClassName,
          )}
        >
          <div className="flex justify-between gap-1 p-2">
            <PanelControllButton
              aria-label={openDetailAriaLabel}
              appearance="text"
              intent="lightInk"
              isOpen
              onClick={() => onRowOpen(selectedRowId)}
              size="lg"
              type="button"
            />
            <IconButton
              aria-label={closePreviewAriaLabel}
              appearance="text"
              icon="close"
              intent="lightInk"
              onClick={onPreviewClose}
              size="lg"
              type="button"
            />
          </div>
          {renderPreview(selectedRowId)}
        </aside>
      )}
    </div>
  );
}
