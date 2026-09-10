

```ts
import { UIAppearance, UIIntent, UISize } from "@/shared/lib/cva";
import { cva, VariantProps } from "class-variance-authority";


export const buttonIntentVariants: Record<UIIntent, string> = {
  primary: [
    "",
    "hover:opacity-100",
    "disabled:opacity-100",

    "focus:ring-1", // selected by Tab key
    "aria-pressed:bg-Primary", //toggle on
    "aria-selected:bg-Primary", // selected tab or one of lists

    "active:bg-Primary", //when log pressed
    "checked:bg-Primary",
    "open:bg-Primary",
    "aria-hidden:bg-Primary",
  ].join(" "),

  secondary: [
    "",
    "hover:opacity-100",
    "disabled:opacity-100",

    "focus:ring-1", // selected by Tab key
    "aria-pressed:bg-Primary", //toggle on
    "aria-selected:bg-Primary", // selected tab or one of lists

    "active:bg-Primary", //when log pressed
    "checked:bg-Primary",
    "open:bg-Primary",
    "aria-hidden:bg-Primary",
  ].join(" "),

  tertiary: [
    "",
    "hover:opacity-100",
    "disabled:opacity-100",

    "focus:ring-1", // selected by Tab key
    "aria-pressed:bg-Primary", //toggle on
    "aria-selected:bg-Primary", // selected tab or one of lists

    "active:bg-Primary", //when log pressed
    "checked:bg-Primary",
    "open:bg-Primary",
    "aria-hidden:bg-Primary",
    "focus:",
  ].join(" "),
} as const;

export const buttonSizeVariants: Record<UISize, string> = {
  sm: [
    "",
    "h-8",
    "px-3 py-3",
    "text-xs font-medium",
    "gap-1",
    //
  ].join(" "),

  md: [
    "",
    "h-8",
    "px-3 py-3",
    "text-xs font-medium",
    "gap-1",
    //
  ].join(" "),

  lg: [
    "",
    "h-8",
    "px-3 py-3",
    "text-xs font-medium",
    "gap-1",
    //
  ].join(" "),
} as const;

export const buttonAppearanceVariants: Record<UIAppearance, string> = {
  filled: ["", "bg-Primary"].join(" "),

  outlined: [].join(" "),

  text: [].join(" "),
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export const buttonVariants = cva(
  [
    "transition-colors",
    "disabled:pointer-events-none",
    "disabled:opacity-40",
    "hover:opacity-80",
  ].join(" "),
  {
    variants: {
      intent: buttonIntentVariants,
      size: buttonSizeVariants,
      appearance: buttonAppearanceVariants,
    },

    defaultVariants: {
      intent: "primary",
      size: "md",
      appearance: "filled",
    },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;


```