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
  const title = label;//children ?? label;
  const titleText =
    typeof title === "string" || typeof title === "number"
      ? String(title)
      : "";
  const contentMinWidth = `${98 + titleText.length * 9}px`;

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
    title,
    contentMinWidth,
    icon,
    menuItems,
  };
}
