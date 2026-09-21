import { cn } from "@/shared/lib/util";
import { Icons } from "./icon";

type Props = {
  level: "low" | "medium" | "high";
  className?: string;
};
export default function Alert({ level, className }: Props) {
  const bgColor = level === "low" ? "bg-green-500" : level === "medium" ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className={cn("text-lg leading-none size-4 font-semibold flex items-center justify-center rounded-full", 
      level === "low" ? "bg-green-500 text-black" : level === "medium" ? "bg-yellow-500 text-black" : "bg-red-500 text-white"
      , className)

    }>
      <Icons.exclamtion className=" h-3" />
    </div>
  );
}
