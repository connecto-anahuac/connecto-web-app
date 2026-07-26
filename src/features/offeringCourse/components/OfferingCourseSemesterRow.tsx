import type { ComponentProps } from "react";

import Arrow from "@/components/icon/Arrow";
import PersonIcon from "@/components/icon/PersonIcon";
import { cn } from "@/shared/lib/util";
import TriangleArrowIcon from "@/components/icon/TriangleArrowIcon";
import SemesterBadge, { SemesterValue } from "@/components/SemesterBadge";

type Props = ComponentProps<"div"> & {
  semesterLabel: string;
  studentCount: number;
  onAdd?: () => void;
  showLeadingArrow?: boolean;
};

export default function OfferingCourseSemesterRow({
  semesterLabel,
  studentCount,
  onAdd,
  showLeadingArrow = true,
  className,
  ...props
}: Props) {
  const { year, semester } = getItems(Number(semesterLabel));
  return (
    <div
      className={cn(
        "flex w-65 items-center gap-2.5 rounded-md bg-SurfaceContainerLowest py-3 pr-2 text-connecto-muted-strong",
        className,
      )}
      {...props}
    >
      {/* {showLeadingArrow ? (
				<Arrow className="h-6 w-6 text-connecto-muted-strong" direction="left" />
			) : (
				<div className="h-6 w-6" aria-hidden="true" />
			)} */}
      <div
        className="h-6 w-6 flex items-center justify-center"
        aria-hidden="true"
      >
        <TriangleArrowIcon />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="text-sm leading-5 font-medium text-connecto-muted-strong">
          Semester {semesterLabel}
        </div>
        <div className={`flex items-center gap-1 whitespace-nowrap w-fit`}>
          <SemesterBadge semester={semester} />

          <div className="self-stretch flex py-0.5">
            <div className="w-px bg-[#313131]" />
          </div>

          <div className="flex items-baseline gap-0.5 text-xs leading-none">
            <span className="font-normal text-black">
              {year !== null && year !== undefined && year !== 0 ? year : "año"}
            </span>
          </div>
        </div>
        {/* <div className="flex items-center gap-[3px] text-xs leading-4 text-connecto-ink">
					<span>{periodLabel}</span>
					<span
						className="h-3.25 w-px rounded-full bg-connecto-ink/80"
						aria-hidden="true"
					/>
					<span>{yearLabel}</span>
				</div> */}
      </div>

      <div className="rounded-select-fill-left flex items-center gap-[3px] bg-connecto-select-fill py-5px pl-4px pr-7px text-connecto-muted-strong">
        <PersonIcon className="h-5 w-5" />
        <span className="text-sm leading-5 font-medium">{studentCount}</span>
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="flex ml-auto h-6 w-6 items-center justify-center text-connecto-muted-strong transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-connecto-muted-strong"
        aria-label={`Add ${semesterLabel}`}
      >
        <span className="text-xl leading-none">+</span>
      </button>
    </div>
  );
}

const getItems = (semester: number): { year: number; semester: SemesterValue } => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // Months are zero-based
  const currentSemnum = currentMonth > 8 ? 1 : 2;
  const y = Math.floor(semester / 2);
  const y2 = semester % 2;

  if (currentSemnum === 2) {
    if (y2 === 0) {
      const semNum = currentSemnum;
      const year = currentYear - y;
      return { year, semester: getSemesterLabel(semNum) };
    }
    const semNum = currentSemnum - (y2 % 2) == 0 ? 2 : 1;
    const year = currentYear - y - 1;
    return { year, semester: getSemesterLabel(semNum) };
  }
  const semNum = currentSemnum - (y2 % 2) == 0 ? 2 : 1;
  const year = currentYear - y;
  return { year, semester: getSemesterLabel(semNum) };
};

const getSemesterLabel = (semester: number): SemesterValue => {
  const semLabel = semester === 1 ? "ene-mayo" : "ago-dec";
  return semLabel;
};
