"use client";

import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/util";
import { IconName, Icons } from "../icon";
import { DisableProps, LoadableProps } from "@/shared/lib/cva";
import { ButtonVariantProps, buttonVariants } from "./button_cva";
import { IconButtonVariantProps, iconButtonVariants } from "./iconbutton_cva";

type IconButtonProps = IconButtonVariantProps &
  ComponentProps<"button"> &
  DisableProps &
  LoadableProps & {
    icon: IconName;
    hasBadge?: boolean;
  };

export default function IconButton({
  className,
  icon,
  intent,
  size,
  appearance,
  hasBadge = false,
  disabled = false,
  loading = false,
  ...props
}: IconButtonProps) {
  const IconComponent = Icons[icon] ;

  return (
    <button
      disabled={disabled }
      className={cn(
        iconButtonVariants({
          intent: intent,
          size: size,
          appearance: appearance,
        }),
        className,
      )}
      {...props}
    >
      {/* Icon */}
      {IconComponent && (
        <IconComponent
          className={cn("size-full",

          )}
        />
      )}

      {/* Badge */}
      {hasBadge && (
        //TODO border color -real bg color?????
        //temporally containerlowest
        <div className="border-2 border-SurfaceContainerLowest  absolute size-3 -top-1 -right-1 bg-Tertiary rounded-full" />
      )}
    </button>
  );
}
