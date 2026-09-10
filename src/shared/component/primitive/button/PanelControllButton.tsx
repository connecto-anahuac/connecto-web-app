"use client";

import type { ComponentProps, MouseEvent } from "react";
import { cn } from "@/shared/lib/util";
import { IconName, Icons } from "../icon";
import { DisableProps, LoadableProps } from "@/shared/lib/cva";
import { ButtonVariantProps, buttonVariants } from "./button_cva";
import { IconButtonVariantProps, iconButtonVariants } from "./iconbutton_cva";
import IconButton from "./IconButton";

type PanelControllButtonProps = IconButtonVariantProps &
  ComponentProps<"button"> &
  DisableProps &
  LoadableProps & {
    hasBadge?: boolean;
    openIcon?: "toLeft" | "toRight";
    isOpen?: boolean;
  };

export default function PanelControllButton({
  className,
  intent,
  size,
  appearance,
  hasBadge = false,
  disabled = false,
  loading = false,
  openIcon = "toLeft",
  isOpen = false,
  onClick,
  ...props
}: PanelControllButtonProps) {
  const onClickHandler = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
  };

  return (
    <>
      {isOpen ? (
        <IconButton
          icon="panelToLeft"
          size={size}
          intent={intent}
          appearance={appearance}
          hasBadge={hasBadge}
          disabled={disabled}
          loading={loading}
          className={cn(
            openIcon === "toRight" && "transform rotate-180",
            className,
          )}
          onClick={onClickHandler}
          {...props}
        />
      ) : (
        <IconButton
          icon="panelToLeft"
          size={size}
          intent={intent}
          appearance={appearance}
          hasBadge={hasBadge}
          disabled={disabled}
          loading={loading}
          className={cn(
            openIcon === "toLeft" && "transform rotate-180",
            className,
          )}
          onClick={onClickHandler}
          {...props}
        />
      )}
    </>
  );
}
