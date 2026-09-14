import type { ComponentProps } from "react";
import Avator from "@/shared/component/primitive/Avator";
import CourseKey from "@/shared/component/primitive/CourseKey";
import CourseValues from "@/shared/component/primitive/CourseValues";
import { Icons } from "@/shared/component/primitive/icon";
import { cn } from "@/shared/lib/util";
import { getOrdinalNumberPrefix } from "@/shared/lib/tool";

type Props = ComponentProps<"div"> & {
  courseCode: string;
  courseNumber: string | number;
  hours: string;
  title: string;
  sessionNumber: number;
  recommendedSemester: number;
  classCount: number;
  sessionStudents: number;
  totalStudents: number;
    professorName?: string;
  professorColor?: string;
  classroom?: string;
};

export default function ScheduleClassCard({
  courseCode,
  courseNumber,
  hours = "--",
  title,
  sessionNumber,
  recommendedSemester,
  classCount,
  sessionStudents,
  totalStudents,
  professorName,
  classroom,
  className,professorColor="var(--DividerMiddle)",
  ...props
}: Props) {

    const semester = recommendedSemester+getOrdinalNumberPrefix(recommendedSemester);
  return (
    <div
      data-hasalert="false"
      data-hasmultisession="true"
      data-isdisable="false"
      data-isselected="false"
      data-property-1="1line"
      className={cn(
        "relative flex w-64 flex-col gap-2 rounded-lg p-3 text-OnSurface text-xs",
        className,
      )}
      style={{ backgroundColor: `var(--${courseCode}-light)` }}
      {...props}
    >
      <div className="flex w-full items-center justify-between">
        <CourseKey
          code={courseCode}
          number={courseNumber}
          className="text-white"
        />
        {/* <CourseValues className="ml-auto" leftValue={credits} rightValue={hours} /> */}
        <span className="rounded-sm bg-gray-600/10 px-1 py-0.5  text-neutral-800">
          session-{sessionNumber}
        </span>
      </div>

      <div className="flex h-8 w-full wrap-break-word items-center justify-start  font-medium">
        <span className="w-full line-clamp-2">{title}</span>
      </div>

      <div className="flex w-full items-center justify-between">
        <span className="flex items-baseline gap-0.5">
          <span className="font-medium text-neutral-800">
            {semester}
          </span>
          <span className="text-[10px] text-neutral-600">semestre</span>
        </span>
        <span className="flex items-baseline gap-0.5">
          <span className="font-medium text-neutral-800">{classCount}</span>
          <span className="text-[10px] text-neutral-600">/semana</span>
        </span>
        <span className="flex items-center gap-1 font-medium text-neutral-800">
          <Icons.person className="size-3.5" />
          {sessionStudents}({totalStudents})
        </span>
      </div>

      <div className="h-px w-full rounded-xs bg-DividerMiddle" />

      <div className="flex w-full items-center justify-between gap-5  text-neutral-800">
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <Avator
            fullName={professorName??""}
            size="small"
            color={professorColor}
          />
          <span className="line-clamp-1">{professorName||professorName!==""?professorName:"profesor"}</span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Icons.door className="size-3.5" />
          <span>{classroom||classroom!==""?classroom:"salon"}</span>
        </div>
      </div>
    </div>
  );
}
