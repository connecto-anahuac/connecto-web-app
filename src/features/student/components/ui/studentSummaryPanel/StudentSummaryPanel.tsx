import Avator from "@/components/Avator";
import EmailIcon from "@/components/icon/contact/EmailIcon";
import SchoolEmailIcon from "@/components/icon/contact/SchoolEmailIcon";
import WhatsAppIcon from "@/components/icon/contact/WhatsAppIcon";
import StudyPlan from "@/components/StudyPlan";
import Memo from "@/features/student/components/ui/Memo";
import { cn } from "@/shared/lib/util";
import type { StudentDetail } from "./studentSummary.type";
import Alert from "@/components/Alert";
import SemesterBadge from "@/components/SemesterBadge";

type Props = {
  className?: string;
  summary: StudentDetail;
};

export function StudentSummaryPanel({ className, summary }: Props) {
  return (
    <aside
      className={cn(
        "flex w-60 shrink-0 flex-col gap-4 rounded-2xl border border-[#dad0c4] bg-[#f7f2ec] p-4 text-[#2d2620]",
        className,
      )}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <Avator
            size="large"
            fullName={summary.profile.name}
            className="h-12 w-12 text-lg font-semibold"
            style={{ backgroundColor: `var(${summary.avatarColorCssVar})` }}
          />

          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <span className="rounded-full bg-[#75b24c] px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
                {summary.profile.status}
              </span>
            </div>
            <h2 className="line-clamp-2 text-base font-semibold leading-tight">
              {summary.profile.name}
            </h2>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase text-[#6e6258]">
            Carrera
          </span>
          <span className="text-sm font-medium">{summary.career}</span>
          {/* <StudyPlan plan={summary.plan} className="w-fit text-[11px]" /> */}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">

         <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium uppercase text-[#6e6258]">
        Semestre ingresado
      </span>
         <div className={`flex items-center gap-1 whitespace-nowrap w-fit`}>
          <SemesterBadge semester={summary.profile.enrolledSemester} />

          <div className="self-stretch flex py-0.5">
            <div className="w-px bg-[#313131]" />
          </div>

          <div className="flex items-baseline gap-0.5 text-xs leading-none">
            <span className="font-normal text-black">
              {summary.profile.enrolledYear !== 0
                ? summary.profile.enrolledYear
                : "año"}
            </span>
          </div>
        </div>
    </div>
     
        <InfoItem
          label="semestre actual"
          value={String(summary.profile.currentSemester)}
        />
        <InfoItem
          label="semestres regulares"
          value={String(summary.profile.regularSemestersCount)}
        />
        <InfoItem label="avance" value={summary.advanceLabel} />
        {/* <InfoItem
          label="reprobados"
          value={String(summary.failedCoursesCount)}
        /> */}
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-medium uppercase text-[#6e6258]">
            reprobados
          </span>
          <span className="text-sm text-[#2d2620] flex gap-2 items-center">
            {summary.failedCoursesCount}
            {summary.failedCoursesCount > 2 ? (
              <Alert level={"high"} className="" />
            ) : summary.failedCoursesCount > 0 ? (
              <Alert level={"medium"} className="" />
            ) : null}
          </span>
        </div>
        <InfoItem label="actualmente" value={summary.currentCoursesLabel} />
        <InfoItem label="requisito" value={summary.requirementLabel} />
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium uppercase text-[#6e6258]">
          Contacto
        </span>
        <div className="flex items-center gap-2 text-[#5b5149]">
          <ContactIconButton label="School email">
            <SchoolEmailIcon className="h-4.5 w-5.25" />
          </ContactIconButton>
          <ContactIconButton label="Personal email">
            <EmailIcon className="h-4.5 w-4.25" />
          </ContactIconButton>
          <ContactIconButton label="WhatsApp">
            <WhatsAppIcon className="h-4.5 w-4.5" />
          </ContactIconButton>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium uppercase text-[#6e6258]">
          #sym:Memo
        </span>
        <Memo
          memo={summary.memo}
          className="h-28 w-full max-w-full bg-[#efe5d8]"
        />
      </div>
    </aside>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium uppercase text-[#6e6258]">
        {label}
      </span>
      <span className="text-sm text-[#2d2620]">{value}</span>
    </div>
  );
}

function ContactIconButton({
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
      className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ebe1d5] transition-colors hover:bg-[#dfd2c4]"
    >
      {children}
    </button>
  );
}
