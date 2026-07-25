"use client";

import { useState, type ComponentProps } from "react";
import { cn } from "@/shared/lib/util";
import { IconName, Icons } from "../icon";
import { DisableProps, LoadableProps } from "@/shared/lib/cva";
import { ButtonVariantProps, buttonVariants } from "./button_cva";
import Button from "./Button";
import { FilterRenderer } from "@/features/search/components/filter/FilterRenderer";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import { FilterDefinition } from "@/features/search/shared/filter-definition";

type ButtonProps<TItem> = Partial<ButtonVariantProps> &
  ComponentProps<"button"> &
  DisableProps &
  LoadableProps & {
    label: string;
    icon?: IconName;
    hasBadge?: boolean;
    definition: FilterDefinition<TItem>;
    open: boolean;
    onOpenChange: (open: Boolean) => void;
  };

export default function FilterButton<TItem>({
  className,
  label,
  icon,
  intent = "darkInk",
  size = "md",
  appearance = "text",
  hasBadge = false,
  disabled = false,
  loading = false,
  definition,
  open,
  onOpenChange,
  ...props
}: ButtonProps<TItem>) {
  const buttonIcon = icon ? icon : definition.icon ?? null;
  
  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange,
    placement: "bottom-start",
    whileElementsMounted: autoUpdate,
    middleware: [offset(12), flip(), shift({ padding: 8 })],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context); //when click outside of the modal, it will be closed

  const { getReferenceProps } = useInteractions([
    click,
    dismiss,
  ]);

  return (
    <>
      <Button
        ref={refs.setReference}
        label={label}
        icon={buttonIcon}
        intent={intent}
        size={size}
        appearance={appearance}
        hasBadge={hasBadge}
        disabled={disabled}
        loading={loading}
        aria-pressed={open}
        {...getReferenceProps()}
        {...props}
      />

      {open && (
        <FilterRenderer
          ref={refs.setFloating}
          style={{
            ...floatingStyles,
            zIndex: 9999,
          }}
          key={definition.key}
          filter={definition}
          icon={definition.icon}
        />
      )}
    </>
  );
}
