import { cn } from "@/shared/lib/util";

type Props = {
  className?: string;
  period?: string;
  career?: string;
};

export default function OfferingCourseShellContainer({
  className,
  period,
  career,
}: Props) {
  return <div className={cn("", className)}></div>;
}
