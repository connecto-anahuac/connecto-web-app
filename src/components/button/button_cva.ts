import { UIAppearance, UIIntent, UISize } from "@/shared/lib/cva";
import { cva, VariantProps } from "class-variance-authority";

export const buttonContents = ["iconOnly", "iconLabel", "labelOnly"] as const;
export type ButtonContent = (typeof buttonContents)[number];

export const buttonIntentVariants: Record<UIIntent, string> = {
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
  darkInk: [
    //TODO color
    // default
    "[--btn-bg:var(--color-InverseSurface)] [--btn-fg:var(--color-InverseOnSurface)] [--btn-outline:var(--color-InverseSurface)]",
    // hover
    "[--btn-bg-hover:var(--color-OnSurface-40)] [--btn-fg-hover:var(--color-OnSurface)] [--btn-outline-hover:var(--color-InverseSurface)]",
    // click
    "[--btn-bg-active:var(--color-OnSurface-60)] [--btn-fg-active:var(--color-OnSurface)] [--btn-outline-active:var(--color-InverseSurface)]",
    // disable
    "[--btn-bg-disable:var(--color-DividerLow)] [--btn-fg-disable:var(--color-GrayLow)] [--btn-outline-disable:var(--color-DividerMiddle)]",

    // text
    //default
    " [--txt-btn-fg:var(--color-OnSurface)] ",
    // hover
    "[--txt-btn-bg-hover:var(--color-SurfaceContainer)] [--txt-btn-fg-hover:var(--color-OnSurface)] ",
    // click
    "[--txt-btn-bg-active:var(--color-SurfaceContainerHigh)] [--txt-btn-fg-active:var(--color-OnSurface)] ",
    // disable
    " [--txt-btn-fg-disable:var(--color-OnSurface-40)]",
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

    // text
    //default
    " [--txt-btn-fg:var(--color-OnSurfaceVariant)] ",
    // hover
    "[--txt-btn-bg-hover:var(--color-SurfaceContainer)] [--txt-btn-fg-hover:var(--color-OnSurfaceVariant)] ",
    // click
    "[--txt-btn-bg-active:var(--color-SurfaceContainerHigh)] [--txt-btn-fg-active:var(--color-OnSurfaceVariant)] ",
    // disable
    " [--txt-btn-fg-disable:var(--color-OnSurface-40)]",
  ].join(" "),
} as const;

// export const buttonIntentVariants: Record<UIIntent, string> = {
//   primary: [
//     // default
//     "[--btn-bg:var(--color-Primary)] [--btn-fg:var(--color-OnPrimary)] [--btn-outline:var(--color-Primary)]",
//     // hover
//     "[--btn-bg-hover:var(--color-Primary-50)] [--btn-fg-hover:var(--color-OnPrimary)] [--btn-outline-hover:var(--color-Primary)]",
//     // click
//     "[--btn-bg-active:var(--color-Primary-40)] [--btn-fg-active:var(--color-OnPrimary)] [--btn-outline-active:var(--color-Primary)]",
//     // disable
//     "[--btn-bg-disable:var(--color-DividerLow)] [--btn-fg-disable:var(--color-GrayLow)] [--btn-outline-disable:var(--color-DividerMiddle)]",

//     // "focus:ring-1", // selected by Tab key
//     // "aria-pressed:bg-Primary", //toggle on
//     // "aria-selected:bg-Primary", // selected tab or one of lists

//     // "checked:bg-Primary",
//     // "open:bg-Primary",
//     // "aria-hidden:bg-Primary",
//   ].join(" "),

//   secondary: [
//     // default
//     "[--btn-bg:var(--color-Secondary)] [--btn-fg:var(--color-OnSecondary)] [--btn-outline:var(--color-Secondary)]",
//     // hover
//     "[--btn-bg-hover:var(--color-Secondary-30)] [--btn-fg-hover:var(--color-OnSecondary)] [--btn-outline-hover:var(--color-Secondary)]",
//     // click
//     "[--btn-bg-active:var(--color-Secondary-20)] [--btn-fg-active:var(--color-OnSecondary)] [--btn-outline-active:var(--color-Secondary)]",
//     // disable
//     "[--btn-bg-disable:var(--color-DividerLow)] [--btn-fg-disable:var(--color-GrayLow)] [--btn-outline-disable:var(--color-DividerMiddle)]",
//   ].join(" "),

//   tertiary: [
//     // default
//     "[--btn-bg:var(--color-Tertiary)] [--btn-fg:var(--color-OnTertiary)] [--btn-outline:var(--color-Tertiary)]",
//     // hover
//     "[--btn-bg-hover:var(--color-Tertiary-50)] [--btn-fg-hover:var(--color-OnTertiary)] [--btn-outline-hover:var(--color-Tertiary)]",
//     // click
//     "[--btn-bg-active:var(--color-Tertiary-40)] [--btn-fg-active:var(--color-OnTertiary)] [--btn-outline-active:var(--color-Tertiary)]",
//     // disable
//     "[--btn-bg-disable:var(--color-DividerLow)] [--btn-fg-disable:var(--color-GrayLow)] [--btn-outline-disable:var(--color-DividerMiddle)]",
//   ].join(" "),
// } as const;

export const buttonSizeVariants: Record<UISize, string> = {
  sm: [
    "flex items-center",
    "rounded-sm",
    "h-7.5",
    "px-3 py-2",
    "text-xs font-medium",
    "gap-0.5",
    //
  ].join(" "),

  md: [
    "flex items-center",
    "rounded-sm",
    "h-8",
    "px-3 py-2",
    "text-sm font-medium",
    "gap-1",
    //
  ].join(" "),

  lg: [
    "flex items-center",
    "rounded-sm",
    "h-8.5",
    "px-3 py-2",
    "text-xbase font-medium",
    "gap-1.5",
    //
  ].join(" "),
} as const;

export const buttonAppearanceVariants: Record<UIAppearance, string> = {
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
    "hover:bg-[var(--btn-bg-hover)] hover:text-[var(--btn-fg-hover)] hover:border-[var(--btn-outline-hover)]",
    "active:bg-[var(--btn-bg-active)] active:text-[var(--btn-fg-active)] active:border-[var(--btn-outline-active)]",
    "disabled:bg-transparent disabled:text-[var(--btn-outline-disable)] disabled:border-[var(--btn-outline-disable)]",
  ].join(" "),

  text: [
    "hover:opacity-100",
    "disabled:opacity-100",

    "bg-transparent text-[var(--txt-btn-fg)] ",
    "hover:text-[var(--txt-btn-fg-hover)] hover:bg-[var(--txt-btn-bg-hover)]",
    "aria-pressed:text-[var(--txt-btn-fg-hover)] aria-pressed:bg-[var(--txt-btn-bg-hover)]",
    "active:text-[var(--txt-btn-fg-active)] active:bg-[var(--txt-btn-bg-active)]",
    "disabled:text-[var(--txt-btn-fg-disable)] ",
  ].join(" "),
};

export const buttonContentVariants: Record<ButtonContent, string> = {
  iconOnly: ["px-3"].join(" "),

  iconLabel: ["flex items-center", "gap-1.5", "pl-3 pr-3.5"].join(" "),

  labelOnly: ["px-3.5"].join(" "),
} as const;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export const buttonVariants = cva(
  [
    "transition-colors",
    "disabled:pointer-events-none",
    "disabled:opacity-40",
    "hover:opacity-80",
    "rounded-sm h-7.5 h-8 h-8.5",
  ].join(" "),
  {
    variants: {
      intent: buttonIntentVariants,
      size: buttonSizeVariants,
      appearance: buttonAppearanceVariants,
      content: buttonContentVariants,
    },

    defaultVariants: {
      intent: "primary",
      size: "md",
      appearance: "filled",
      content: "iconLabel",
    },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
