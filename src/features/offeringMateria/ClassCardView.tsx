import Image from "next/image";
import { cn } from "@/lib/util";
import { ComponentProps } from "react";
import PersonIcon from "@/components/icon/PersonIcon";
import CourseKey from "@/components/CourseKey";
import CourseValues from "@/components/CourseValues";
import SchoolHatIcon from "@/components/icon/SchoolHatIcon";
import SemesterBadge, { Semester } from "@/components/SemesterBadge";
import { OfferingMaterial } from "./entity";

type Props = ComponentProps<"div"> & {
  offeringClass: OfferingMaterial;
};

export default function OfferingClassCardView({
  offeringClass,
  className,
  ...props
}: Props) {
  return (
    <div
      className={cn(
        "relative flex flex-col gap-2 w-64 rounded-lg bg-[#d6d6d6] p-3 text-black shadow-sm",
        className,
      )}
      {...props}
      
      style={{ backgroundColor: `var(--${offeringClass.keyCode}-light)` }}
    >
      <div className="flex items-center gap-2">
        <CourseKey code={offeringClass.keyCode} number={offeringClass.keyNumber} />
        {/* <CourseValues
          className="ml-auto"
          leftValue={offeringClass.credits.toString()}
          rightValue={offeringClass.hours.toString()}
        /> */}
        <div className="ml-auto text-[0.8rem] flex items-center gap-1" style={{ color: gradeColor }}>
          <PersonIcon className="w-4.5 h-4.5 " />
          {offeringClass.possibleStudentIds.length ?? "--"}
        </div>
      </div>

      <div className="h-8 text-sm font-medium w-full wrap-break-word flex items-center justify-start">
        <span className="w-full line-clamp-2 ">{offeringClass.name}</span>
      </div>
<div className="bg-divider h-px w-full"></div>
<button className="h-fit w-full bg-InverseSurface text-shadow-InverseOnSurface text-xs font-medium">ofertar</button>
      
    </div>
  );
}
