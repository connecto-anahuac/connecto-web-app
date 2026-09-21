"use client";

import { getCareerName } from "../FileCard/useFileCard";
import { useRef, useState } from "react";
import { CARRERAS } from "@/shared/types/consts";
import type { FileType, UploadSource } from "@/features/data/types/file";
import { useImportValidation } from "../ImportValidation/ImportValidationContext";
import { importSelectedSources } from "./importSelectedSources";

type UploadResult = {
  grades: number;
  students: number;
};

type UseFileSelectorPanelResult = {
  changeSourceCareer: (index: number, value: string) => void;
  changeSourceFileType: (index: number, value: FileType) => void;
  errorMessage: string | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  isDragging: boolean;
  isLoading: boolean;
  result: UploadResult | null;
  sources: UploadSource[];
  handleDragLeave: () => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpload: () => Promise<void>;
  openPicker: () => void;
  removeSource: (indexToRemove: number) => void;
};

function isCsvFile(file: File) {
  return file.name.toLowerCase().endsWith(".csv");
}

function filterCsvFiles(files: File[]) {
  return files.filter(isCsvFile);
}

export function useFileSelectorPanel(): UseFileSelectorPanelResult {
  const { setIssues } = useImportValidation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sources, setSources] = useState<UploadSource[]>([]);
  const sourceIdRef = useRef(0);
  const result = sources.some((source) => source.isCompleted)
    ? {
        grades: sources.reduce((total, source) => total + source.grades, 0),
        students: sources.reduce((total, source) => total + source.students, 0),
      }
    : null;

  function openPicker() {
    if (isLoading) {
      return;
    }

    inputRef.current?.click();
  }

  function addSources(files: File[]) {
    if (isLoading) {
      return;
    }

    const validFiles = filterCsvFiles(files);
    const hasInvalidFiles = validFiles.length !== files.length;

    if (hasInvalidFiles) {
      setErrorMessage("Solo se pueden agregar archivos CSV.");
    } else {
      setErrorMessage(null);
    }

    if (validFiles.length === 0) {
      return;
    }

    setSources((currentSources) => [
      ...currentSources,
      ...validFiles.map((file) => ({
        career: getCareerName(file.name) ?? CARRERAS[0],
		error: false,
        file,
        fileType: file.name.toLowerCase().includes("capp") ? ("CAPP" as const) : ("Plan de Estudios" as const),
		grades: 0,
		id: `upload-source-${sourceIdRef.current++}`,
		isCompleted: false,
		issues: [],
		students: 0,
      })),
    ]);
  }

  function changeSourceCareer(index: number, value: string) {
    if (isLoading) {
      return;
    }

    setSources((currentSources) =>
      currentSources.map((source, currentIndex) =>
        currentIndex === index ? { ...source, career: value } : source,
      ),
    );
  }

  function changeSourceFileType(index: number, value: FileType) {
    if (isLoading) {
      return;
    }

    setSources((currentSources) =>
      currentSources.map((source, currentIndex) =>
        currentIndex === index ? { ...source, fileType: value } : source,
      ),
    );
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (isLoading) {
      event.target.value = "";
      return;
    }

    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) {
      return;
    }

    addSources(files);
    event.target.value = "";
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (isLoading) {
      return;
    }

    setIsDragging(true);
  }

  function handleDragLeave() {
    if (isLoading) {
      return;
    }

    setIsDragging(false);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (isLoading) {
      return;
    }

    setIsDragging(false);

    const files = Array.from(event.dataTransfer.files ?? []);
    if (files.length === 0) {
      return;
    }

    addSources(files);
  }

  function removeSource(indexToRemove: number) {
    if (isLoading) {
      return;
    }

    setErrorMessage(null);
    const nextSources = sources.filter((_, index) => index !== indexToRemove);
    setSources(nextSources);
    setIssues(nextSources.flatMap((source) => source.issues));
  }

  async function handleUpload() {
    if (sources.length === 0 || isLoading) {
      return;
    }

    const pendingSources = sources.filter((source) => !source.isCompleted);
    if (pendingSources.length === 0) {
      return;
    }

    const invalidFile = pendingSources.find((source) => !isCsvFile(source.file));
    if (invalidFile) {
      setErrorMessage(`El archivo ${invalidFile.file.name} no es un CSV valido.`);
      return;
    }

    setErrorMessage(null);
    setIsDragging(false);
    setIsLoading(true);

    const summary = await importSelectedSources(pendingSources);
    const nextSources = sources.map((source) => {
      const sourceResult = summary.sourceResults[source.id];
      return sourceResult ? { ...source, ...sourceResult } : source;
    });
    setSources(nextSources);
    setIssues(nextSources.flatMap((source) => source.issues));
    setIsLoading(false);
  }

  return {
    changeSourceCareer,
    changeSourceFileType,
    errorMessage,
    inputRef,
    isDragging,
    isLoading,
    result,
    sources,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleInputChange,
    handleUpload,
    openPicker,
    removeSource,
  };
}
