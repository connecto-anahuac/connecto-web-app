"use client";

import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/util";
import { IconName, Icons } from "../icon";
import { DisableProps, LoadableProps } from "@/shared/lib/cva";
import { ButtonVariantProps, buttonVariants } from "./button_cva";

type ButtonProps = ButtonVariantProps &
  ComponentProps<"button"> &
  DisableProps &
  LoadableProps & {
    label: string;
    icon?: IconName;
    hasBadge?: boolean;
  };

export default function Button({
  className,
  label,
  icon,
  intent,
  size,
  appearance,
  hasBadge = false,
  disabled = false,
  loading = false,
  ...props
}: ButtonProps) {
  const IconComponent = icon ? Icons[icon] : null;
  const buttonContent = IconComponent ? "iconLabel" : "labelOnly";

  return (
    <button
      className={cn(
        buttonVariants({
          intent: intent,
          size: size,
          appearance: appearance,
          content: buttonContent,
        }),
        "whitespace-nowrap relative",
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {/* Icon */}
      {IconComponent && (
        <IconComponent
          className={cn(
            size == "sm" && "size-4",
            size == "md" && "size-4",
            size == "lg" && "size-4.5",
          )}
        />
      )}

      {/* Label */}
      {label && (
        <span className="relative">
          {label}
          {hasBadge && appearance === "text" && (
            //TODO border color -real bg color?????
            //temporally containerlowest
            <div
              className={cn(
                "border-2 border-SurfaceContainerLowest  size-3  bg-Tertiary rounded-full",
                "absolute -right-1 top-1/2 -translate-y-1/2 translate-x-full",
                // "  absolute  -top-1 -right-1 ",
              )}
            />
          )}
        </span>
      )}

      {/* Badge */}
      {hasBadge && appearance !== "text" && (
        //TODO border color -real bg color?????
        //temporally containerlowest
        <div
          className={cn(
            "border-2 border-SurfaceContainerLowest  size-3  bg-Tertiary rounded-full",
            "  absolute  -top-1 -right-1 ",
            // "  absolute  -top-1 -right-1 ",
          )}
        />
      )}
    </button>
  );
}
