/* 
color

bg
border
foreground
divider
container
oncontainer

*/

import Arrow from "@/components/icon/Arrow";
import Divider from "@/components/Divider";
import { cn } from "@/lib/util";
import Filter from "./Filter";
import SearchBar from "./SearchBar";

type Props = { className?: string };
export default function TopBar({ className }: Props) {
  return (
    <div
      className={cn(
        "bg-header border-solid border h-header-height border-divider rounded-lg min-w-40 text-header-foreground  flex justify-between items-center pl-1.5 pr-5",
        className
      )}
    >
      {/* left side */}
      <div className="flex gap-6 overflow-visible">
        <div className={cn("flex gap-0 items-center")}>
          <Arrow direction="left" />
          <span className={cn("text-xs font-medium")}>lista de alumnos</span>
        </div>
        <Divider direction="vertical" />
      </div>

      {/* right side */}
      <div className={cn("flex gap-2.5 items-center")}>
        <SearchBar />
        <Filter />

        {/* divider */}
        <Divider className={cn("h-6")} />

        <span className={cn(" ")}>
          <Arrow className={cn("")} direction="down" />
        </span>
      </div>
    </div>
  );
}
