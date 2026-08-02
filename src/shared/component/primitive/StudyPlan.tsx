import { cn } from "@/shared/lib/util";

type Props = {
  plan: string;
  className?: string;
};
export default function StudyPlan({ plan, className }: Props) {
  return (
    <div className={cn("text-xs font-medium px-1 py-0.5 rounded-sm bg-header-container text-header-on-container", className)}>
      {plan}
    </div>
  );
}
