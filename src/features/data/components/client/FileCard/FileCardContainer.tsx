"use client";

import { FileCardPresenter } from "./FileCardPresenter";
import { useFileCard } from "./useFileCard";
import type { FileLike } from "@/features/data/types/file";

type Props = {
  className?: string;
  file: FileLike;
  progress?: number;
  onRemove?: () => void;
};

export function FileCardContainer({ className, file, progress, onRemove }: Props) {
  const { career, fileType, setcareer, setFileType } = useFileCard(file);

  return (
    <FileCardPresenter
      career={career}
      className={className}
      file={file}
      fileType={fileType}
      progress={progress}
      oncareerChange={setcareer}
      onFileTypeChange={setFileType}
      onRemove={onRemove}
    />
  );
}