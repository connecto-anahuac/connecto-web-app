import { Icons } from "@/components/icon";
import ButtonModal from "@/components/ButtonModal";
import IconButton from "@/components/button/IconButton";
import Modal, { ModalProvider } from "@/components/modal/Modal";
import { cn } from "@/shared/lib/util";
import { TableColumnFilterContainer } from "../DataTable/TableColumnFilterContainer";
import { getTableSortIcon } from "../DataTable/useDataTable";
import type {
  ButtonItemProps,
  ColumnToolMenuProps,
  HeaderCellPresenterProps,
} from "./HeaderCell.types";

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

function ColumnToolMenu({
  items,
  onItemSelect,
  ...props
}: ColumnToolMenuProps) {
  return (
    <div
      className=" flex min-w-56 flex-col rounded-md border border-Outline bg-InverseSurface p-1 text-InverseOnSurface shadow-lg"
      {...props}
    >
      {items.map((item, index) => (
        <ButtonItem
          key={item.label + index}
          item={item}
          onItemSelect={onItemSelect}
        />
      ))}
    </div>
  );
}

export function HeaderCellPresenter<TItem>({
  className,
  actions,
  showDefaultActions = true,
  column,
  config,
  compact,
  onHide,
  onPin,
  onSort,
  content,
  contentMinWidth,
  icon,
  menuButtonRef,
  menuItems,
  menuModalRef,
  filterModalRef,
  cellRef,
  ...props
}: HeaderCellPresenterProps<TItem>) {
  const IconComponent = icon ? Icons[icon] : undefined;
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
            <div className="ml-auto flex shrink-0 items-center gap-3">
              {!compact && (
                <div className="flex h-fit shrink-0 gap-0.5">
                  <IconButton
                    icon="pin"
                    size="md"
                    appearance="text"
                    intent="lightInk"
                    onClick={(event) => {
                      event.stopPropagation();
                      onPin(column);
                    }}
                  />
                  <IconButton
                    icon="unvisible"
                    size="md"
                    appearance="text"
                    intent="lightInk"
                    onClick={(event) => {
                      event.stopPropagation();
                      onHide(column);
                    }}
                  />
                  {config.filterable !== false && (
                    <Modal.Trigger>
                      <IconButton
                        icon="filter"
                        size="md"
                        appearance="text"
                        intent="lightInk"
                        onClick={(event) => {
                          event.stopPropagation();
                        }}
                      />
                    </Modal.Trigger>
                  )}
                </div>
              )}

              <div className="flex shrink-0 gap-1">
                {compact && (
                  <ButtonModal ref={menuModalRef}>
                    <ButtonModal.Trigger>
                      <IconButton
                        ref={menuButtonRef}
                        icon="threePointMenu"
                        size="md"
                        appearance="text"
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
                )}

                <IconButton
                  icon={getTableSortIcon(column, config)}
                  size="md"
                  appearance="text"
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
