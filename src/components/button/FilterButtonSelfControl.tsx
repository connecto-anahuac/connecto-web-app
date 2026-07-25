// "use client";

// import { useState, type ComponentProps } from "react";
// import { cn } from "@/shared/lib/util";
// import { IconName, Icons } from "../icon";
// import { DisableProps, LoadableProps } from "@/shared/lib/cva";
// import { ButtonVariantProps, buttonVariants } from "./button_cva";
// import Button from "./Button";
// import { FilterRenderer } from "@/features/search/components/filter/FilterRenderer";
// import {
//   autoUpdate,
//   flip,
//   offset,
//   shift,
//   useFloating,
// } from "@floating-ui/react";
// import { getStudentFilterIcon } from "@/features/search/shared/filter-metadata";
// import { FilterDefinition } from "@/features/search/shared/filter-definition";

// type ButtonProps<TItem> = Partial<ButtonVariantProps> &
//   ComponentProps<"button"> &
//   DisableProps &
//   LoadableProps & {
//     label: string;
//     icon?: IconName;
//     hasBadge?: boolean;
//     definition: FilterDefinition<TItem>;
//   };

// export default function FilterButton<TItem>({
//   className,
//   label,
//   icon,
//   intent = "darkInk",
//   size = "md",
//   appearance = "text",
//   hasBadge = false,
//   disabled = false,
//   loading = false,
//   definition,
//   ...props
// }: ButtonProps<TItem>) {
//   const IconComponent = icon ? Icons[icon] : null;
//   const [open, setOpen] = useState(false);
//   const { refs, floatingStyles } = useFloating({
//     open,
//     placement: "bottom-start",
//     whileElementsMounted: autoUpdate,
//     middleware: [offset(12), flip(), shift({ padding: 8 })],
//   });

//   return (
//     <>
//       <Button
//         ref={refs.setReference}
//         label={label}
//         icon={icon}
//         intent={intent}
//         size={size}
//         appearance={appearance}
//         hasBadge={hasBadge}
//         disabled={disabled}
//         loading={loading}
//         onClick={() => setOpen((prev) => !prev)}
//         aria-pressed={open}
//         {...props}
//       />

//       {open && (
//         <FilterRenderer
//           ref={refs.setFloating}
//           style={{
//             ...floatingStyles,
//             zIndex: 9999,
//           }}
//           key={definition.key}
//           filter={definition}
//           icon={IconComponent && <IconComponent />}
//         />
//       )}
//     </>
//   );
// }
