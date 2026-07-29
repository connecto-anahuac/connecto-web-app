import type { Column } from "@tanstack/react-table";
import type {
  ComponentProps,
  ComponentPropsWithRef,
  ReactNode,
  RefObject,
} from "react";
import type { IconName } from "@/components/icon";
import type { ModalHandle } from "@/components/modal/Modal";
import type { DataViewColumn } from "../dataView.types";

export type HeaderCellActionProps<TItem> = {
  column: Column<TItem>;
  config: DataViewColumn<TItem>;
  compact: boolean;
  onHide: (column: Column<TItem>) => void;
  onPin: (column: Column<TItem>) => void;
  onSort: (column: Column<TItem>) => void;
  menuOpen?: boolean;
  filterOpen?: boolean;
  onFilterClose?: () => void;
  onFilterToggle?: (columnId: string) => void;
  onMenuOpenChange?: (columnId: string, open: boolean) => void;
};

export type HeaderCellProps<TItem> = ComponentProps<"div"> &
  HeaderCellActionProps<TItem> & {
    label?: ReactNode;
    icon?: IconName;
    actions?: ReactNode;
    showDefaultActions?: boolean;
  };

export type HeaderMenuItem = {
  icon: IconName;
  label: string;
  onClick?: () => void;
};

export type ColumnToolMenuProps = ComponentPropsWithRef<"div"> & {
  items: HeaderMenuItem[];
  onItemSelect?: () => void;
};

export type ButtonItemProps = ComponentProps<"button"> & {
  item: HeaderMenuItem;
  onItemSelect?: () => void;
};

export type HeaderCellPresenterProps<TItem> = HeaderCellProps<TItem> & {
  content: ReactNode;
  contentMinWidth: string;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
  menuItems: HeaderMenuItem[];
  menuModalRef: RefObject<ModalHandle | null>;
  filterModalRef: RefObject<ModalHandle | null>;
  cellRef: RefObject<HTMLDivElement | null>;
};
