import { flexRender, type Column } from "@tanstack/react-table";
import Cell from "../Cell";
import HeaderCell from "../HeaderCell";
import IconButton from "@/components/button/IconButton";
import { Icons } from "@/components/icon";
import { cn } from "@/shared/lib/util";
import { TableColumnFilterContainer } from "./TableColumnFilterContainer";
import type {
  DataTablePresenterProps,
  TableFilterButtonGroupPresenterProps,
} from "./DataTable.types";
import { getColumnConfig, getSortIcon } from "./useDataTable";
import type { DataViewColumn } from "../dataView.types";

type ColumnActionsProps<TItem> = {
  column: Column<TItem>;
  config: DataViewColumn<TItem>;
  compact: boolean;
  menuOpen: boolean;
  filterOpen: boolean;
  onFilterClose: () => void;
  onFilterToggle: (columnId: string) => void;
  onHide: (column: Column<TItem>) => void;
  onMenuOpenChange: (columnId: string, open: boolean) => void;
  onPin: (column: Column<TItem>) => void;
  onSort: (column: Column<TItem>) => void;
};

function ColumnActions<TItem>({
  column,
  config,
  compact,
  menuOpen,
  filterOpen,
  onFilterClose,
  onFilterToggle,
  onHide,
  onMenuOpenChange,
  onPin,
  onSort,
}: ColumnActionsProps<TItem>) {
  const isPinned = column.getIsPinned() === "left";
  const controls = (
    <>
      <IconButton
        aria-label={`${config.label}を左に固定`}
        appearance="text"
        icon="pin"
        intent="lightInk"
        onClick={(event) => {
          event.stopPropagation();
          onPin(column);
        }}
        size="md"
      />
      {config.filterable !== false && (
        <IconButton
          aria-label={`${config.label}をフィルター`}
          appearance="text"
          icon="filter"
          intent="lightInk"
          onClick={(event) => {
            event.stopPropagation();
            onFilterToggle(column.id);
          }}
          size="md"
        />
      )}
      <IconButton
        aria-label={`${config.label}を非表示`}
        appearance="text"
        icon="unvisible"
        intent="lightInk"
        onClick={(event) => {
          event.stopPropagation();
          onHide(column);
        }}
        size="md"
      />
    </>
  );

  return (
    <div
      className="relative flex shrink-0 items-center"
      onClick={(event) => event.stopPropagation()}
    >
      {compact ? (
        <IconButton
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          aria-label={`${config.label}のメニュー`}
          appearance="text"
          icon="threePointMenu"
          intent="lightInk"
          onClick={() => onMenuOpenChange(column.id, !menuOpen)}
          size="md"
        />
      ) : (
        <div className="flex items-center gap-0.5">{controls}</div>
      )}
      <IconButton
        aria-label={`${config.label}をソート`}
        appearance="text"
        icon={getSortIcon(column, config)}
        intent="lightInk"
        onClick={() => onSort(column)}
        size="md"
      />

      {menuOpen && (
        <div
          className="absolute right-0 top-9 z-30 flex min-w-48 flex-col rounded-md border border-Outline bg-InverseSurface p-1 text-InverseOnSurface shadow-lg"
          role="menu"
        >
          <button
            className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-Primary hover:text-OnPrimary"
            onClick={() => onPin(column)}
            type="button"
          >
            <Icons.pin className="size-4" />
            {isPinned ? "Quitar pivot" : "Pivot a la izquierda"}
          </button>
          {config.filterable !== false && (
            <button
              className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-Primary hover:text-OnPrimary"
              onClick={() => onFilterToggle(column.id)}
              type="button"
            >
              <Icons.filter className="size-4" />
              Filtrar
            </button>
          )}
          <button
            className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-Primary hover:text-OnPrimary"
            onClick={() => onHide(column)}
            type="button"
          >
            <Icons.unvisible className="size-4" />
            Ocultar
          </button>
        </div>
      )}
      {filterOpen && config.filterable !== false && (
        <div className="absolute right-0 top-9 z-40">
          <TableColumnFilterContainer
            column={column}
            config={config}
            onClose={onFilterClose}
          />
        </div>
      )}
    </div>
  );
}

export function DataTablePresenter<TItem>({
  table,
  config,
  className,
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
}: DataTablePresenterProps<TItem>) {
  return (
    <div className={cn("h-full w-full overflow-auto rounded-md", className)}>
      <div className="min-w-max relative" role="table" style={{ minWidth: preferredTotal }}>
        {table.getHeaderGroups().map((headerGroup) => (
          <div className="flex sticky top-0 z-40" key={headerGroup.id} role="row">
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
              return (
                <HeaderCell
                  actions={
                    <>
                      <ColumnActions
                        column={column}
                        compact={size < 220}
                        config={columnConfig}
                        filterOpen={openFilterId === column.id}
                        menuOpen={openMenuId === column.id}
                        onFilterClose={onFilterClose}
                        onFilterToggle={onFilterToggle}
                        onHide={onHide}
                        onMenuOpenChange={onMenuOpenChange}
                        onPin={onPin}
                        onSort={onSort}
                      />
                      <button
                        aria-label={`${columnConfig.label}の幅を変更`}
                        className="h-full w-1 cursor-col-resize self-stretch bg-transparent hover:bg-Primary"
                        onClick={(event) => event.stopPropagation()}
                        onMouseDown={(event) => onResize(header, event)}
                        type="button"
                      />
                    </>
                  }
                  className={cn(pinned && "sticky z-20")}
                  icon={columnConfig.icon}
                  key={header.id}
                  onClick={() => onMenuOpenChange(column.id, true)}
                  role="columnheader"
                  showDefaultActions={false}
                  style={{
                    width: size,
                    minWidth: size,
                    left: pinned ? column.getStart("left") : undefined,
                  }}
                >
                  <span className="flex min-w-0 flex-1 items-center gap-1">
                    {flexRender(column.columnDef.header, header.getContext()) ||
                      title}
                  </span>
                </HeaderCell>
              );
            })}
          </div>
        ))}
        {table.getRowModel().rows.map((row) => (
          <div className="flex" key={row.id} role="row">
            {row.getVisibleCells().map((cell) => {
              const column = cell.column;
              const pinned = column.getIsPinned() === "left";
              return (
                <Cell
                  className={cn("truncate", pinned && "sticky z-10")}
                  key={cell.id}
                  role="cell"
                  style={{
                    width: column.getSize(),
                    minWidth: column.getSize(),
                    left: pinned ? column.getStart("left") : undefined,
                  }}
                  title={String(cell.getValue() ?? "")}
                >
                  {flexRender(column.columnDef.cell, cell.getContext())}
                </Cell>
              );
            })}
          </div>
        ))}
        {!table.getRowModel().rows.length && (
          <div className="p-4 text-sm text-OnSurfaceVariant">
            No hay registros.
          </div>
        )}
      </div>
      {resized && (
        <span className="sr-only">Columnas redimensionadas</span>
      )}
    </div>
  );
}

export function TableFilterButtonGroupPresenter<TItem>({
  table,
  config,
  className,
  openedId,
  onClose,
  onToggle,
}: TableFilterButtonGroupPresenterProps<TItem>) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-2 overflow-x-auto scrollbar-none",
        className,
      )}
    >
      {config.columns
        .filter((column) => column.filterable !== false)
        .map((columnConfig) => {
          const column = table.getColumn(columnConfig.id);
          if (!column) return null;
          const filterValue = column.getFilterValue();
          const active = Array.isArray(filterValue)
            ? filterValue.length > 0
            : filterValue !== undefined;
          const label = active
            ? `${columnConfig.label}: ${
                Array.isArray(filterValue)
                  ? filterValue.join(", ")
                  : String(filterValue)
              }`
            : columnConfig.label;
          const Icon = Icons[columnConfig.icon];

          return (
            <div className="relative shrink-0" key={columnConfig.id}>
              <button
                aria-expanded={openedId === columnConfig.id}
                className={cn(
                  "flex h-7 items-center gap-1 rounded-full border border-OutlineVariant bg-transparent px-3 text-sm font-medium text-OnSurfaceVariant hover:bg-SurfaceContainerLow",
                  active && "bg-Primary text-OnPrimary",
                )}
                onClick={() => onToggle(columnConfig.id)}
                type="button"
              >
                <Icon className="size-4" />
                <span className="max-w-44 truncate">{label}</span>
              </button>
              {openedId === columnConfig.id && (
                <div className="absolute left-0 top-8 z-40">
                  <TableColumnFilterContainer
                    column={column}
                    config={columnConfig}
                    onClose={onClose}
                  />
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}
