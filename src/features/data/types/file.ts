import type { ImportCsvValidationIssueDto } from "@/external/dto/data/import-csv-result.dto";

export const FILE_TYPES = ["CAPP", "Plan de Estudios"] as const;

export type FileLike = File | { name: string; size: number };
export type FileType = (typeof FILE_TYPES)[number];

export type UploadSource = {
	career: string;
	error: boolean;
	file: File;
	fileType: FileType;
	grades: number;
	id: string;
	isCompleted: boolean;
	issues: ImportCsvValidationIssueDto[];
	students: number;
};
