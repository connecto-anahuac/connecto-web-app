import { IconName, Icons } from "@/shared/component/primitive/icon";
import SemesterBadge from "@/shared/component/primitive/SemesterBadge";
import { cn } from "@/shared/lib/util";
import { Period } from "@/shared/types/Period";

export type InformationLineProps = {
  iconName: IconName;
  label: string;
  value: string;
  intent?: "primary" | "secondary" | "tertiary" | "gray";
};

export function InformationLine({
  iconName,
  label,
  value,intent = "primary",
}: InformationLineProps) {
  const IconComponent = Icons[iconName];
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "size-8 flex items-center justify-center p-1.5 rounded-md",
        intent === "primary" && " bg-PrimaryContainer/70 text-OnPrimaryContainer/70 ",
        intent === "secondary" && " bg-SecondaryContainer/70 text-OnSecondaryContainer/70 ",
        intent === "tertiary" && " bg-TertiaryContainer/70 text-OnTertiaryContainer/70 ",
        )}
      >
        <IconComponent className="size-full" />
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-medium text-OnSurface/40 leading-none ">
          {label}
        </span>
        <span className="text-sm font-normal text-OnSurface leading-none">
          {value}
        </span>
      </div>
    </div>
  );
}

export type SemesterInformationLineProps = {
  semester: {
    current: string;
    total: string;
  };
  period: Period;
  iconName: IconName;
};

export function SemesterInformationLine({
  iconName,
  semester,
  period,
}: SemesterInformationLineProps) {
  const IconComponent = Icons[iconName];
  return (
    <div className="flex items-center gap-3">
      <div className="size-8 flex items-center justify-center p-1.5 bg-PrimaryContainer/70 text-OnPrimaryContainer/70 rounded-md">
        <IconComponent className="size-full" />
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-medium text-OnSurface/40 leading-none">
          Semestre
        </span>
        <span className="text-sm font-normal text-OnSurface leading-none flex gap-1 items-baseline">
          {semester.current}{" "}
          <span className="text-xs text-OnSurfaceVariant">
            / {semester.total}
          </span>
        </span>
      </div>

      <div className="flex flex-col gap-0.5 ml-2">
        <span className="text-xs font-medium text-OnSurface/40 leading-none">
          Periodo ingresado
        </span>
        <div className={`flex items-center gap-1 whitespace-nowrap w-fit`}>
          <SemesterBadge semester={period.semester.value} />

          <div className="self-stretch flex py-0.5">
            <div className="w-px bg-[#313131]" />
          </div>

          <div className="flex items-baseline gap-0.5 text-sm leading-none">
            <span className="font-normal text-black">
              {period.year !== null &&
              period.year !== undefined &&
              period.year !== 0
                ? period.year
                : "año"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TotalSemesterInformationLine({
  iconName,
  semester,
}: SemesterInformationLineProps) {
  const IconComponent = Icons[iconName];
  return (
    <div className="flex items-center gap-3">
      <div className="size-8 flex items-center justify-center p-1.5 bg-PrimaryContainer/70 text-OnPrimaryContainer/70 rounded-md">
        <IconComponent className="size-full" />
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-medium text-OnSurface/40 leading-none">
          Semestre
        </span>
        <span className="text-sm font-normal text-OnSurface leading-none flex gap-1 items-baseline">
          {semester.current}{" "}
          <span className="text-xs text-OnSurfaceVariant">
            / {semester.total}
          </span>
        </span>
      </div>

    </div>
  );
}


export function EnrolledPeriodInformationLine({
  iconName,
  period,
}: SemesterInformationLineProps) {
  const IconComponent = Icons[iconName];
  return (
    <div className="flex items-center gap-3">
      <div className="size-8 flex items-center justify-center p-1.5 bg-PrimaryContainer/70 text-OnPrimaryContainer/70 rounded-md">
        <IconComponent className="size-full" />
      </div>

    

      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-medium text-OnSurface/40 leading-none">
          Periodo ingresado
        </span>
        <div className={`flex items-center gap-1 whitespace-nowrap w-fit`}>
          <SemesterBadge semester={period.semester.value} />

          <div className="self-stretch flex py-0.5">
            <div className="w-px bg-[#313131]" />
          </div>

          <div className="flex items-baseline gap-0.5 text-sm leading-none">
            <span className="font-normal text-black">
              {period.year !== null &&
              period.year !== undefined &&
              period.year !== 0
                ? period.year
                : "año"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
