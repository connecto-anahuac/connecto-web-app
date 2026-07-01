import Avator from "@/components/Avator";
import { cn } from "@/lib/util";

type Props = React.ComponentPropsWithoutRef<"div"> & {};
export default function SourceTable({
  records,
  className,
  ...props
}: { records: RecordProps[] } & Props) {
  return (
    <div
      className={cn(
        "w-fit h-fit border border-Outline/80 rounded-lg overflow-hidden",
        className,
      )}
      {...props}
    >
      <HeaderRow className={"bg-SurfaceContainerLow"} />
      <Records records={records} />
    </div>
  );
}

type CellProps = React.ComponentPropsWithoutRef<"div"> & {};

function Cell({ children, className, ...props }: CellProps) {
  return (
    <div
      className={cn(
        "h-12 w-40 p-2.5 pr-4 flex items-center content-center justify-start text-xs font-medium text-OnSurface line-clamp-1",
        className,
      )}
      {...props}
    >
      {children}
      {/* <span className="w-full h-fit line-clamp-1">{children}</span> */}
    </div>
  );
}

function HeaderRow({ children, className, ...props }: CellProps) {
  return (
    <div
      className={cn(
        "h-fit w-fit flex gap-0  border-b border-Outline/80  justify-start  text-OnSurfaceVariant bg-SurfaceContainerLow bg-SurfaceBright",
        className,
      )}
      {...props}
    >
      <Cell className="h-9 w-26 pl-4">carrera</Cell>
      <Cell className="h-9">nombre del archivo</Cell>
      <Cell className="h-9">path del archivo</Cell>
      <Cell className="h-9 w-64">última actualización</Cell>
      <Cell className="h-9">actualizado por</Cell>
    </div>
  );
}

export type RecordProps = {
  carrera: string;
  fileName: string;
  filePath: string;
  updatedAt: Date;
  updatedBy: string;
};

function RecordRow({
  carrera,
  fileName,
  filePath,
  updatedAt,
  updatedBy,
  className,
  ...props
}: RecordProps & CellProps) {
  return (
    <div
      className={cn(
        "h-fit w-fit border-b border-Outline/80   flex gap-0  justify-start  ",
        className,
      )}
      {...props}
    >
      <Cell className="font-bold w-26 pl-4">{carrera}</Cell>
      <Cell>{fileName}</Cell>
      {/* <Cell>{filePath}</Cell> */}
      <Cell>
        <span className="w-full h-fit line-clamp-1 whitespace-nowrap ">{filePath}</span>
      </Cell>

      <Cell className=" w-64 flex gap-2.5 items-center">
        <span>{formatted1(updatedAt)}</span> <TimeBadge dateTime={updatedAt} />
      </Cell>
      <Cell className=" flex gap-2">
        <Avator fullName={updatedBy} className="w-4.5 h-4.5 text-xs" />{" "}
        <span className="flex-1 line-clamp-1">{updatedBy}</span>
      </Cell>
    </div>
  );
}

function Records({
  records,
  className,
  ...props
}: { records: RecordProps[] } & CellProps) {
  return (
    <div
      className={cn(
        "h-fit w-fit   flex flex-col gap-0  justify-start  text-OnSurfaceVariant ",
        className,
      )}
      {...props}
    >
      {records.map((record, index) => (
        <RecordRow
          key={index}
          {...record}
          className={records.length - 1 === index ? "border-b-0" : ""}
        />
      ))}
    </div>
  );
}

function TimeBadge({ dateTime }: { dateTime: Date }) {
  const relativeTime = formatRelativeTime(dateTime);
  return (
    <div
      className={cn(
        "text-xs font-bold text-[#929292] bg-[#EBEBEB] rounded-4xl px-2 ",
      )}
    >
      {relativeTime}
    </div>
  );
}

function formatted2(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hour}:${minute}`;
}

const formatted1 = (date: Date) =>
  new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

// 30 jun 2026, 14:35

function formatRelativeTime(dateTime: Date): string {
  const now = new Date();

  const diffMs = now.getTime() - dateTime.getTime();

  if (diffMs < 0) {
    return "hace un rato";
  }

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  // 1分以内
  if (diffMs < minute) {
    return "hace un rato";
  }

  // 1時間以内（5分単位）
  if (diffMs < hour) {
    const mins = Math.floor(diffMs / minute);
    // const rounded = Math.max(5, Math.floor(mins / 5) * 5);

    return mins === 1 ? "hace 1 minuto" : `hace ${mins} minutos`;
  }

  // 1日以内
  if (diffMs < day) {
    const hours = Math.floor(diffMs / hour);

    return hours === 1 ? "hace 1 hora" : `hace ${hours} horas`;
  }

  // 1週間以内
  if (diffMs < week) {
    const days = Math.floor(diffMs / day);

    return days === 1 ? "hace 1 día" : `hace ${days} días`;
  }

  // 1か月以内
  if (diffMs < month) {
    const weeks = Math.floor(diffMs / week);

    return weeks === 1 ? "hace 1 semana" : `hace ${weeks} semanas`;
  }

  // 1年以内
  if (diffMs < year) {
    const months = Math.floor(diffMs / month);

    return months === 1 ? "hace 1 mes" : `hace ${months} meses`;
  }

  const years = Math.floor(diffMs / year);

  return years === 1 ? "hace 1 año" : `hace ${years} años`;
}
