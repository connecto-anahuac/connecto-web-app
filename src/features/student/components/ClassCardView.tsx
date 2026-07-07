import { cn } from "@/shared/lib/util";
import { ComponentProps } from "react";
import CourseKey from "@/components/CourseKey";
import CourseValues from "@/components/CourseValues";
import SchoolHatIcon from "@/components/icon/SchoolHatIcon";
import SemesterBadge, { Semester } from "@/components/SemesterBadge";
import { splitPeriod } from "@/shared/lib/tool";

type Props = ComponentProps<"div"> & {
  courseCode: string;
  courseNumber: string | number;
  credits?: string;
  hours?: string;
  grade: number | null;
  title: string;
  period?: string;
};

export default function StudentClassCardView({
  courseCode,
  courseNumber,
  credits = "--",
  hours = "--",
  grade,
  title,
  period = "-- --",
  className,
  ...props
}: Props) {
  // const year = period.slice(0, 4);
  // const semeNum = period.slice(4);
const {year, semesterNumber: semeNum} = splitPeriod(period);
  // console.log("period", year, "semeNum", semeNum);
  const semester = semeNum === 10 ? "ene-mayo" : semeNum === 40 ? "verano" : semeNum === 60 ? "ago-dec" : "semester" as Semester;
  const gradeColor =
    grade === null
      ? "#202020"
      : grade < 6
      ? "#741313"
      : grade < 8
      ? "#0D7985"
      : "#4F7413";
  return (
    <div
      className={cn(
        "relative flex flex-col gap-2 w-64 rounded-lg bg-[#d6d6d6] p-3 text-black shadow-sm",
        className,
      )}
      {...props}
      
      style={{ backgroundColor: `var(--${courseCode}-light)` }}
    >
      <div className="flex items-center gap-2">
        <CourseKey code={courseCode} number={courseNumber} />
        <CourseValues
          className="ml-auto"
          leftValue={credits}
          rightValue={hours}
        />
      </div>

      <div className="h-8 text-sm font-medium w-full wrap-break-word flex items-center justify-start">
        <span className="w-full line-clamp-2 ">{title}</span>
      </div>

      <div className="flex items-center justify-between w-full" >
        <div className="text-[0.8rem] flex items-center gap-1" style={{ color: gradeColor }}>
          <SchoolHatIcon className="w-4.5 h-4.5 " />
          {grade ?? "--"}
        </div>


        <div
          className={`flex items-center gap-1 whitespace-nowrap w-fit`}
        >
          <SemesterBadge semester={semester} />
        

           <div className="self-stretch flex py-0.5">
            <div className="w-px bg-[#313131]" />
          </div>

          <div className="flex items-baseline gap-0.5 text-xs leading-none">
            <span className="font-normal text-black">{year !== null ? year : "año"}</span>
          </div>
        </div>
        {/* <div className="ml-auto">
          <Image
            src="https://www.figma.com/api/mcp/asset/0727145e-cb78-446c-8be4-3257c806b45a"
            alt="dec"
            width={24}
            height={24}
            className="opacity-60"
          />
        </div> */}
      </div>
    </div>
  );
}
