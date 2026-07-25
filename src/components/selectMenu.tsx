import { cn } from "@/shared/lib/util";
import type { ComponentProps } from "react";

import MultiSelect from "./MultiSelect";
import SingleSelectItem from "./SingleSelectItem";

    // optionはちゃんと値調整
type Props = ComponentProps<'div'> & {
    isMulti?: boolean;
    isOpen?: boolean;
    options: {
        label: string;
        value: string;
    }[];
    hoveredIndex?: number;
    selectedValues?: string[];
    onHoverItem?: (index: number) => void;
    onSelectItem?: (value: string) => void;
};

// hoverはselectbox用に外注
// 初期位置がselectedの値にしたい
// TODO: selectedValues.length==1の時はその値をhoveredさせる <- 内部hover化可能
export default function SelectMenu({
    isMulti = false,
    isOpen = false,
    options,
    hoveredIndex = 0,
    selectedValues = [],
    onHoverItem,
    onSelectItem,
    className,
    ...props
}: Props) {
    if (!isOpen) {
        return null;
    }

    return(
        <div
            className={cn(
                "inline-flex min-w-36 flex-col rounded-md border border-Outline bg-InverseSurface text-InverseOnSurface px-1 py-1",
                className,
            )}
            role="menu"
            {...props}
        >
            {options.map((option, index) => {
                const checked = selectedValues.includes(option.value);
                const itemProps = {
                    label: option.label,
                    checked,
                    isHovered: hoveredIndex === index,
                    className: "w-full",
                    onMouseEnter: () => onHoverItem?.(index),
                    onFocus: () => onHoverItem?.(index),
                    onClick: () => onSelectItem?.(option.value),
                };

                return isMulti ? (
                    <MultiSelect key={`${option.value + index}`} {...itemProps} />
                ) : (
                    <SingleSelectItem key={`${option.value + index}`} {...itemProps} />
                );
            })}
        </div>
    )

}