import type { ComponentProps } from "react";
import type {
  DataViewConfig,
  DataViewMetadata,
} from "@/shared/component/composite/table/dataView.types";
import SearchToolToggleButton from "./SearchToolButton";
import SearchToolModal from "./SearchToolModal";

type Props<TItem> = ComponentProps<"div"> & {
  config: DataViewConfig<TItem>;
  metadata: DataViewMetadata;
  isSelected?: boolean;
  onClick?: ComponentProps<"button">["onClick"];
};

export default function SearchTool<TItem>({
  config,
  metadata,
  onClick,
  isSelected,
  ...props
}: Props<TItem>) {
  return (
    <div className="relative size-fit" {...props}>
      <SearchToolToggleButton onClick={onClick} />
      {isSelected && (
        <SearchToolModal
          config={config}
          metadata={metadata}
          className="absolute top-0 -right-1 translate-x-full rounded-tl-sm"
        />
      )}
    </div>
  );
}
