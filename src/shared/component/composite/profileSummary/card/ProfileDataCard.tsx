import StudentClassCardView from "@/features/student/components/ui/ClassCardView";
import { GradeStatus } from "@/features/student/types/studentGrade.type";
import ProgressDiffChip from "@/shared/component/primitive/chip/ProgressDiffChip";
import AlertChip from "@/shared/component/primitive/chip/WarningChip";
import { IconName, Icons } from "@/shared/component/primitive/icon";
import { cn } from "@/shared/lib/util";
import { AlertLevel } from "@/shared/types/consts";
import { Period } from "@/shared/types/Period";
import type { ComponentProps, ReactNode } from "react";
export type ProfileDataCardValue = {
  label: string;
  value: string;
};

type BaseProps = ComponentProps<"div"> & {
  iconName: IconName;
  title: string;
  titleTail?: ReactNode;
};

export type ProfileDataCardProps =
  | (BaseProps & {
      valueType: "multi";
      value: ProfileDataCardValue[];
    })
  | (BaseProps & {
      valueType: "count";
      value: CountProps;
    })
  | (BaseProps & {
      valueType: "percent";
      value: PercentProps;
    })
  | (BaseProps & {
      valueType: "warning";
      value: WarningItemProps[];
    })
  | (BaseProps & {
      valueType: "class";
      value: ClassItemProps[];
    })
  | (BaseProps & {
      valueType: "requirement";
      value: RequirementItemProps[];
    });

export default function ProfileDataCard({
  className,
  children,
  titleTail,
  iconName,
  title,
  valueType,
  value,
}: ProfileDataCardProps) {
  // const { iconName, title } = props;
  const IconComponent = Icons[iconName];
  let content: ReactNode;
  let total: number | undefined = undefined;
  let current: number | undefined = undefined;

  switch (valueType) {
    case "multi":
      content = <MultiValues values={value} />;
      break;
    case "count":
      content = <Count {...value} />;
      break;
    case "percent":
      content = <Percentage {...value} />;
      break;
    case "warning":
      content = value.map((item, index) => (
        <WarningItem key={index} {...item} />
      ));
      break;
    case "class":
      content = value.map((item, index) => (
        <StudentClassCardView key={index} {...item} />
      ));
      break;
    case "requirement":
      total = value.length;
      current = value.filter((item) => item.isCompleted).length;
      content = value.map((item, index) => (
        <RequirementItem key={index} {...item} />
      ));
      break;
  }

  return (
    <div
      className={cn(
        "p-3 rounded-xl text-xs flex flex-col gap-3 bg-PrimaryContainerLowest border border-[#E8E4DB]",
        className,
      )}
    >
      {/* title */}
      <div className="flex items-center gap-3 w-full justify-between">
        <div
          className={cn(
            "size-8 flex items-center justify-center p-1.5 rounded-md",
            " bg-PrimaryContainer/70 text-OnPrimaryContainer/70 ",
            " bg-[#E8E4DB] text-OnSurfaceVariant ",
            // intent === "primary" && " bg-PrimaryContainer/70 text-OnPrimaryContainer/70 ",
            // intent === "secondary" && " bg-SecondaryContainer/70 text-OnSecondaryContainer/70 ",
            // intent === "tertiary" && " bg-TertiaryContainer/70 text-OnTertiaryContainer/70 ",
          )}
        >
          <IconComponent className="size-full" />
        </div>

        <div className="text-xs font-medium text-OnSurfaceVariant w-full ">
          {title}
        </div>
        {(titleTail || (total !== undefined && current !== undefined)) && (
          <div className="text-xs font-bold w-fit shrink-0">
            {titleTail ?? `${current} / ${total}`}
          </div>
        )}
      </div>

      {/* values */}
      {children ?? content}
    </div>
  );
}

function MultiValues({ values }: { values: ProfileDataCardValue[] }) {
  return (
    <div className="flex  gap-7">
      {values.map((value, index) => (
        <div key={index} className="flex flex-col items-start gap-1">
          <span className="text-xs font-normal text-OnSurfaceVariant  ">
            {value.label}
          </span>
          <span className="text-lg font-bold text-OnSurface">
            {value.value}
          </span>
        </div>
      ))}
    </div>
  );
}

type CountProps = {
  current: number;
  total: number;
  status: AlertLevel;
};
function Count({ current, total, status }: CountProps) {
  return (
    <div className="flex  justify-between items-center ">
      <div className="flex flex-col items-start gap-1">
        <span className="text-lg font-bold text-OnSurface leading-none flex gap-1 items-baseline">
          {current}{" "}
          <span className="text-sm text-OnSurfaceVariant font-normal">
            / {total}
          </span>
        </span>
      </div>

      <AlertChip status={status} />
    </div>
  );
}
type PercentProps = {
  value: string;
  diff: string;
  status: AlertLevel;
};
function Percentage({ value, diff, status }: PercentProps) {
  return (
    <div className="flex  gap-2.5 items-center ">
      <span className="text-lg font-bold text-OnSurface leading-none flex gap-1 items-baseline">
        {value}{" "}
        <span className="text-sm text-OnSurfaceVariant font-bold">%</span>
      </span>

      <ProgressDiffChip status={status} value={diff} />
    </div>
  );
}

type WarningItemProps = {
  text: string;
};
function WarningItem({ text }: WarningItemProps) {
  return (
    <div className="flex  py-2.5 px-3 items-center bg-AlertHigh/20 rounded-sm">
      <span className="text-sm font-medium text-OnAlertHigh w-full truncate">
        {text}
      </span>
    </div>
  );
}

type RequirementItemProps = {
  text: string;
  isCompleted: boolean;
};
function RequirementItem({ text, isCompleted }: RequirementItemProps) {
  return (
    <div
      className={cn(
        "flex gap-3 py-2.5 px-3 items-center bg-DividerLow rounded-sm",
        "text-OnSurfaceVariant",
        isCompleted && "bg-AlertLow/60 text-OnAlertLow",
      )}
    >
      <span
        className={cn(
          "text-OnSurfaceVariant/40 text-sm ",
          isCompleted && "text-OnAlertLow",
        )}
      >
        ✓
      </span>
      <span className="text-sm font-medium  w-full truncate">{text}</span>
      <span className="text-sm font-normal  ">
        {isCompleted ? "Completado" : "Pendiente"}
      </span>
    </div>
  );
}



type ClassItemProps = {
  courseCode: string;
  courseNumber: string | number;
  credits?: string ;
  hours?: string ;
  grade: number | null;
  title: string;
  period?: Period | null;
  status: GradeStatus;
};
// function RequirementItem({ text, isCompleted }: RequirementItemProps) {
//   return (
//     <div
//       className={cn(
//         "flex gap-3 py-2.5 px-3 items-center bg-DividerLow rounded-sm",
//         "text-OnSurfaceVariant",
//         isCompleted && "bg-AlertLow/60 text-OnAlertLow",
//       )}
//     >
//       <span
//         className={cn(
//           "text-OnSurfaceVariant/40 text-sm ",
//           isCompleted && "text-OnAlertLow",
//         )}
//       >
//         ✓
//       </span>
//       <span className="text-sm font-medium  w-full truncate">{text}</span>
//       <span className="text-sm font-normal  ">
//         {isCompleted ? "Completado" : "Pendiente"}
//       </span>
//     </div>
//   );
// }

