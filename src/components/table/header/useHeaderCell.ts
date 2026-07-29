"use client";

import { useRef } from "react";
import { Icons } from "@/components/icon";
import type { ModalHandle } from "@/components/modal/Modal";
import type { HeaderCellProps, HeaderMenuItem } from "./HeaderCell.types";

export function useHeaderCell<TItem>({
  children,
  label,
  icon,
  column,
  onHide,
  onPin,
}: Pick<
  HeaderCellProps<TItem>,
  "children" | "label" | "icon" | "column" | "onHide" | "onPin"
>) {
  const cellRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuModalRef = useRef<ModalHandle>(null);
  const filterModalRef = useRef<ModalHandle>(null);
  const content = children ?? label;
  const contentText =
    typeof content === "string" || typeof content === "number"
      ? String(content)
      : "";
  const contentMinWidth = `${98 + contentText.length * 9}px`;

  const menuItems: HeaderMenuItem[] = [
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
  ];

  return {
    cellRef,
    menuButtonRef,
    menuModalRef,
    filterModalRef,
    content,
    contentMinWidth,
    icon,
    menuItems,
  };
}
