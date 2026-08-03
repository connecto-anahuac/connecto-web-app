"use client";

import { HeaderCellPresenter } from "./HeaderCellPresenter";
import type { HeaderCellProps } from "./HeaderCell.types";
import { useHeaderCell } from "./useHeaderCell";

export default function HeaderCellContainer<TItem>(
  props: HeaderCellProps<TItem>,
) {
  const {
    cellRef,
    menuButtonRef,
    menuModalRef,
    onFilterRequest,
    title: content,
    contentMinWidth,
    icon,
    menuItems,
    isCompact,
    measureHeaderTitle,
  } = useHeaderCell(props);

  return (
    //TODO error
    <HeaderCellPresenter
       {...props}
      cellRef={cellRef}
      menuButtonRef={menuButtonRef}
      menuModalRef={menuModalRef}
      onFilterRequest={onFilterRequest}
      title={content}
      contentMinWidth={contentMinWidth}
      icon={icon}
      menuItems={menuItems}
      isCompact={isCompact}
      measureHeaderTitle={measureHeaderTitle}
     
    />
  );
}
