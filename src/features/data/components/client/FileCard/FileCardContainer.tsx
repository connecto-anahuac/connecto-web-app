"use client";

import { FileCardPresenter } from "./FileCardPresenter";
import type { FileLike, FileType } from "@/features/data/types/file";

type Props = {
  career: string;
  className?: string;
  file: FileLike;
  fileType: FileType;
  onCareerChange: (value: string) => void;
  onFileTypeChange: (value: FileType) => void;
  progress?: number;
  onRemove?: () => void;
  isCompleted?: boolean;
  isError?: boolean;
};

export function FileCardContainer({
  career,
  className,
  file,
  fileType,
  onCareerChange,
  onFileTypeChange,
  progress,
  onRemove,
  isCompleted,
  isError,
}: Props) {
  return (
    <FileCardPresenter
      career={career}
      className={className}
      file={file}
      fileType={fileType}
      progress={progress}
      oncareerChange={onCareerChange}
      onFileTypeChange={onFileTypeChange}
      onRemove={onRemove}
      isCompleted={isCompleted}
      isError={isError}
    />
  );
}