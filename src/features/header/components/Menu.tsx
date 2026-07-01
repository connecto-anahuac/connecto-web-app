/* 
color

bg
border
foreground
divider
container
oncontainer

*/

import { cn } from "@/lib/util";

export default function Menu() {
  return (
    <div
      className={cn(
        "bg-header border-solid border h-header-height border-divider rounded-lg min-w-40 text-header-foreground p-4 flex gap-2.5 items-center",
      )}
    >
      
      <span className={cn(" text-sm font-semibold")}>
        三
      </span>
      <span className={cn("text-xs font-semibold")}>
        Connecto
      </span>
    </div>
  );
}
