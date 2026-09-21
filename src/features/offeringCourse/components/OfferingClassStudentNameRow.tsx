import type { ComponentProps } from "react";

import Avator from "@/shared/component/primitive/Avator";
import { cn } from "@/shared/lib/util";

type Props = ComponentProps<"div"> & {
  fullName: string;
  /** The course colour used by the student's avatar. */
  avatarColor?: string;
  /** Matches the hover variant supplied by the Figma component. */
  isHovered?: boolean;
};

/** A compact student identity row used in offering-class selection controls. */
export default function OfferingClassStudentNameRow({
  fullName,
  avatarColor = "var(--CUL-strong)",
  isHovered = false,
  className,
  ...props
}: Props) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full py-1 pr-2 pl-1",
        isHovered && "bg-DividerMiddle/80",
        className,
      )}
      {...props}
    >
      <Avator
        fullName={fullName}
        size="small"
        className="h-4.5 w-4.5 text-xs font-semibold"
        style={{ backgroundColor: avatarColor }}
      />
      <span className="w-full truncate text-xs font-medium text-OnStudentNumber">
        {fullName}
      </span>
    </div>
  );
}
