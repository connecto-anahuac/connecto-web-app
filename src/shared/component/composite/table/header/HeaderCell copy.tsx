import type { ComponentProps, ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "@/shared/lib/util";
import { IconName, Icons } from "../../../primitive/icon";
import IconButton from "../../../primitive/button/IconButton";
import { DataFieldConfig, DataViewConfig } from "../dataView.types";
import { Column } from "@tanstack/react-table";
import ButtonModal from "../../../primitive/ButtonModal";
import { TableColumnFilterContainer } from "../DataTable/TableColumnFilterContainer";

type ColumnActionsProps<TItem> = {
  column: Column<TItem>;
  config: DataFieldConfig<TItem>;
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

type HeaderCellProps<TItem> = ComponentProps<"div"> &
  ColumnActionsProps<TItem> & {
    label?: ReactNode;
    // leading?: ReactNode;
    icon?: IconName;
    /** Supplies interactive table actions without changing existing static uses. */
    actions?: ReactNode;
    showDefaultActions?: boolean;
  };

export default function HeaderCell<TItem>({
  label,
  // leading,
  children,
  className,
  icon,
  actions,
  showDefaultActions = true,

  //actions
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

  ...props
}: HeaderCellProps<TItem>) {
  const content = children ?? label;
  const contentText =
    typeof content === "string" || typeof content === "number"
      ? String(content)
      : "";
  const contentMinWidth = `${98 + contentText.length * 9}px`; //文字数に合わせて最小幅決定

  const IconComponent = icon && Icons[icon];

  const menuItems = [
    { icon: "pin", label: "pivot", onClick: () => onPin(column) },
    { icon: "unvisible", label: "ocultar", onClick: () => onHide(column) },
    {
      icon: "filter",
      label: "filtro",
      onClick: () => onFilterToggle(column.id),
    },
  ] satisfies ItemProps[];
  return (
    <div
      className={cn(
        "flex h-9 items-center border border-DividerMiddle bg-DividerLowest px-2.5 text-xs font-medium text-OnSurface/60",
        className,
      )}
      {...props}
    >
      <div className="flex gap-[3px] items-center">
        {IconComponent && <IconComponent className="size-4.5" />}
        <div
          className="min-w-0 flex-1 truncate text-sm"
          style={{ minWidth: contentMinWidth }}
        >
          {content}
        </div>
      </div>

      {actions ??
        (showDefaultActions && (
          <div className="flex items-center gap-3 ml-auto shrink-0">
            {/* if has spacing, visible */}
            {compact && (
              <div className="flex gap-0.5 shrink-0 h-fit">
                <IconButton
                  icon="pin"
                  size={"md"}
                  appearance={"text"}
                  intent="lightInk"
                  onClick={(event) => {
                    event.stopPropagation();
                    onPin(column);
                  }}
                />
                <IconButton
                  icon="unvisible"
                  size={"md"}
                  appearance={"text"}
                  intent="lightInk"
                  onClick={(event) => {
                    event.stopPropagation();
                    onHide(column);
                  }}
                />
                {config.filterable !== false && (
                  <ButtonModal
                    open={filterOpen}
                    onOpenChange={() => {
                      onFilterToggle(column.id);
                    }}
                  >
                    <ButtonModal.Trigger>
                      <IconButton
                        icon="filter"
                        size={"md"}
                        appearance={"text"}
                        intent="lightInk"
                        onClick={(event) => {
                          event.stopPropagation();
                        }}
                      />
                    </ButtonModal.Trigger>
                    <ButtonModal.Content>
                      {filterOpen ? (
                        <div className="absolute right-0 top-9 z-40">
                          <TableColumnFilterContainer
                            column={column}
                            config={config}
                          />
                        </div>
                      ) : (
                        <div />
                      )}
                    </ButtonModal.Content>
                  </ButtonModal>
                )}
              </div>
            )}

            {/* always visible */}
            <div className="shrink-0  flex gap-1">
              {!compact && (
                <ButtonModal
                  open={menuOpen}
                  onOpenChange={(open) => onMenuOpenChange(column.id, open)}
                >
                  <ButtonModal.Trigger>
                    <IconButton
                      icon="threePointMenu"
                      size={"md"}
                      appearance={"text"}
                      intent="lightInk"
                    />
                  </ButtonModal.Trigger>
                  <ButtonModal.Content>
                    <ColumnToolMenu items={menuItems} />
                  </ButtonModal.Content>
                </ButtonModal>
              )}

              <IconButton
                icon="textAscending"
                size={"md"}
                appearance={"text"}
                intent="lightInk"
                onClick={() => onSort(column)}
              />
            </div>
          </div>
        ))}
    </div>
  );
}

type ItemProps = {
  icon: IconName;
  label: string;
  onClick: () => void;
};
type ColumnToolMenuProps = ComponentPropsWithRef<"div"> & {
  items: ItemProps[];
};
function ColumnToolMenu({ items, ...props }: ColumnToolMenuProps) {
  // absolute left-0 top-9 z-40
  return (
    <div
      className=" flex min-w-56 flex-col rounded-md border border-Outline bg-InverseSurface p-1 text-InverseOnSurface shadow-lg"
      {...props}
    >
      {items.map((item, index) => {
        const Icon = Icons[item.icon];
        return (
          <button
            className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-Primary hover:text-OnPrimary"
            key={item.label + index}
            onClick={item.onClick}
            type="button"
          >
            <Icon className="size-4" /> {item.label}
          </button>
        );
      })}
    </div>
  );
}
