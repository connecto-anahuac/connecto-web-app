import Alert from "@/components/Alert";
import Avator from "@/components/Avator";
import EmailIcon from "@/components/icon/contact/EmailIcon";
import SchoolEmailIcon from "@/components/icon/contact/SchoolEmailIcon";
import WhatsAppIcon from "@/components/icon/contact/WhatsAppIcon";
import StudyPlan from "@/components/StudyPlan";
import type { StudentListItem } from "@/features/students/types/student-list-item";
import { cn } from "@/shared/lib/util";

type Props = {
  className?: string;
  student: StudentListItem;
  progress?: number;
  progressDelta?: number;
};

export default function StudentCard({
  className,
  student,
  progress,
  progressDelta = 0,
}: Props) {
  const semesterValue = formatSemester(student.currentSemester);
  const progressValue = typeof progress === "number" ? `${progress}%` : "63%";
  const statusTone = getStatusTone(student.status);

  return (
    <article
      className={cn(
        "relative flex w-full min-w-66 flex-col gap-1.5 rounded-2xl border border-[#dad0c4] bg-[#f7f2ec] px-3 py-2.5 text-[#2d2620] transition-colors",
        className,
      )}
    >
      {student.failCount > 2 ? (
        <Alert level={"high"} className="absolute top-2 right-2"/>
      ) : student.failCount > 0 ? (
        <Alert level={"medium"}  className="absolute top-2 right-2"/>
      ) : null}
      <div className="flex items-start gap-2">
        <div className="relative shrink-0">
          <Avator
            fullName={student.name}
            className="h-9 w-9 text-base font-semibold"
            style={{ backgroundColor: `var(${student.avatarColorCssVar})` }}
          />
          <span
            aria-hidden="true"
            className={cn(
              "absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-[#f7f2ec]",
              statusTone.dotClass,
            )}
          />
        </div>

        <div className="flex flex-col min-w-0 flex-1 items-start justify-between gap-1.5">
          <div className="min-w-0 w-full">
            <p className="w-full leading-none line-clamp-1 text-base font-semibold  text-OnSurface">
              {student.name}
            </p>
          </div>

          <div className="min-w-0 w-full flex items-center gap-2">
            {/* <span className="text-[10px] font-medium   text-OnSurfaceVariant/75">
             id
            </span>
            <p className="w-fit  text-xs font-semibold  text-OnSurfaceVariant mr-4">
              {student.id}
            </p> */}
            <p className="w-fit max-w-full line-clamp-1 text-[11px] font-medium  text-OnSurfaceVariant">
              {student.career}
            </p>
            <StudyPlan
              plan={student.plan}
              className="shrink-0   text-[10px] "
            />
          </div>
        </div>
      </div>

      <div className="flex items-end gap-6 pl-1">
        <Metric label="sem.">{semesterValue}</Metric>
        <Metric label="avance">
          <div className="flex items-end gap-1">
            {progressValue}
            <span className="rounded-sm bg-[#d9f0cd] px-1.5 py-0.5 text-[10px] font-semibold leading-4 text-[#4d7a2d]">
              {formatDelta(progressDelta)}
            </span>
          </div>
        </Metric>

        {/* <MetricContact label="contacto" /> */}
        <Metric label="contacto">
          <span className="flex items-center gap-1 pb-0.5 text-OnSurfaceVariant">
            <IconButton label="School email">
              <SchoolEmailIcon className="h-[18px] w-[21px]" />
            </IconButton>
            <IconButton label="Personal email">
              <EmailIcon className="h-[18px] w-[17px]" />
            </IconButton>
            <IconButton label="WhatsApp">
              <WhatsAppIcon className="h-[18px] w-[18px]" />
            </IconButton>
          </span>
        </Metric>
      </div>
    </article>
  );
}

function Metric({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-start justify-between h-9">
      <span className="text-[10px] font-medium   text-OnSurfaceVariant/75 uppercase">{label}</span>
      <span className="text-sm font-normal text-OnSurface">{children}</span>
    </div>
  );
}


function IconButton({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-[#ebe1d5]"
    >
      {children}
    </button>
  );
}

function formatSemester(semester: string) {
  const numericSemester = semester.match(/\d+/)?.[0];

  return numericSemester ?? semester;
}

function formatDelta(delta: number) {
  return `${delta > 0 ? "+" : ""}${delta}%`;
}

function getStatusTone(status: string) {
  if (["Inactivo", "Baja Académica", "Baja voluntaria"].includes(status)) {
    return {
      dotClass: "bg-[#92857a]",
    };
  }

  return {
    dotClass: "bg-[#75b24c]",
  };
}
