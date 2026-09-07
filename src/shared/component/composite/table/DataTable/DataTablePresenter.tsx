import {
  flexRender,
  type Column,
} from "@tanstack/react-table";
import type { MouseEvent as ReactMouseEvent } from "react";
// import { TanstackFilterButtonGroup } from "@/components/button/TanstackFilterButtonGroup";
import Cell from "../Cell";
import HeaderCell from "../header";
import IconButton from "@/shared/component/primitive/button/IconButton";
import { Icons } from "@/shared/component/primitive/icon";
import { cn } from "@/shared/lib/util";
import { TableColumnFilterContainer } from "./TableColumnFilterContainer";
import type {
  DataTablePresenterProps,
  TableFilterButtonGroupPresenterProps,
} from "./DataTable.types";
import { getColumnConfig, getTableSortIcon } from "./useDataTable";
import type { DataFieldConfig } from "../../../../types/dataView.types";

export function getFormattedCellTitle<TItem>(
  config: DataTablePresenterProps<TItem>["config"],
  columnId: string,
  row: TItem,
) {
  return getColumnConfig(config, columnId)?.format(row) ?? "";
}

const rowInteractionIgnoreSelector =
  'a, button, input, select, textarea, [role="button"], [role="link"], [data-row-interaction="ignore"]';

export function isRowInteractionIgnored(target: EventTarget | null) {
  return (
    target !== null &&
    typeof (target as Element).closest === "function" &&
    (target as Element).closest(rowInteractionIgnoreSelector) !== null
  );
}

// type ColumnActionsProps<TItem> = {
//   column: Column<TItem>;
//   config: DataViewColumn<TItem>;
//   compact: boolean;
//   menuOpen: boolean;
//   filterOpen: boolean;
//   onFilterClose: () => void;
//   onFilterToggle: (columnId: string) => void;
//   onHide: (column: Column<TItem>) => void;
//   onMenuOpenChange: (columnId: string, open: boolean) => void;
//   onPin: (column: Column<TItem>) => void;
//   onSort: (column: Column<TItem>) => void;
// };

// function ColumnActions<TItem>({
//   column,
//   config,
//   compact,
//   menuOpen,
//   filterOpen,
//   onFilterClose,
//   onFilterToggle,
//   onHide,
//   onMenuOpenChange,
//   onPin,
//   onSort,
// }: ColumnActionsProps<TItem>) {
//   const isPinned = column.getIsPinned() === "left";
//   const controls = (
//     <>
//       <IconButton
//         aria-label={`${config.label}を左に固定`}
//         appearance="text"
//         icon="pin"
//         intent="lightInk"
//         onClick={(event) => {
//           event.stopPropagation();
//           onPin(column);
//         }}
//         size="md"
//       />
//       {config.filterable !== false && (
//         <IconButton
//           aria-label={`${config.label}をフィルター`}
//           appearance="text"
//           icon="filter"
//           intent="lightInk"
//           onClick={(event) => {
//             event.stopPropagation();
//             onFilterToggle(column.id);
//           }}
//           size="md"
//         />
//       )}
//       <IconButton
//         aria-label={`${config.label}を非表示`}
//         appearance="text"
//         icon="unvisible"
//         intent="lightInk"
//         onClick={(event) => {
//           event.stopPropagation();
//           onHide(column);
//         }}
//         size="md"
//       />
//     </>
//   );

//   return (
//     <div
//       className="relative flex shrink-0 items-center"
//       onClick={(event) => event.stopPropagation()}
//     >
//       {compact ? (
//         <IconButton
//           aria-expanded={menuOpen}
//           aria-haspopup="menu"
//           aria-label={`${config.label}のメニュー`}
//           appearance="text"
//           icon="threePointMenu"
//           intent="lightInk"
//           onClick={() => onMenuOpenChange(column.id, !menuOpen)}
//           size="md"
//         />
//       ) : (
//         <div className="flex items-center gap-0.5">{controls}</div>
//       )}
//       <IconButton
//         aria-label={`${config.label}をソート`}
//         appearance="text"
//         icon={getTableSortIcon(column, config)}
//         intent="lightInk"
//         onClick={() => onSort(column)}
//         size="md"
//       />

//       {menuOpen && (
//         <div
//           className="absolute right-0 top-9 z-30 flex min-w-48 flex-col rounded-md border border-Outline bg-InverseSurface p-1 text-InverseOnSurface shadow-lg"
//           role="menu"
//         >
//           <button
//             className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-Primary hover:text-OnPrimary"
//             onClick={() => onPin(column)}
//             type="button"
//           >
//             <Icons.pin className="size-4" />
//             {isPinned ? "Quitar pivot" : "Pivot a la izquierda"}
//           </button>
//           {config.filterable !== false && (
//             <button
//               className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-Primary hover:text-OnPrimary"
//               onClick={() => onFilterToggle(column.id)}
//               type="button"
//             >
//               <Icons.filter className="size-4" />
//               Filtrar
//             </button>
//           )}
//           <button
//             className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-Primary hover:text-OnPrimary"
//             onClick={() => onHide(column)}
//             type="button"
//           >
//             <Icons.unvisible className="size-4" />
//             Ocultar
//           </button>
//         </div>
//       )}
//       {filterOpen && config.filterable !== false && (
//         <div className="absolute right-0 top-9 z-40">
//           <TableColumnFilterContainer
//             column={column}
//             config={config}
//             onClose={onFilterClose}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

export function DataTablePresenter<TItem>({
  table,
  config,
  className,
  onRowClick,
  onRowDoubleClick,
  isRowActive,
  isRowHoverable,
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
}: DataTablePresenterProps<TItem>) {
  return (
    <div className={cn("h-full w-full overflow-auto rounded-md",
    // isResizing&&"cursor-col-resize",
      className)}>
      <div
        className="min-w-max relative"
        role="table"
        style={{ minWidth: preferredTotal }}
      >
        {/* HEADER */}
        {table.getHeaderGroups().map((headerGroup) => (
          <div
            className="flex sticky top-0 z-40"
            key={headerGroup.id}
            role="row"
          >
            {headerGroup.headers.map((header) => {
              const column = header.column;
              const columnConfig = getColumnConfig(config, column.id);
              if (!columnConfig) return null;
              const title =
                typeof column.columnDef.header === "string"
                  ? column.columnDef.header
                  : columnConfig.label;
              const size = column.getSize();
              const pinned = column.getIsPinned() === "left";
              const open = openMenuId === column.id;
              const openFilter = openFilterId === column.id;
              const canResize = header.column.getCanResize();
              const isResizeBoundaryHighlighted =
                hoveredResizeColumnId === column.id ||
                focusedResizeColumnId === column.id ||
                column.getIsResizing();
              return (
                <HeaderCell<TItem>
                  icon={columnConfig.icon}
                  label={title}
                  column={column}
                  config={columnConfig}
                  // openMenuId={openMenuId}
                  // openFilterId={openFilterId}
                  // onFilterClose={onFilterClose}
                  // onFilterToggle={onFilterToggle}
                  onHide={onHide}
                  // onMenuOpenChange={onMenuOpenChange}
                  onPin={onPin}
                  isResizing={column.getIsResizing()}
                  isResizeBoundaryHighlighted={isResizeBoundaryHighlighted}
                  onResize={
                    canResize ? (event) => onResize(header, event) : undefined
                  }
                  onResizeHoverChange={
                    canResize
                      ? (hovered) => onResizeHoverChange(column.id, hovered)
                      : undefined
                  }
                  onResizeFocusChange={
                    canResize
                      ? (focused) => onResizeFocusChange(column.id, focused)
                      : undefined
                  }
                  onSort={onSort}
                  className={cn(pinned && "sticky z-20 ")}
                  style={{
                    width: size,
                    minWidth: size,
                    left: pinned ? column.getStart("left") : undefined,
                  }}
                  key={header.id}
                  role="columnheader"
                  // menuOpen={open}
                  // filterOpen={openFilter}
                />
              );
            })}
          </div>
        ))}

        {/* Table body */}
        {table.getRowModel().rows.map((row) => {
          const rowIsInteractive = Boolean(onRowClick || onRowDoubleClick);
          const rowIsActive = isRowActive?.(row.original) ?? false;

          return (
            <div
              aria-selected={rowIsActive}
              className={cn(
                "flex",
                rowIsInteractive && "cursor-pointer",
                isRowHoverable && "hover:bg-DividerLow","hover:bg-red-600",
                rowIsActive && "bg-Primary/10",
              )}
              key={row.id}
              onClick={(event) => {
                if (!isRowInteractionIgnored(event.target)) {
                  onRowClick?.(row.original, event);
                }
              }}
              onDoubleClick={(event) => {
                if (!isRowInteractionIgnored(event.target)) {
                  onRowDoubleClick?.(row.original, event);
                }
              }}
              onKeyDown={(event) => {
                if (
                  (event.key === "Enter" || event.key === " ") &&
                  !isRowInteractionIgnored(event.target)
                ) {
                  event.preventDefault();
                  onRowClick?.(
                    row.original,
                    event as unknown as ReactMouseEvent<HTMLDivElement>,
                  );
                }
              }}
              role="row"
              tabIndex={rowIsInteractive ? 0 : undefined}
            >
              {row.getVisibleCells().map((cell) => {
                const column = cell.column;
                const pinned = column.getIsPinned() === "left";
                const isResizeBoundaryHighlighted =
                  hoveredResizeColumnId === column.id ||
                  focusedResizeColumnId === column.id ||
                  column.getIsResizing();
                return (
                  <Cell
                    className={cn(
                      "relative",
                      // isResizeBoundaryHighlighted &&
                      //   "after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:translate-x-1/2  after:z-20 after:w-0.5 after:bg-Primary",
                      pinned && "sticky z-10",
                    )}
                    key={cell.id}
                    role="cell"
                    style={{
                      width: column.getSize(),
                      minWidth: column.getSize(),
                      left: pinned ? column.getStart("left") : undefined,
                    }}
                    title={getFormattedCellTitle(config, column.id, row.original)}
                  >
                    {flexRender(column.columnDef.cell, cell.getContext())}
                  </Cell>
                );
              })}
            </div>
          );
        })}

        {/* table no exists */}
        {!table.getRowModel().rows.length && (
          <div className="p-4 text-sm text-OnSurfaceVariant">
            No hay registros.
          </div>
        )}
      </div>
      {resized && (
        <span aria-live="polite" className="sr-only" role="status">
          Columnas redimensionadas
        </span>
      )}
    </div>
  );
}

// export function TableFilterButtonGroupPresenter<TItem>({
//   table,
//   config,
//   className,
// }: TableFilterButtonGroupPresenterProps<TItem>) {
//   return (
//     <TanstackFilterButtonGroup
//       className={className}
//       config={config}
//       table={table}
//     />
//   );
// }
