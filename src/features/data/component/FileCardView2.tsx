"use client";

import { useId, useState } from "react";
import { CARRERAS, FILE_TYPES } from "../domain/consts";
import { cn } from "@/lib/util";
import ZoomInIcon from "@/components/icon/ZoomInIcon";
import EditIcon from "@/components/icon/EditIcon";
import { getCarreraName } from "../domain/validator";


type Props = {
  className?: string;
  file: File | { name: string; size: number };
  progress?: number; // 0-100
  onRemove?: () => void;
  onPreview?: () => void;
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function FileCardView({
  className,
  file,
  progress,
  onRemove,
  onPreview,
}: Props) {
  const name = (file as any).name ?? "archivo.csv";
  const size = (file as any).size ?? 0;

  const [carrera, setCarrera] = useState(
    getCarreraName(file.name) ?? CARRERAS[0],
  );
  const [fileType, setFileType] = useState(getFileType(file.name));

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "relative w-full p-3 rounded-lg bg-SurfaceContainerLowest border border-divider flex flex-col gap-2",
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
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-700">
            {name?.[0] ? name[0].toUpperCase() : "F"}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium truncate">{name}</div>
            <div className="text-xs text-gray-500 mt-0.5">
              {formatSize(size)}
            </div>
          </div>
        </div>

        {/* <div className="flex items-center gap-2">
					<button
						type="button"
						title="Preview"
						onClick={onPreview}
						className="p-1 rounded hover:bg-gray-100"
					>
						<ZoomInIcon className="w-5 h-5 text-gray-600" />
					</button>
					<button
						type="button"
						title="Rename"
						onClick={() => alert("Rename not implemented")}
						className="p-1 rounded hover:bg-gray-100"
					>
						<EditIcon className="w-5 h-5 text-gray-600" />
					</button>
					<button
						type="button"
						title="Remove"
						onClick={onRemove}
						className="text-sm text-red-600 px-2 py-1 rounded hover:bg-red-50"
					>
						Eliminar
					</button>
				</div> */}

        <div className="h-px w-full bg-[#BFBFBF]" />

        <div className="flex  gap-2 w-full">
          <FieldSelect
            label="carrera:"
            value={carrera}
            options={CARRERAS}
            onChange={setCarrera}
          />
          <FieldSelect
            label="tipo de archivo:"
            value={fileType}
            options={FILE_TYPES}
            onChange={setFileType}
          />
        </div>
      </div>

      {typeof progress === "number" && (
        <div className="w-full">
          <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
            <div
              className="h-2 bg-Primary"
              style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">{progress}%</div>
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
    <label htmlFor={id} className="flex min-w-0 flex-col gap-1 flex-1">
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

function getFileType(fileName: string) {
  const normalized = fileName.toLowerCase();

  if (normalized.includes("capp")) {
    return "CAPP" as const;
  }

  return "Plan de Estudios" as const;
}

function getFilePathLabel(file: File) {
  const relativePath = file.webkitRelativePath?.trim();

  if (relativePath) {
    return relativePath;
  }

  return `Archivo local/${file.name}`;
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
