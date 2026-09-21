import { cn } from "@/shared/lib/util";
import { Icons } from "./icon";

type Props = {
  isCompleted: boolean;
  className?: string;
};
export default function CompleteBadge({ isCompleted, className }: Props) {
  return (
    <div className={cn("text-lg leading-none size-4 font-semibold flex items-center justify-center rounded-full", 
      "bg-DividerMiddle text-black" ,
      isCompleted && "bg-green-500 text-white",
       className)

    }>
      <Icons.check className=" h-3" />
    </div>
  );
}
