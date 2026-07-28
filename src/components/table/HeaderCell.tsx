import {
  useRef,
  type ComponentProps,
  type ComponentPropsWithRef,
  type ReactNode,
} from "react";
import { cn } from "@/shared/lib/util";
import { IconName, Icons } from "../icon";
import IconButton from "../button/IconButton";
import { DataViewColumn } from "./dataView.types";
import { Column } from "@tanstack/react-table";
import ButtonModal from "../ButtonModal";
import { TableColumnFilterContainer } from "./DataTable/TableColumnFilterContainer";
import { getTableSortIcon } from "./DataTable/useDataTable";
import Modal, { ModalProvider, type ModalHandle } from "../modal/Modal";

type ColumnActionsProps<TItem> = {
  column: Column<TItem>;
  config: DataViewColumn<TItem>;
  compact: boolean;
  onHide: (column: Column<TItem>) => void;
  onPin: (column: Column<TItem>) => void;
  onSort: (column: Column<TItem>) => void;
  //
  menuOpen?: boolean;
  filterOpen?: boolean;
  onFilterClose?: () => void;
  onFilterToggle?: (columnId: string) => void;
  onMenuOpenChange?: (columnId: string, open: boolean) => void;
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
  onHide,
  onPin,
  onSort,

  ...props
}: HeaderCellProps<TItem>) {
  compact = true;

  const cellRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuModalRef = useRef<ModalHandle>(null);
  const filterModalRef = useRef<ModalHandle>(null);
  const menuButtonId = "menu-button";
  const content = children ?? label;
  const contentText =
    typeof content === "string" || typeof content === "number"
      ? String(content)
      : "";
  const contentMinWidth = `${98 + contentText.length * 9}px`; //文字数に合わせて最小幅決定

  const IconComponent = icon && Icons[icon];

  const menuItems = [
    {
      icon: "pin",
      label: "pivot",
      onClick: () => onPin(column),
    },
    {
      icon: "unvisible",
      label: "ocultar",
      onClick: () => onHide(column),
    },
    {
      icon: "filter",
      label: "filtro",
      onClick: () =>
        filterModalRef.current?.open(menuButtonRef.current ?? undefined),
    },
  ] satisfies ItemProps[];

  return (
    <div
      ref={cellRef}
      className={cn(
        "flex h-9 items-center border border-DividerMiddle bg-DividerLowest px-2.5 text-xs font-medium text-OnSurface/60",
        className,
      )}
      onClick={() => menuModalRef.current?.open(cellRef.current ?? undefined)}
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

      <ModalProvider ref={filterModalRef}>
        <Modal.Content>
          <TableColumnFilterContainer column={column} config={config} />
        </Modal.Content>
        {actions ??
          (showDefaultActions && (
            <div className="flex items-center gap-3 ml-auto shrink-0">
              {/* if has spacing, visible */}
              {!compact && (
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
                    <>
                      <Modal.Trigger>
                        <IconButton
                          icon="filter"
                          size={"md"}
                          appearance={"text"}
                          intent="lightInk"
                          onClick={(event) => {
                            event.stopPropagation();
                          }}
                        />
                      </Modal.Trigger>
                    </>
                  )}
                </div>
              )}

              {/* always visible */}
              <div className="shrink-0  flex gap-1">
                {compact && (
                  <>
                    {/* <Modal.Reference id={menuButtonId} /> */}
                    <ButtonModal ref={menuModalRef}>
                      <ButtonModal.Trigger>
                        <IconButton
                          ref={menuButtonRef}
                          icon="threePointMenu"
                          size={"md"}
                          appearance={"text"}
                          intent="lightInk"
                          onClick={(event) => {
                            event.stopPropagation();
                          }}
                        />
                      </ButtonModal.Trigger>

                      <ButtonModal.Content>
                        <ColumnToolMenu
                          items={menuItems}
                          onItemSelect={() => menuModalRef.current?.close()}
                        />
                      </ButtonModal.Content>
                    </ButtonModal>
                  </>
                )}

                <IconButton
                  icon={getTableSortIcon(column, config)}
                  size={"md"}
                  appearance={"text"}
                  intent="lightInk"
                  onClick={(event) => {
                    event.stopPropagation();
                    onSort(column);
                  }}
                />
              </div>
            </div>
          ))}
      </ModalProvider>
    </div>
  );
}

type ItemProps = {
  icon: IconName;
  label: string;
  onClick?: () => void;
};
type ColumnToolMenuProps = ComponentPropsWithRef<"div"> & {
  items: ItemProps[];
  onItemSelect?: () => void;
};
type ButtonItemProps = ComponentProps<"button"> & {
  item: ItemProps;
  onItemSelect?: () => void;
};

function ColumnToolMenu({
  items,
  onItemSelect,
  ...props
}: ColumnToolMenuProps) {
  function ButtonItem({
    item,
    onItemSelect,
    onClick,
    ...props
  }: ButtonItemProps) {
    const Icon = Icons[item.icon];
    return (
      <button
        className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-Primary hover:text-OnPrimary"
        type="button"
        {...props}
        onClick={(event) => {
          onClick?.(event);
          item.onClick?.();
          onItemSelect?.();
        }}
      >
        <Icon className="size-4" /> {item.label}
      </button>
    );
  }

  // absolute left-0 top-9 z-40
  return (
    <div
      className=" flex min-w-56 flex-col rounded-md border border-Outline bg-InverseSurface p-1 text-InverseOnSurface shadow-lg"
      {...props}
    >
      {items.map((item, index) => {
        return (
          <ButtonItem
            key={item.label + index}
            item={item}
            onItemSelect={onItemSelect}
          />
        );
      })}
    </div>
  );
}
