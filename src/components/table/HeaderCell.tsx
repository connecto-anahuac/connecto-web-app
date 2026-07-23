import type { ComponentProps, ReactNode } from "react";
import VisibleIcon from "../icon/VisibleIcon";
import ThreePointMenuIcon from "../icon/ThreePointMenuIcon";
import TextAscendingIcon from "../icon/sorts/TextAscendingIcon";

import { cn } from "@/shared/lib/util";
import IconButtonOLD from "../button/IconButton2";
import PinIcon from "../icon/PinIcon";
import FilterIcon from "../icon/FilterIcon";
import { IconName, Icons } from "../icon";

type HeaderCellProps = ComponentProps<"div"> & {
  label?: ReactNode;
  // leading?: ReactNode;
  icon?: IconName;
};

export default function HeaderCell({
  label,
  // leading,
  children,
  className,
  icon,
  ...props
}: HeaderCellProps) {
  const content = children ?? label;
  const isUnpackedTools = false;
  const contentText =
    typeof content === "string" || typeof content === "number"
      ? String(content)
      : "";
  const contentMinWidth = `${98 + contentText.length * 9}px`; //文字数に合わせて最小幅決定

  const IconComponent = icon && Icons[icon];
  return (
    <div
      className={cn(
        "flex h-9 items-center border border-DividerMiddle bg-DividerLowest px-2.5 text-xs font-medium text-OnSurface/60",
        // leading ? "justify-between gap-2" : "justify-start",
        className,
      )}
      {...props}
    >
      <div className="flex gap-[3px] items-center">
        {/* {leading ? <div className="shrink-0 size-4.5">{leading}</div> : null} */}
        {IconComponent && <IconComponent className="size-4.5" />}
        <div
          className="min-w-0 flex-1 truncate text-sm"
          style={{ minWidth: contentMinWidth }}
        >
          {content}
        </div>
      </div>

      {/* tools */}
      <div className="flex items-center gap-4 ml-auto">
        {/* if has spacing, visible */}
        {isUnpackedTools && (
          <div className="flex gap-0.5 shrink-0 ">
            <IconButtonOLD>
              <PinIcon className="size-4.5" />
            </IconButtonOLD>
            <IconButtonOLD>
              <VisibleIcon className="size-4.5" />
            </IconButtonOLD>
            <IconButtonOLD>
              <FilterIcon className="size-4.5" />
            </IconButtonOLD>
          </div>
        )}

        {/* always visible */}
        <div className="shrink-0  flex gap-1">
          {!isUnpackedTools && (
            <IconButtonOLD>
              <ThreePointMenuIcon className="size-search-filter-dismiss" />
            </IconButtonOLD>
          )}
          <IconButtonOLD>
            <TextAscendingIcon className="size-5" />
          </IconButtonOLD>
        </div>
      </div>
    </div>
  );
}
