"use client";

import { useState } from "react";
import { type FileLike, type FileType } from "@/features/data/types/file";
import { getCareerName } from "@/shared/lib/data-import";
import { CARRERAS } from "@/shared/types/consts";

type UseFileCardResult = {
  career: string;
  fileType: FileType;
  name: string;
  size: number;
  setcareer: (value: string) => void;
  setFileType: (value: FileType) => void;
};

function getDefaultFileType(fileName: string): FileType {
  return fileName.toLowerCase().includes("capp") ? "CAPP" : "Plan de Estudios";
}

export function useFileCard(file: FileLike): UseFileCardResult {
  const [career, setcareer] = useState(getCareerName(file.name) ?? CARRERAS[0]);
  const [fileType, setFileType] = useState<FileType>(getDefaultFileType(file.name));

  return {
    career,
    fileType,
    name: file.name ?? "archivo.csv",
    size: file.size ?? 0,
    setcareer,
    setFileType,
  };
}