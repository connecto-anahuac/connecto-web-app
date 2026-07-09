"use client";

import { importCsvClient } from "@/external/handler/data/command.client";
import { getCareerName } from "../FileCard/useFileCard";
import { useRef, useState } from "react";
import { CARRERAS } from "@/shared/types/consts";
import type { FileType, UploadSource } from "@/features/data/types/file";

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
  const inputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [sources, setSources] = useState<UploadSource[]>([]);

  function openPicker() {
    inputRef.current?.click();
  }

  function addSources(files: File[]) {
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
        file,
        fileType: file.name.toLowerCase().includes("capp") ? ("CAPP" as const) : ("Plan de Estudios" as const),
      })),
    ]);
  }

  function changeSourceCareer(index: number, value: string) {
    setSources((currentSources) =>
      currentSources.map((source, currentIndex) =>
        currentIndex === index ? { ...source, career: value } : source,
      ),
    );
  }

  function changeSourceFileType(index: number, value: FileType) {
    setSources((currentSources) =>
      currentSources.map((source, currentIndex) =>
        currentIndex === index ? { ...source, fileType: value } : source,
      ),
    );
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) {
      return;
    }

    addSources(files);
    event.target.value = "";
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    const files = Array.from(event.dataTransfer.files ?? []);
    if (files.length === 0) {
      return;
    }

    addSources(files);
  }

  function removeSource(indexToRemove: number) {
    setErrorMessage(null);
    setSources((currentSources) =>
      currentSources.filter((_, index) => index !== indexToRemove),
    );
  }

  async function handleUpload() {
    if (sources.length === 0 || isLoading) {
      return;
    }

    const invalidFile = sources.find((source) => !isCsvFile(source.file));
    if (invalidFile) {
      setErrorMessage(`El archivo ${invalidFile.file.name} no es un CSV valido.`);
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      let students = 0;
      let grades = 0;

      for (const source of sources) {
        const formData = new FormData();
        formData.append("file", source.file);
        formData.append("career", source.career);

        const response = await importCsvClient(formData);
        students += response.studentsCount;
        grades += response.gradesCount;
      }

      setResult({ students, grades });
    } catch (error) {
      console.error(error);
      setErrorMessage("Se produjo un error durante la carga.");
    } finally {
      setIsLoading(false);
    }
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