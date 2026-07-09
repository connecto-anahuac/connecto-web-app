export const FILE_TYPES = ["CAPP", "Plan de Estudios"] as const;

export type FileLike = File | { name: string; size: number };
export type FileType = (typeof FILE_TYPES)[number];

export type UploadSource = {
	career: string;
	file: File;
	fileType: FileType;
};