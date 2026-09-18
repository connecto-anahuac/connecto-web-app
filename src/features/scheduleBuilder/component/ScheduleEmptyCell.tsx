import type { ComponentProps } from "react";
import Avator from "@/shared/component/primitive/Avator";
import { Icons } from "@/shared/component/primitive/icon";
import { cn } from "@/shared/lib/util";

export type ScheduleEmptyCellAvatar = {
  id?: string;
  fullName: string;
  color?: string;
};

export type ScheduleEmptyCellStatus =
  | "default"
  | "highlighted"
  | "invalid"
  | "drag-over";

export type ScheduleEmptyCellProps = Omit<ComponentProps<"button">, "children"> & {
  avatars: readonly ScheduleEmptyCellAvatar[];
  label?: string;
  status?: ScheduleEmptyCellStatus;
  onAdd?: ComponentProps<"button">["onClick"];
};

/** A schedule slot that lets users add courses and preview its participants. */
export default function ScheduleEmptyCell({
  avatars,
  label = "Añadir cursos",
  className,
  type = "button",
  status = "default",
  onAdd,
  onClick,
  ...props
}: ScheduleEmptyCellProps) {
  const isInvalid = status === "invalid";
  const clickHandler = onAdd ?? onClick;
  return (
    <button
      type={type}
      data-state={status}
      data-highlighted={status === "highlighted" || undefined}
      data-invalid={isInvalid || undefined}
      data-drag-over={status === "drag-over" || undefined}
      aria-pressed={status === "highlighted" || status === "drag-over"}
      onClick={(e) => {
        if (isInvalid) return;
        clickHandler?.(e);
      }}
      className={cn(
        "flex h-24 w-56 min-w-56 flex-col items-start gap-2 rounded-lg border border-Primary px-2.5 pt-2.5 pb-2 text-Primary transition-colors",
        "disabled:pointer-events-none disabled:opacity-50",
        status === "default" && "border-dashed",
        status === "highlighted" && "border-2 bg-PrimaryContainerLow",
        isInvalid && "opacity-35",
        !isInvalid && "hover:bg-PrimaryContainerLow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-Primary ",
        status === "drag-over" && "border-2 border-dashed bg-PrimaryContainerLow ring-2 ring-Primary ring-offset-2",
        className,
      )}
      {...props}
    >
      <span className="flex w-full items-center justify-center gap-2 text-xs font-medium">
        <Icons.plus className="size-4" aria-hidden="true" />
        <span className="line-clamp-2">{label}</span>
      </span>

      <span className="flex min-h-0 w-full flex-1 flex-wrap content-center items-center gap-2 pl-1">
        {avatars.map((avatar, index) => (
          <Avator
            key={avatar.id ?? `${avatar.fullName}-${index}`}
            fullName={avatar.fullName}
            color={avatar.color}
            size="small"
            className={!avatar.color ? "bg-Primary" : undefined}
          />
        ))}
      </span>
    </button>
  );
}
