import CourseKey from "@/shared/component/primitive/CourseKey";
import CourseValues from "@/shared/component/primitive/CourseValues";
import PersonIcon from "@/shared/component/primitive/icon/PersonIcon";
import { OfferingCourse } from "../types/offering-course";
import { getTotalEligibleStudents } from "../lib/get-total-eligible-students";
import { cn } from "@/shared/lib/util";
import { ComponentProps } from "react";
import OfferingCourseSemesterRow from "./OfferingCourseSemesterRow";

type Props = ComponentProps<"div"> & {
  offeringClass: OfferingCourse;
};

export default function OfferingCourseDetail({
  offeringClass,
  className,
  ...props
}: Props) {
  const totalEligibleStudents = getTotalEligibleStudents(offeringClass);
  const semesterEntries = Object.entries(offeringClass.possibleStudentIds ?? {})
    .map(([semester, studentIds]) => [Number(semester), studentIds] as const)
    .sort((left, right) => right[0] - left[0]);

  return (
    <div
      className={cn(
        "flex w-64  flex-col gap-2 rounded-lg bg-SurfaceContainerLowest  text-OnSurface ",
        className,
      )}
      {...props}
    >
      <div
        className="flex flex-col items-start gap-2 p-3 pb-4"
        style={{ backgroundColor: `var(--${offeringClass.keyCode}-light)` }}
      >
        <div className="flex items-center gap-2">
          <CourseKey
            code={offeringClass.keyCode}
            number={offeringClass.keyNumber}
            className="text-white"
          />
          <CourseValues
            className="ml-auto"
            leftValue={String(offeringClass.credits)}
            rightValue={String(offeringClass.hours)}
          />
        </div>
        <div className="text-sm font-medium w-full wrap-break-word flex items-center justify-start">
          {offeringClass.name}
        </div>
        <div className="text-sm font-medium gap-1.5 flex items-baseline justify-start text-OnSurface">
          <span className="text-xs font-medium text-OnSurfaceVariant">
            semestre ideal:
          </span>
          <span className="">{offeringClass.semester}</span>
        </div>
      </div>
      {/* <div className="w-full min-h-px bg-gray-400/50" /> */}

      <div className="flex items-center gap-3 px-3">
        <span className="text-xs font-medium">Total:</span>
        <div className=" flex items-center gap-1 text-sm">
          <PersonIcon className="h-4.5 w-4.5" />
          {totalEligibleStudents}
        </div>
      </div>
      <div className="flex flex-col gap-0 w-full flex-1 overflow-y-auto px-3 pl-2">
        {semesterEntries.length > 0 &&
          semesterEntries.map(([semester, studentIds]) => (
            <OfferingCourseSemesterRow
              className="w-full  border-b border-Outline/50 "
              key={semester}
              semesterLabel={String(semester)}
              studentCount={studentIds.length}
            />
          ))}
      </div>
    </div>
  );
}
