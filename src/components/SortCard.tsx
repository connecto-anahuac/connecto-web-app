import { cn } from "@/shared/lib/util";
import HandleGripIcon from "./icon/HandleGripIcon";
import Button from "./button/Button";
import SelectBoxFill from "./SelectBoxFill";
import PersonIcon from "./icon/PersonIcon";
import type { DragEventHandler } from "react";

type SortCardProps = {
  fieldLabel: string;
  className?: string;
  descending?: boolean;
  onDirectionToggle?: () => void;
  onRemove?: () => void;
  draggable?: boolean;
  onDragStart?: DragEventHandler<HTMLDivElement>;
  onDragOver?: DragEventHandler<HTMLDivElement>;
  onDrop?: DragEventHandler<HTMLDivElement>;
};

// function DragHandleIcon() {
//   return (
//     <svg
//       viewBox="0 0 12 12"
//       fill="none"
//       aria-hidden="true"
//       className="size-3 text-connecto-muted"
//     >
//       <circle cx="3" cy="2.5" r="0.75" fill="currentColor" />
//       <circle cx="3" cy="6" r="0.75" fill="currentColor" />
//       <circle cx="3" cy="9.5" r="0.75" fill="currentColor" />
//       <circle cx="9" cy="2.5" r="0.75" fill="currentColor" />
//       <circle cx="9" cy="6" r="0.75" fill="currentColor" />
//       <circle cx="9" cy="9.5" r="0.75" fill="currentColor" />
//     </svg>
//   )
// }

// function CloseSmallIcon() {
//   return (
//     <svg
//       viewBox="0 0 16 16"
//       fill="none"
//       aria-hidden="true"
//       className="size-4 text-connecto-muted"
//     >
//       <path
//         d="M4.47 4.47L11.53 11.53M11.53 4.47L4.47 11.53"
//         stroke="currentColor"
//         strokeWidth="1.4"
//         strokeLinecap="round"
//       />
//     </svg>
//   )
// }

// TODO button, color, selectbox function
export default function SortCard({
  fieldLabel,
  className,
  descending = false,
  onDirectionToggle,
  onRemove,
  draggable,
  onDragStart,
  onDragOver,
  onDrop,
}: SortCardProps) {
  return (
    <div
      className={cn(
        "inline-flex h-12 w-full min-w-fit justify-start  items-center gap-2.5 rounded-md bg-background px-2 py-3 text-sm font-medium text-OnSurfaceVariant",
        className,
      )}
      draggable={draggable}
      onDragOver={onDragOver}
      onDragStart={onDragStart}
      onDrop={onDrop}
    >
      <button
        type="button"
        aria-label="Reorder sort rule"
        className="inline-flex size-4 shrink-0 items-center justify-center rounded-sm  transition-colors hover:text-OnSurface"
      >
        <HandleGripIcon />
      </button>

      <Button
        icon={descending ? "textDescending" : "textAscending"}
        label=""
        intent="lightInk"
        appearance="filled"
        size="sm"
        className="shrink-0 ml-2 "
        onClick={onDirectionToggle}
      />
      
      {/* <SortCardFieldChip label={fieldLabel} /> */}
      <SelectBoxFill
        value={fieldLabel}
        leadingIcon={<PersonIcon />}
        className="ml-2 mr-4"
      />

      <Button
        icon="close"
        label=""
        intent="darkInk"
        appearance="text"
        size="md"
        className="shrink-0 ml-auto"
        onClick={onRemove}
      />
      {/* <button
        type="button"
        aria-label="Remove sort rule"
        className="ml-auto inline-flex size-4 shrink-0 items-center justify-center rounded-sm text-connecto-muted transition-colors hover:bg-connecto-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-connecto-muted/30"
      >
        <CloseSmallIcon />
      </button> */}
    </div>
  );
}
