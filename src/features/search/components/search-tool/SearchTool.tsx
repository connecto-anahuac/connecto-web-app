import { ComponentProps } from "react";
import SearchToolToggleButton from "./SearchToolButton";
import SearchToolModal from "./SearchToolModal";
import { FilterDefinition } from "../../shared/filterDefinition";

type Props<TItem> = ComponentProps<"div"> & ComponentProps<"button"> & {
    definitions: readonly FilterDefinition<TItem>[];
    isSelected?: boolean;
};
export default function SearchTool<TItem>({ definitions,onClick,isSelected, ...props }: Props<TItem>) {
    return (
        <div className="relative size-fit"{...props}>
            <SearchToolToggleButton  onClick={onClick} />
         {isSelected && <SearchToolModal definitions={definitions} className="absolute top-0 -right-1 translate-x-full rounded-tl-sm  "/>
        } </div>
    )
    
}
