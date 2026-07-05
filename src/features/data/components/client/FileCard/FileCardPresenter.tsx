import { useId } from "react";
import { CARRERAS, FILE_TYPES } from "@/features/data/domain/consts";
import { cn } from "@/lib/util";
import type { FileLike, FileType } from "./useFileCard";

type Props = {
  career: string;
  className?: string;
  file: FileLike;
  fileType: FileType;
  progress?: number;
  oncareerChange: (value: string) => void;
  onFileTypeChange: (value: FileType) => void;
  onRemove?: () => void;
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function FileCardPresenter({
  career,
  className,
  file,
  fileType,
  progress,
  oncareerChange,
  onFileTypeChange,
  onRemove,
}: Props) {
  const name = file.name ?? "archivo.csv";
  const size = file.size ?? 0;

  return (
    <div
      onClick={(event) => event.stopPropagation()}
      className={cn(
        "relative flex w-full flex-col gap-2 rounded-lg border border-divider bg-SurfaceContainerLowest p-3",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Eliminar archivo"
        onClick={onRemove}
        className="absolute top-1 right-3 flex h-6 w-6 items-center justify-center rounded-xs text-[#5E5E5E] transition hover:bg-black/5 disabled:cursor-default"
        disabled={!onRemove}
      >
        <CloseIcon />
      </button>

      <div className="flex flex-col items-start justify-start gap-2">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gray-100 text-sm font-medium text-gray-700">
            {name[0] ? name[0].toUpperCase() : "F"}
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">{name}</div>
            <div className="mt-0.5 text-xs text-gray-500">{formatSize(size)}</div>
          </div>
        </div>

        <div className="h-px w-full bg-[#BFBFBF]" />

        <div className="flex w-full gap-2">
          <FieldSelect
            label="carrera:"
            value={career}
            options={CARRERAS}
            onChange={oncareerChange}
          />
          <FieldSelect
            label="tipo de archivo:"
            value={fileType}
            options={FILE_TYPES}
            onChange={onFileTypeChange}
          />
        </div>
      </div>

      {typeof progress === "number" && (
        <div className="w-full">
          <div className="h-2 w-full overflow-hidden rounded bg-gray-200">
            <div
              className="h-2 bg-Primary"
              style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
            />
          </div>
          <div className="mt-1 text-xs text-gray-500">{progress}%</div>
        </div>
      )}
    </div>
  );
}

type FieldSelectProps<T extends string> = {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
};

function FieldSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: FieldSelectProps<T>) {
  const id = useId();

  return (
    <label htmlFor={id} className="flex min-w-0 flex-1 flex-col gap-1">
      <span className="text-xs font-semibold leading-4 text-[rgba(61,61,61,0.66)]">
        {label}
      </span>

      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value as T)}
          className="h-5.5 w-full appearance-none rounded-sm border border-[#D0D0D0] bg-[#F3F3F3] pl-1.75 pr-8 text-xs font-medium leading-4 text-[#494949] outline-none transition focus:border-[#A6A6A6]"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute top-0 right-0 flex h-5.5 w-5.5 items-center justify-center rounded-r-sm border-l border-[#D0D0D0] bg-[#ECECEC] text-[#494949]">
          <ChevronIcon />
        </div>
      </div>
    </label>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M8 8L16 16" />
      <path d="M16 8L8 16" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 10L12 15L17 10" />
    </svg>
  );
}