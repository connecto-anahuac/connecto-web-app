import { cn } from "@/shared/lib/util";

type Props = {
  className?: string;
  period?: string;
};

export default function ScheduleBuilderCanvasContainer({ className, period }: Props) {
    return (
        <div className={cn("", className)}></div>
   
    );
}