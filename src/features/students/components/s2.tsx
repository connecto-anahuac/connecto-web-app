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
	const progressValue = typeof progress === "number" ? `${progress}%` : student.plan;
	const statusTone = getStatusTone(student.status);

	return (
		<article
			className={cn(
				"flex w-full min-w-0 flex-col gap-3 rounded-[16px] border border-[#dad0c4] bg-[#f7f2ec] px-3 py-2.5 text-[#2d2620] transition-colors",
				className,
			)}
		>
			<div className="flex items-start gap-2">
				<div className="relative shrink-0">
					<Avator
						fullName={student.name}
						className="h-9 w-9 text-sm font-semibold"
						style={{ backgroundColor: `var(${student.avatarColorCssVar})` }}
					/>
					<span
						aria-hidden="true"
						className={cn(
							"absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-[#f7f2ec]",
							statusTone.dotClass,
						)}
					/>
				</div>

				<div className="flex min-w-0 flex-1 items-start justify-between gap-2">
					<div className="min-w-0">
						<p className="truncate text-[13px] font-semibold leading-4 text-[#2b2118]">
							{student.name}
						</p>
						<p className="mt-1 truncate text-[11px] font-medium leading-4 text-[#7b7065]">
							{student.career}
						</p>
					</div>

					<StudyPlan
						plan={student.plan}
						className="shrink-0 rounded-full bg-[#e8ddd0] px-2 py-1 text-[10px] font-semibold text-[#5f5142]"
					/>
				</div>
			</div>

			<div className="flex items-end gap-3 pl-0.5">
				<Metric label="sem." value={semesterValue} />
				<div className="flex min-w-0 items-end gap-1.5">
					<Metric label="avance" value={progressValue} />
					<span className="mb-0.5 rounded-full bg-[#d9f0cd] px-1.5 py-0.5 text-[10px] font-semibold leading-4 text-[#4d7a2d]">
						{formatDelta(progressDelta)}
					</span>
				</div>

				<div className="ml-auto flex items-center gap-1.5 pb-0.5 text-[#53473b]">
					<IconButton label="School email">
						<SchoolEmailIcon className="h-[18px] w-[21px]" />
					</IconButton>
					<IconButton label="Personal email">
						<EmailIcon className="h-[18px] w-[17px]" />
					</IconButton>
					<IconButton label="WhatsApp">
						<WhatsAppIcon className="h-[18px] w-[18px]" />
					</IconButton>
				</div>
			</div>
		</article>
	);
}

function Metric({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex flex-col gap-0.5 leading-none">
			<span className="text-[10px] font-medium uppercase tracking-[0.02em] text-[#9b8f84]">
				{label}
			</span>
			<span className="text-xs font-semibold text-[#2b2118]">{value}</span>
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
