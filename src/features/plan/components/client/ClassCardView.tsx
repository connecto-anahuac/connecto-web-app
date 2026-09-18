import { cn } from "@/shared/lib/util";
import { ComponentProps } from "react";
import CourseKey from "@/shared/component/primitive/CourseKey";
import CourseValues from "@/shared/component/primitive/CourseValues";
import { Period } from "@/shared/types/Period";

type Props = ComponentProps<"div"> & {
  courseCode: string;
  courseNumber: string | number;
  credits?: string;
  hours?: string;
  title: string;
};

export default function PlanClassCardView({
  courseCode,
  courseNumber,
  credits = "--",
  hours = "--",
  title,
  className,
  ...props
}: Props) {
  return (
    <div
      className={cn(
        "relative flex flex-col gap-2 w-64 rounded-lg bg-[#d6d6d6] p-3 text-black shadow-sm",
        className,
      )}
      style={{ backgroundColor: `var(--${courseCode}-light)` }}
      {...props}
    >
      <div className="flex items-center gap-2">
        <CourseKey
          code={courseCode}
          number={courseNumber}
          className="text-white"
        />
        <CourseValues
          className="ml-auto"
          leftValue={credits}
          rightValue={hours}
        />
      </div>

      <div className="h-8 text-sm font-medium w-full wrap-break-word flex items-center justify-start">
        <span className="w-full line-clamp-2 ">{title}</span>
      </div>
    </div>
  );
}
