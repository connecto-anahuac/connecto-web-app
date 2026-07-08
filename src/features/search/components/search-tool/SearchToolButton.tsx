"use client";

import ToolFillIcon from "@/components/icon/ToolFillIcon";
import ToolOutlineIcon from "@/components/icon/ToolOutlineIcon";
import { cn } from "@/shared/lib/util";
import { ButtonHTMLAttributes, ComponentProps, MouseEvent, useState } from "react";

type SearchToolToggleButtonProps = ComponentProps<"button"> & {
    pressed?: boolean;
    defaultPressed?: boolean;
    onPressedChange?: (pressed: boolean) => void;
};

export default function SearchToolToggleButton({
    pressed,
    defaultPressed = false,
    onPressedChange,
    className,
    type = "button",
    disabled,
    onClick,
    "aria-label": ariaLabel = "Toggle search tools",
    ...props
}: SearchToolToggleButtonProps) {
    const isControlled = pressed !== undefined;
    const [uncontrolledPressed, setUncontrolledPressed] = useState(defaultPressed);

    const isSelected = isControlled ? pressed : uncontrolledPressed;

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);

        if (event.defaultPrevented || disabled) {
            return;
        }

        const nextPressed = !isSelected;

        if (!isControlled) {
            setUncontrolledPressed(nextPressed);
        }

        onPressedChange?.(nextPressed);
    };

    return (
        <button
            {...props}
            type={type}
            disabled={disabled}
            aria-label={ariaLabel}
            aria-pressed={isSelected}
            onClick={handleClick}
            className={cn(
                "inline-flex size-6 items-center justify-center rounded-sm bg-transparent p-1 text-OnSurface/70 transition-colors hover:bg-gray-200/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-connecto-muted/30 disabled:cursor-not-allowed disabled:opacity-60",
                isSelected && "bg-Outline text-OnSurface",
                className,
            )}
        >
            {isSelected ? <ToolFillIcon className="size-full text-InverseOnSurface" /> : <ToolOutlineIcon className="size-full" />}
        </button>
    );
}