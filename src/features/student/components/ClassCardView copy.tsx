import Image from "next/image";
import { cn } from "@/lib/util";
import { ComponentProps } from "react";
import PersonIcon from "@/components/icon/PersonIcon";

type Props = ComponentProps<"div"> & {
  courseCode: string;
  courseNumber: string | number;
  sessions?: number;
  title: string;
  semester?: string;
  frequency?: string;
  occupancy?: string;
  instructor?: string;
  avatar?: string; // initials
  hasAlert?: boolean;
};

export default function ClassCardView({
  courseCode,
  courseNumber,
  sessions = 0,
  title,
  semester = "3ro",
  frequency = "3",
  occupancy = "15(31)",
  instructor = "",
  avatar = "",
  hasAlert = false,
  className,
  ...props
}: Props) {
  return (
    <div
      className={cn(
        "relative w-64 rounded-lg bg-[#d6d6d6] p-3 text-black shadow-sm",
        className,
      )}
      {...props}
    >
      {hasAlert && (
        <div className="absolute -top-2 -right-2 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-[#f4e070] border border-[#4f4f4f] text-[10px] font-black">
          !
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <div
            className="rounded-md bg-[#595959] px-2 py-0.5 text-xs font-medium text-[#e3e3e3]"
            style={{ backgroundColor: `var(--${courseCode}-strong)` }}
          >
            {courseCode}
          </div>
          <div className="rounded-md bg-[#e9e9e9] px-2 py-0.5 text-xs text-[#4d4d4d]">
            {courseNumber}
          </div>
        </div>
        <div className="ml-auto">
          {sessions > 0 &&
            Array.from({ length: sessions }).map((_, i) => (
              <div
                key={i}
                className="rounded px-2 py-0.5 text-xs text-[#202020] bg-[#b0b0b0]"
              >
                session-{i + 1}
              </div>
            ))}
          {/* <div className="rounded px-2 py-0.5 text-xs text-[#202020] bg-[#b0b0b0]">
            {sessions} sesiones
          </div> */}
        </div>
      </div>

      <div className="mt-2 text-sm font-medium truncate">{title}</div>

      <div className="mt-2 flex items-center text-xs text-[#595959]">
        <div className="flex-1">{semester} semestre</div>
        <div className="flex-1 text-center">{frequency} x/semana</div>
        <div className="flex-1 text-right flex items-center justify-end gap-1">
          <PersonIcon className="h-3 w-3 text-[#202020]" />
          <span className="font-medium text-[13px] text-[#202020]">
            {occupancy}
          </span>
        </div>
      </div>

      <div className="my-2 h-px w-full bg-[#b0b0b0]" />

      <div className="flex items-center gap-2">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#404040] text-xs font-semibold text-white">
          {avatar}
        </div>
        <div className="text-xs text-[#202020]">{instructor}</div>
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
