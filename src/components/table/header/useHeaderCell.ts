"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import type { ModalHandle } from "@/components/modal/Modal";
import type { HeaderCellProps, HeaderMenuItem } from "./HeaderCell.types";

export function useHeaderCell<TItem>({
  label,
  icon,
  column,
  config,
  showDefaultActions = true,
  onHide,
  onPin,
}: Pick<
  HeaderCellProps<TItem>,
  | "label"
  | "icon"
  | "column"
  | "config"
  | "showDefaultActions"
  | "onHide"
  | "onPin"
>) {
  const cellRef = useRef<HTMLDivElement>(null);
  const headerTitleRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuModalRef = useRef<ModalHandle>(null);
  const filterModalRef = useRef<ModalHandle>(null);
  const [isCompact, setIsCompact] = useState(false);
  const isCompactRef = useRef(isCompact);
  const title = label; // children ?? label;
  const titleText =
    typeof title === "string" || typeof title === "number"
      ? String(title)
      : "";
  const contentMinWidth = `${98 + titleText.length * 9}px`;
  const measurementLayoutKey = JSON.stringify([
    titleText,
    icon,
    config.filterable !== false,
    showDefaultActions,
  ]);
  const measuredLayoutKeyRef = useRef(measurementLayoutKey);

  const measureHeaderTitle = useCallback(
    (headerTitleGivenRef: HTMLDivElement | null) => {
      headerTitleRef.current = headerTitleGivenRef;

      if (!headerTitleGivenRef) {
        return;
      }

      const layoutChanged =
        measuredLayoutKeyRef.current !== measurementLayoutKey;
      measuredLayoutKeyRef.current = measurementLayoutKey;

      if (isCompactRef.current) {
        if (!layoutChanged) {
          return;
        }

        isCompactRef.current = false;
        setIsCompact(false);
        return;
      }

      const nextIsCompact =
        headerTitleGivenRef.scrollWidth > headerTitleGivenRef.clientWidth;
      isCompactRef.current = nextIsCompact;
      setIsCompact(nextIsCompact);
    },
    [measurementLayoutKey],
  );

  useLayoutEffect(() => {
    isCompactRef.current = isCompact;

    if (!isCompact) {
      measureHeaderTitle(headerTitleRef.current);
    }
  }, [isCompact, measureHeaderTitle]);

  useLayoutEffect(() => {
    const cell = cellRef.current;

    if (!cell) {
      return;
    }

    let previousWidth = cell.getBoundingClientRect().width;
    const observer = new ResizeObserver(() => {
      const currentWidth = cell.getBoundingClientRect().width;

      if (currentWidth === previousWidth) {
        return;
      }
      previousWidth = currentWidth;

      if (isCompactRef.current) {
        isCompactRef.current = false;
        setIsCompact(false);
        return;
      }

      measureHeaderTitle(headerTitleRef.current);
    });

    observer.observe(cell);
    return () => observer.disconnect();
  }, [measureHeaderTitle]);

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
    isCompact,
    measureHeaderTitle,
  };
}
