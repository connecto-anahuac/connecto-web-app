"use client";

import { useId, useState } from "react";
import { CARRERAS } from "../domain/consts";
import { getCarreraName } from "../domain/validator";
import { cn } from "@/lib/util";

const FILE_TYPES = ["CAPP", "Plan de Estudios"] as const;

type Props = {
	file: File;
	className?: string;
	onRemove?: () => void;
};

export default function FileCardViewSub({
	file,
	className,
	onRemove,
}: Props) {
	const [carrera, setCarrera] = useState(
		getCarreraName(file.name) ?? CARRERAS[0],
	);
	const [fileType, setFileType] = useState(getFileType(file.name));

	return (
		<article
			className={cn(
				"relative flex w-full min-w-0 flex-col gap-4 rounded-md border border-[#B6B6B6] bg-[#E7E7E7] p-4 text-[#231A16]",
				className,
			)}
		>
			<button
				type="button"
				aria-label="Eliminar archivo"
				onClick={onRemove}
				className="absolute top-1 right-3 flex h-6 w-6 items-center justify-center rounded-full text-[#5E5E5E] transition hover:bg-black/5 disabled:cursor-default"
				disabled={!onRemove}
			>
				<CloseIcon />
			</button>

			<div className="flex min-w-0 flex-col gap-2.5 pr-8">
				<div className="truncate text-sm font-medium leading-5 text-[#231A16]">
					{file.name}
				</div>

				<div className="min-w-0 rounded-sm bg-[#FFF8F6] px-2 py-1 text-[13px] font-medium leading-4 text-[#231A16]">
					<span className="block truncate">{getFilePathLabel(file)}</span>
				</div>
			</div>

			<div className="h-px w-full bg-[#BFBFBF]" />

			<div className="flex flex-col gap-4">
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
		</article>
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
		<label htmlFor={id} className="flex min-w-0 flex-col gap-1.5">
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

