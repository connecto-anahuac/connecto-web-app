import { UIAppearance, UIIntent, UISize } from "@/shared/lib/cva";
import { cva, VariantProps } from "class-variance-authority";

export const iconbuttonIntents = [
  "primary",
  "secondary",
  "tertiary",
  "darkInk",
  "lightInk",
] as const;
export type IconButtonIntent = (typeof iconbuttonIntents)[number];

export const iconButtonIntentVariants: Record<IconButtonIntent, string> = {
  primary: [
    // default
    "[--btn-bg:var(--color-Primary)] [--btn-fg:var(--color-OnPrimary)] [--btn-outline:var(--color-Primary)]",
    // hover
    "[--btn-bg-hover:var(--color-Primary-50)] [--btn-fg-hover:var(--color-OnPrimary)] [--btn-outline-hover:var(--color-Primary)]",
    // click
    "[--btn-bg-active:var(--color-Primary-40)] [--btn-fg-active:var(--color-OnPrimary)] [--btn-outline-active:var(--color-Primary)]",
    // disable
    "[--btn-bg-disable:var(--color-DividerLow)] [--btn-fg-disable:var(--color-GrayLow)] [--btn-outline-disable:var(--color-DividerMiddle)]",

    // "focus:ring-1", // selected by Tab key
    // "aria-pressed:bg-Primary", //toggle on
    // "aria-selected:bg-Primary", // selected tab or one of lists

    // "checked:bg-Primary",
    // "open:bg-Primary",
    // "aria-hidden:bg-Primary",
  ].join(" "),

  secondary: [
    // default
    "[--btn-bg:var(--color-Secondary)] [--btn-fg:var(--color-OnSecondary)] [--btn-outline:var(--color-Secondary)]",
    // hover
    "[--btn-bg-hover:var(--color-Secondary-30)] [--btn-fg-hover:var(--color-OnSecondary)] [--btn-outline-hover:var(--color-Secondary)]",
    // click
    "[--btn-bg-active:var(--color-Secondary-20)] [--btn-fg-active:var(--color-OnSecondary)] [--btn-outline-active:var(--color-Secondary)]",
    // disable
    "[--btn-bg-disable:var(--color-DividerLow)] [--btn-fg-disable:var(--color-GrayLow)] [--btn-outline-disable:var(--color-DividerMiddle)]",
  ].join(" "),

  tertiary: [
    // default
    "[--btn-bg:var(--color-Tertiary)] [--btn-fg:var(--color-OnTertiary)] [--btn-outline:var(--color-Tertiary)]",
    // hover
    "[--btn-bg-hover:var(--color-Tertiary-50)] [--btn-fg-hover:var(--color-OnTertiary)] [--btn-outline-hover:var(--color-Tertiary)]",
    // click
    "[--btn-bg-active:var(--color-Tertiary-40)] [--btn-fg-active:var(--color-OnTertiary)] [--btn-outline-active:var(--color-Tertiary)]",
    // disable
    "[--btn-bg-disable:var(--color-DividerLow)] [--btn-fg-disable:var(--color-GrayLow)] [--btn-outline-disable:var(--color-DividerMiddle)]",
  ].join(" "),
  darkInk: [//TODO color
    // default
    "[--btn-bg:var(--color-InverseSurface)] [--btn-fg:var(--color-OnSurface)] [--btn-outline:var(--color-InverseSurface)]",
    // hover
    "[--btn-bg-hover:var(--color-OnSurface-40)] [--btn-fg-hover:var(--color-OnSurface)] [--btn-outline-hover:var(--color-InverseSurface)]",
    // click
    "[--btn-bg-active:var(--color-OnSurface-60)] [--btn-fg-active:var(--color-OnSurface)] [--btn-outline-active:var(--color-InverseSurface)]",
    // disable
    "[--btn-bg-disable:var(--color-DividerLow)] [--btn-fg-disable:var(--color-GrayLow)] [--btn-outline-disable:var(--color-DividerMiddle)]",
  ].join(" "),
  lightInk: [
    // default
    "[--btn-bg:var(--color-SurfaceContainer)] [--btn-fg:var(--color-OnSurfaceVariant)] [--btn-outline:var(--color-SurfaceContainer)]",
    // hover
    "[--btn-bg-hover:var(--color-SurfaceContainerHigh)] [--btn-fg-hover:var(--color-OnSurfaceVariant)] [--btn-outline-hover:var(--color-SurfaceContainerHigh)]",
    // click
    "[--btn-bg-active:var(--color-SurfaceContainerHighest)] [--btn-fg-active:var(--color-OnSurfaceVariant)] [--btn-outline-active:var(--color-SurfaceContainerHighest)]",
    // disable
    "[--btn-bg-disable:var(--color-DividerLow)] [--btn-fg-disable:var(--color-GrayLow)] [--btn-outline-disable:var(--color-DividerMiddle)]",
  ].join(" "),
} as const;

export const iconButtonSizeVariants: Record<UISize, string> = {
  sm: [
    "rounded-sm",
    "size-7.5",
    "px-2.5",
    //
  ].join(" "),

  md: [
    "rounded-sm",
    "size-8",
    "px-2",
    //
  ].join(" "),

  lg: [
    "rounded-sm",
    "size-8.5",
    "px-2",
    //
  ].join(" "),
} as const;

export const iconButtonAppearanceVariants: Record<UIAppearance, string> = {
  filled: [
    "rounded",
    "hover:opacity-100",
    "disabled:opacity-100",

    "bg-[var(--btn-bg)] text-[var(--btn-fg)] ",
    "hover:bg-[var(--btn-bg-hover)] hover:text-[var(--btn-fg-hover)]",
    "active:bg-[var(--btn-bg-active)] active:text-[var(--btn-fg-active)]",
    "disabled:bg-[var(--btn-bg-disable)] disabled:text-[var(--btn-fg-disable)]",
  ].join(" "),

  outlined: [
    "hover:opacity-100",
    "disabled:opacity-100",

    "bg-transparent text-[var(--btn-outline)] border border-[var(--btn-outline)]",
    "hover:bg-[var(--btn-bg-hover)] hover:text-[var(--btn-fg-hover)]",
    "active:bg-[var(--btn-bg-active)] active:text-[var(--btn-fg-active)]",
    "disabled:bg-transparent disabled:text-[var(--btn-outline-disable)]",
  ].join(" "),

  text: [
    "hover:opacity-100",
    "disabled:opacity-100",
    "",

    // "bg-transparent text-[var(--btn-bg)] ",
    // "hover:text-[var(--btn-bg-hover)] ",
    // "active:text-[var(--btn-bg-active)] ",
    // "disabled:text-[var(--btn-bg-disable)] ",
//TODO color
 
    "bg-transparent text-[var(--btn-fg)] ",
    "hover:bg-[var(--btn-bg-hover)] hover:text-[var(--btn-fg-hover)]",
    "active:bg-[var(--btn-bg-active)] active:text-[var(--btn-fg-active)]",
    "disabled:bg-transparent disabled:text-[var(--btn-fg-disable)]",
  ].join(" "),
};


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export const iconButtonVariants = cva(
  [
    "transition-colors",
    "disabled:pointer-events-none",
    "disabled:opacity-40",
    "hover:opacity-80 ",
  ].join(" "),
  {
    variants: {
      intent: iconButtonIntentVariants,
      size: iconButtonSizeVariants,
      appearance: iconButtonAppearanceVariants,
    },

    defaultVariants: {
      intent: "darkInk",
      size: "md",
      appearance: "text",
    },
  },
);

export type IconButtonVariantProps = VariantProps<typeof iconButtonVariants>;
