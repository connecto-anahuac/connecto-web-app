"use client";

import { useCallback, type ComponentProps } from "react";
import { cn } from "@/shared/lib/util";
import { IconName, Icons } from "../icon";
import { DisableProps, LoadableProps } from "@/shared/lib/cva";
import { ButtonVariantProps } from "./button_cva";
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
import { FilterConditionValue, FilterDefinition } from "@/features/search/shared/filterDefinition";
import { useFilterStoreProvider } from "@/features/search/components/Provider/useFilterStore";
import { operatorNumberButtonLabels } from "@/features/search/shared/operatorPolicy";

type ButtonProps<TItem> = Partial<ButtonVariantProps> &
  ComponentProps<"button"> &
  DisableProps &
  LoadableProps & {
    label: string;
    icon?: IconName;
    hasBadge?: boolean;
    definition: FilterDefinition<TItem>;
    open: boolean;
    onOpenChange: (open: boolean) => void;
  };

export default function FilterButton<TItem>({
  className,
  label,
  icon,
  intent = "lightInk",
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
  const buttonIcon = icon ? icon : (definition.icon ?? null);

  const IconComponent = buttonIcon ? Icons[buttonIcon] : null;

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange,
    placement: "bottom-start",
    whileElementsMounted: autoUpdate,
    middleware: [offset(6), flip(), shift({ padding: 8 })],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context); //when click outside of the modal, it will be closed

  const { getReferenceProps } = useInteractions([click, dismiss]);
  const setReferenceRef = useCallback(
    (node: HTMLButtonElement | null) => refs.setReference(node),
    [refs],
  );
  const setFloatingRef = useCallback(
    (node: HTMLElement | null) => refs.setFloating(node),
    [refs],
  );

  const condition = useFilterStoreProvider((state) =>
    state.getConditionByKey(definition.key),
  );

  const hasCondition =
    condition !== undefined &&
    condition.value !== undefined &&
    condition.value !== null;

  const operator =
    hasCondition &&
    (definition.valueType === "number"
      ? (operatorNumberButtonLabels[condition.operator] ?? ":")
      : ":");

  function getSelectedLabel(
    definition: FilterDefinition<TItem>,
    conditionValue: FilterConditionValue,
  ) {
    if (definition.inputType === "option" && definition.options) {
      return definition.options.find(
        (option) => option.value === conditionValue,
      )?.label;
    }
    return conditionValue;
  }

  const selectedValueLabel =
    hasCondition &&
    (Array.isArray(condition.value)
      ? condition.value.length > 0
        ? `${condition.value.map((v) => getSelectedLabel(definition, v)).join(",")}`
        : null
      : `${condition.value}`);

  // const selectedOptionLabel = definition.options!.find(
  //   (option) => option.value === condition!.value,
  // )?.label;

  // if (hasCondition) {
  //   const operator =
  //     definition.valueType === "number"
  //       ? (operatorNumberButtonLabels[condition.operator] ?? ":")
  //       : ":";

  //   // formattedLabel =
  //   //   condition.value.length > 0
  //   //     ? `${label} ${operator} ${condition.value.join(",")}`
  //   //     : label;

  //   formattedLabel = Array.isArray(condition.value)
  //     ? condition.value.length > 0
  //       ? `${label} ${operator} ${condition.value.join(",")}`
  //       : label
  //     : `${label} ${operator} ${condition.value}`;
  // }

  return (
    <>
      {/* <Button
        ref={setReferenceRef}
        label={formattedLabel}
        icon={buttonIcon}
        intent={intent}
        size={size}
        appearance={"filled"}
        hasBadge={hasBadge}
        disabled={disabled}
        loading={loading}
        aria-pressed={open}
        className="rounded-full border border-OutlineVariant h-7"
        {...getReferenceProps()}
        {...props}
      /> */}

      <button
        aria-pressed={open}
        ref={setReferenceRef}
        className={cn(
          // buttonVariants({
          //   intent: intent,
          //   size: size,
          //   appearance: "outlined",
          //   content: "iconLabel",
          // }),

          "bg-transparent text-OnSurfaceVariant border border-OutlineVariant",
          "hover:bg-SurfaceContainerLow ",
          "aria-pressed:text-OnPrimary aria-pressed:bg-Primary",
          "active:bg-SurfaceContainer active:text-OnSurface",
          // "disabled:bg-transparent disabled:text-[var(--btn-outline-disable)] disabled:border-[var(--btn-outline-disable)]",

          "rounded-full  h-7 gap-1  flex items-center",
          "py-2",
          "pl-3 pr-3.5",
          "text-sm font-medium",
          "whitespace-nowrap",
          className,
        )}
        disabled={disabled}
        {...getReferenceProps()}
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
        <span className="flex gap-px items-baseline ">
          <span className="">{label}</span>
          <span className="ml-px  font-semibold">{operator}</span>
          <span className="ml-px text-xs   max-w-30 truncate">
            {selectedValueLabel}
          </span>
        </span>

        {/* Badge */}
        {hasBadge && (
          //TODO border color -real bg color?????
          //temporally containerlowest
          <div className="border-2 border-SurfaceContainerLowest  absolute size-3 -top-1 -right-1 bg-Tertiary rounded-full" />
        )}
      </button>

      {open && (
        <FilterRenderer
          ref={setFloatingRef}
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
