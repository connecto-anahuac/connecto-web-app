import Avator from "@/components/Avator";
import { cn } from "@/shared/lib/util";

type Props = React.ComponentPropsWithoutRef<"div"> & {
  records: RecordProps[];
};

export default function SourceTable({
  records,
  className,
  ...props
}: Props) {
  return (
    <div
      className={cn(
        "h-fit w-fit overflow-hidden rounded-lg border border-Outline/80",
        className,
      )}
      {...props}
    >
      <HeaderRow className="bg-SurfaceContainerLow" />
      <Records records={records} />
    </div>
  );
}

type CellProps = React.ComponentPropsWithoutRef<"div">;

function Cell({ children, className, ...props }: CellProps) {
  return (
    <div
      className={cn(
        "flex h-12 w-40 items-center justify-start pl-2.5 pr-4 text-xs font-medium text-OnSurface truncate",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function HeaderRow({ className, ...props }: CellProps) {
  return (
    <div
      className={cn(
        "flex h-fit w-fit gap-0 border-b border-Outline/80 justify-start text-OnSurfaceVariant bg-SurfaceContainerLow",
        className,
      )}
      {...props}
    >
      <Cell className="h-9 w-26 pl-4">carrera</Cell>
      <Cell className="h-9">nombre del archivo</Cell>
      <Cell className="h-9">path del archivo</Cell>
      <Cell className="h-9 w-68">ultima actualizacion</Cell>
      <Cell className="h-9">actualizado por</Cell>
    </div>
  );
}

export type RecordProps = {
  career: string;
  fileName: string;
  filePath: string;
  updatedAt: Date;
  updatedBy: string;
};

function RecordRow({
  career,
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
        "flex h-fit w-fit gap-0 border-b border-Outline/80 justify-start",
        className,
      )}
      {...props}
    >
      <Cell className="w-26 pl-4 font-bold">{career}</Cell>
      <Cell>{fileName}</Cell>
      <Cell>
        <span className="h-fit w-full line-clamp-1 whitespace-nowrap">{filePath}</span>
      </Cell>
      <Cell className="w-68 items-center gap-2.5 flex">
        <span>{formatAbsoluteTime(updatedAt)}</span>
        <TimeBadge dateTime={updatedAt} />
      </Cell>
      <Cell className="gap-2 flex">
        <Avator fullName={updatedBy} className="h-5 w-5 text-xs font-medium" size="small"/>
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
        "flex h-fit w-fit flex-col gap-0 justify-start text-OnSurfaceVariant",
        className,
      )}
      {...props}
    >
      {records.map((record, index) => (
        <RecordRow
          key={`${record.fileName}-${record.updatedAt.toISOString()}-${index}`}
          {...record}
          className={records.length - 1 === index ? "border-b-0" : ""}
        />
      ))}
    </div>
  );
}

function TimeBadge({ dateTime }: { dateTime: Date }) {
  return (
    <div className="w-fit h-fit rounded-4xl bg-[#EBEBEB] px-2 text-xs font-semibold text-[#929292]">
      {formatRelativeTime(dateTime)}
    </div>
  );
}

const formatAbsoluteTime = (date: Date) =>
  new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

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

  if (diffMs < minute) {
    return "hace un rato";
  }

  if (diffMs < hour) {
    const minutes = Math.floor(diffMs / minute);
    return minutes === 1 ? "hace 1 minuto" : `hace ${minutes} minutos`;
  }

  if (diffMs < day) {
    const hours = Math.floor(diffMs / hour);
    return hours === 1 ? "hace 1 hora" : `hace ${hours} horas`;
  }

  if (diffMs < week) {
    const days = Math.floor(diffMs / day);
    return days === 1 ? "hace 1 dia" : `hace ${days} dias`;
  }

  if (diffMs < month) {
    const weeks = Math.floor(diffMs / week);
    return weeks === 1 ? "hace 1 semana" : `hace ${weeks} semanas`;
  }

  if (diffMs < year) {
    const months = Math.floor(diffMs / month);
    return months === 1 ? "hace 1 mes" : `hace ${months} meses`;
  }

  const years = Math.floor(diffMs / year);
  return years === 1 ? "hace 1 ano" : `hace ${years} anos`;
}