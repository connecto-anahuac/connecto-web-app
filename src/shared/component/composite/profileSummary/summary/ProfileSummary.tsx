import Image from "next/image";
import {
  InformationLine,
  InformationLineProps,
  SemesterInformationLine,
} from "../infoline/InformationLine";
import { cn } from "@/shared/lib/util";
import { StudentStatus } from "@/shared/types/consts";
import { STUDENT_STATUS_OPTIONS } from "@/features/student/types/deprecated/studentFilterConfigs";
import { Period } from "@/shared/types/Period";
import { ComponentProps } from "react";
export type Informations = {
  id: InformationLineProps;
  name: InformationLineProps;
  career: InformationLineProps;
  semester: InformationLineProps;
  enrolledPeriod: InformationLineProps;
  nationality: InformationLineProps;

  schoolMail: InformationLineProps;
  personalMail: InformationLineProps;
  phone: InformationLineProps;
};
type Props = ComponentProps<"div"> & {
  infomations: Informations;
  imgSrc: string;
  status: StudentStatus;
  planTotalSemesters: number;
};

export default function ProfileSummary({
  infomations,
  imgSrc,
  status,
  planTotalSemesters,
  className,
  ...props
}: Props) {
  return (
    <div className={cn("flex flex-col gap-5", className)} {...props}>
      {/* photo & name */}
      <div className="flex items-center gap-3">
        <div className="size-fit relative">
          <Image
            src={imgSrc}
            alt="Profile photo"
            width={88}
            height={88}
            className="rounded-full w-22 h-auto"
          />
          <div
            className={cn(
              "absolute rounded-full bottom-0 right-0 size-5 border-[3px] border-PrimaryContainerLowest",
              "bg-gray-500",
              status === StudentStatus.ACTIVE && "bg-green-300",
            )}
          />
        </div>
        <span className="font-medium text-sm text-OnSurface w-full">
          {infomations.name.value}
        </span>
      </div>

      {/* info */}
      <div className="flex flex-col gap-3">
        {Object.keys(infomations).map((key, index) => {
          if (key === "schoolMail" || key === "personalMail" || key === "phone")
            return null;
          if (key === "name") return null;
          if (key === "enrolledPeriod") return null;

          const info = infomations[key as keyof Informations];

          if (key === "semester")
            return (
              <SemesterInformationLine
                semester={{
                  current: info.value,
                  total: planTotalSemesters.toString(),
                }}
                period={new Period(infomations.enrolledPeriod.value)}
                iconName={info.iconName}
              />
            );

          return (
            <InformationLine
              key={index}
              iconName={info.iconName}
              label={info.label}
              value={info.value}
            />
          );
        })}
      </div>

      {/* contact */}
      <div className="flex flex-col gap-3">
        {Object.keys(infomations).map((key, index) => {
          if (key !== "schoolMail" && key !== "personalMail" && key !== "phone")
            return null;

          const info = infomations[key as keyof Informations];

          return (
            <InformationLine
              key={index}
              iconName={info.iconName}
              label={info.label}
              value={info.value}
              intent="tertiary"
            />
          );
        })}
      </div>
    </div>
  );
}
