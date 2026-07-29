"use client";

import { HeaderCellPresenter } from "./HeaderCellPresenter";
import type { HeaderCellProps } from "./HeaderCell.types";
import { useHeaderCell } from "./useHeaderCell";

export default function HeaderCellContainer<TItem>(
  props: HeaderCellProps<TItem>,
) {
  const headerCell = useHeaderCell(props);

  return (
    <HeaderCellPresenter
      {...props}
      {...headerCell}
      compact={true}
    />
  );
}
