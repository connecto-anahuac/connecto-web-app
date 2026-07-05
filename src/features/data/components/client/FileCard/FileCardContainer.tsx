"use client";

import { FileCardPresenter } from "./FileCardPresenter";
import { useFileCard, type FileLike } from "./useFileCard";

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