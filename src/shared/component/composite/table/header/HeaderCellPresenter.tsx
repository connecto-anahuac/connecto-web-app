import { Icons } from "@/shared/component/primitive/icon";
import ButtonModal from "@/shared/component/primitive/ButtonModal";
import IconButton from "@/shared/component/primitive/button/IconButton";
import Modal, { ModalProvider } from "@/shared/component/composite/modal/Modal";
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
        event.stopPropagation();
        onClick?.(event);
        onItemSelect?.();
        item.onClick?.();
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
  //TODO compact, width中身調整。 label長さ、icon
  //TODO イラン門整理
  children: _children,
  className,
  actions,
  showDefaultActions = true,
  label: _label,
  column,
  config,
  menuOpen: _menuOpen,
  filterOpen: _filterOpen,
  onFilterClose: _onFilterClose,
  onFilterToggle: _onFilterToggle,
  onMenuOpenChange: _onMenuOpenChange,
  isCompact,
  onHide,
  onPin,
  onResize,
  onResizeFocusChange,
  onResizeHoverChange,
  onSort,
  isResizing = false,
  isResizeBoundaryHighlighted = false,
  title,
  contentMinWidth,
  icon,
  menuButtonRef,
  menuItems,
  menuModalRef,
  filterModalRef,
  cellRef,
  measureHeaderTitle,
  ...divProps
}: HeaderCellPresenterProps<TItem>) {
  const IconComponent = icon ? Icons[icon] : undefined;
  return (
    <div
      // when click the cell, open menue btm-str of cellRef
      ref={cellRef}
      className={cn(
        "relative cursor-default flex h-9 items-center border border-DividerMiddle bg-DividerLowest hover:bg-DividerLow active:bg-DividerMiddle px-2.5 text-xs font-medium text-OnSurface/60",
        // (isResizing || isResizeBoundaryHighlighted) &&
        //   "after:pointer-events-none after:absolute after:inset-y-0 after:right-[-1px] after:z-20 after:w-0.5 after:bg-Primary",
        className,
      )}
      onClick={() =>
        isCompact && menuModalRef.current?.open(cellRef.current ?? undefined)
      }
      style={{ minWidth: contentMinWidth }}
      {...divProps}
    >
      <div className="flex gap-[3px] items-center flex-1 min-w-0">
        {IconComponent && <IconComponent className="size-4.5" />}
        <div
          ref={measureHeaderTitle}
          className="min-w-0 flex-1 truncate text-sm"
          data-position="header-title"
        >
          {title}
        </div>
      </div>

      {/* resize handler */}
      {onResize && (
        <button
          aria-label={`${title} の列幅を変更`}
          className={cn(
            "inset-y-0",
            // "h-screen top-0 ",
            "absolute right-0 z-30 w-3 translate-x-1/2 touch-none border-0 bg-transparent p-0 ",
            "cursor-col-resize ", // in table, useeffect bodt.importatn
            "group flex justify-center",
            //  isResizing && "bg-Primary/30",
          )}
          onClick={(event) => event.stopPropagation()}
          onBlur={() => onResizeFocusChange?.(false)}
          onFocus={() => onResizeFocusChange?.(true)}
          onMouseEnter={() => onResizeHoverChange?.(true)}
          onMouseLeave={() => onResizeHoverChange?.(false)}
          onMouseDown={onResize}
          onTouchStart={onResize}
          type="button"
        >
          <div
            className={cn(
              "w-1",
              // "h-full",
              " h-screen",
              !isResizing && "group-hover:bg-Primary/20  ",
              isResizing && "bg-Primary/40 w-0.5",
            )}
            style={
              isResizing
                ? {
                    boxShadow: `
                -2px 0 4px color-mix(in srgb, var(--Primary) 25%, transparent),
                2px 0 4px color-mix(in srgb, var(--Primary) 25%, transparent)
              `,
                  }
                : undefined
            }
          />
        </button>
      )}

      <ModalProvider
        // To share FILTER menu in filterModalRef
        ref={filterModalRef}
      >
        <Modal.Content>
          <TableColumnFilterContainer column={column} config={config} />
        </Modal.Content>
        {actions ??
          (showDefaultActions && (
            <div className="ml-auto flex shrink-0 items-center gap-3">
              {!isCompact && (
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
                {isCompact && (
                  <ButtonModal
                    // when click menu item, close menu
                    ref={menuModalRef}
                  >
                    <ButtonModal.Trigger>
                      <IconButton
                        // when click filter in menu, close menu and open filtermodal in btm-str of menuButtonRef
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
                        onClick={(event) => {
                          event.stopPropagation();
                        }}
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
