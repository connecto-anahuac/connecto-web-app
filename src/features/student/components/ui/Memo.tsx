import EditIcon from "@/shared/component/primitive/icon/EditIcon";
import UnvisibleIcon from "@/shared/component/primitive/icon/UnvisibleIcon";
import ZoomInIcon from "@/shared/component/primitive/icon/ZoomInIcon";
import { cn } from "@/shared/lib/util";

type Props = {
  className?: string;
  memo: string;
};
export default function Memo({ className, memo }: Props) {
  return (
    <div className={cn("relative rounded-sm overflow-hidden bg-header-container text-foreground p-2.5 pb-4", className)}>
      <span className="text-[0.8rem] font-normal w-full ">{memo}</span>
    {/* controller */}
      <div className="absolute bottom-0 right-0 px-2 py-1.5 flex gap-4.5 bg-header-container rounded-tl-lg"
        style={{
        boxShadow: "-30px -6px 30px 6px var(--color-header-container)"
      }}>
        <EditIcon />
        <UnvisibleIcon />
        <ZoomInIcon/>
      </div>
    </div>
  );
}
