import type { ComponentProps } from "react";
import Avator from "@/shared/component/primitive/Avator";
import CourseKey from "@/shared/component/primitive/CourseKey";
import { Icons } from "@/shared/component/primitive/icon";
import { cn } from "@/shared/lib/util";
import { getOrdinalNumberPrefix } from "@/shared/lib/tool";
import Alert from "@/shared/component/primitive/Alert";
import CompleteBadge from "@/shared/component/primitive/CompleteBadge";

export type ScheduleClassCardProps = ComponentProps<"div"> & {
  courseCode: string;
  courseNumber: string | number;
  hours: string | number;
  title: string;
  sessionNumber?: number;
  recommendedSemester: number;
  classCount?: number;
  sessionStudents?: number;
  totalStudents?: number;
  professorName?: string;
  professorColor?: string;
  classroom?: string;
  selected?: boolean;
  completed?: boolean;
  warning?: "low" | "mid" | "high";
  dragging?: boolean;
  disabled?: boolean;
  type?: "shell" | "builder";
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
  className,
  professorColor = "var(--DividerMiddle)",
  selected = false,
  completed = false,
  warning,
  dragging = false,
  disabled = false,
  type = "builder",
  ...props
}: ScheduleClassCardProps) {
  const alertLevel = warning === "mid" ? "medium" : warning;
  const semester =
    recommendedSemester + getOrdinalNumberPrefix(recommendedSemester);
  const hasStudentCount =
    sessionStudents !== undefined || totalStudents !== undefined;

  return (
    <div
      data-hasalert={Boolean(warning)}
      data-hasmultisession={sessionNumber !== undefined}
      data-isdisable={disabled}
      data-isselected={selected}
      data-completed={completed}
      data-dragging={dragging}
      aria-disabled={disabled || undefined}
      data-property-1="1line"
      className={cn(
        "relative flex w-64 flex-col gap-2 rounded-lg p-2  text-OnSurface text-xs transition-[opacity,box-shadow]",
        "border-3 border-transparent",
        selected && "border-3 border-Primary/50  shadow-md",
        // completed && "opacity-60",
        // warning && "ring-2 ring-Error",
        dragging && "opacity-40 cursor-grabbing",
        disabled && "pointer-events-none",
        className,
      )}
      style={{ backgroundColor: `var(--${courseCode}-light)` }}
      {...props}
    >
      {alertLevel && (
        <Alert
          level={alertLevel}
          className="absolute top-0 right-0 -translate-y-1/5 translate-x-1/5"
        />
      )}
      {completed && (
        <CompleteBadge
          isCompleted={completed}
          className="absolute top-0 right-0 -translate-y-1/5 translate-x-1/5"
        />
      )}

      <div className="flex w-full items-center justify-between  text-[0.625rem]">
        <CourseKey
          code={courseCode}
          number={courseNumber}
          className="text-white text-[0.625rem]"
        />
        {sessionNumber !== undefined ? (
          <span className="rounded-sm bg-gray-600/10 px-1 py-0.5 text-neutral-800">
            {type === "shell" ? (
              <span>
                {sessionNumber} sesion{sessionNumber > 1 ? "es" : ""}
              </span>
            ) : (
              <span className="text-neutral-800">sesion-{sessionNumber}</span>
            )}
          </span>
        ) : (
          <span className="text-neutral-800">{hours} Hrs.</span>
        )}
      </div>

      <div
        className={cn(
          "flex h-8 w-full items-center justify-start  font-medium text-sm",
          " wrap-break-word",
         "break-all ",
        )}
      >
        <span className="w-full line-clamp-2">{title}</span>
      </div>

      <div className="flex w-full items-center justify-between">
        <span className="flex items-baseline gap-0.5">
          <span className="font-medium text-neutral-800">{semester}</span>
          <span className="text-[10px] text-neutral-600"> semestre</span>
        </span>
        {classCount !== undefined && (
          <span className="flex items-baseline gap-0.5">
            <span className="font-medium text-neutral-800">{classCount}</span>
            <span className="text-[10px] text-neutral-600">x semana</span>
          </span>
        )}
        {hasStudentCount && (
          <span className="flex items-center gap-1 font-medium text-neutral-800">
            <Icons.person className="size-3.5" />
            {sessionStudents !== undefined && totalStudents !== undefined
              ? `${sessionStudents}(${totalStudents})`
              : (sessionStudents ?? totalStudents)}
          </span>
        )}
      </div>
      {type == "builder" && (
        <>
          {" "}
          <div className="h-px w-full rounded-xs bg-DividerMiddle" />
          <div className="flex w-full items-center justify-between gap-5 text-neutral-800">
            <div className="flex min-w-0 flex-1 items-center gap-1">
              <Avator
                fullName={professorName ?? ""}
                size="small"
                color={professorColor}
              />
              <span className="line-clamp-1">
                {professorName ?? "Profesor"}
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <Icons.door className="size-3.5" />
              <span>{classroom ?? "Salon"}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
