"use client";

import { useState } from "react";
import { CARRERAS, FILE_TYPES } from "@/features/data/domain/consts";
import { getcareerName } from "@/features/data/domain/validator";

export type FileLike = File | { name: string; size: number };
export type FileType = (typeof FILE_TYPES)[number];

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
  const [career, setcareer] = useState(getcareerName(file.name) ?? CARRERAS[0]);
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