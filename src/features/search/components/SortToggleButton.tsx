import { cn } from "@/shared/lib/util";
import { ComponentProps } from "react";

type Props = ComponentProps<"div"> & {
    ValurType: "text" | "number";
    sortType: "asc" | "desc";
};

export function SortToggleButton({ className, ...props }: Props) {
    return <div className={cn("", className)} {...props}>
      
  </div>;
}
