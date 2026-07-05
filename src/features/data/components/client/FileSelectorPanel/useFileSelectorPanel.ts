"use client";

import { importCsvAction } from "@/external/handler/data/import-csv.action";
import { useRef, useState } from "react";

type UploadResult = {
  grades: number;
  students: number;
};

type UseFileSelectorPanelResult = {
  errorMessage: string | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  isDragging: boolean;
  isLoading: boolean;
  result: UploadResult | null;
  sources: File[];
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

export function useFileSelectorPanel(): UseFileSelectorPanelResult {
  const inputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [sources, setSources] = useState<File[]>([]);

  function openPicker() {
    inputRef.current?.click();
  }

  function addSource(file: File) {
    setErrorMessage(null);
    setSources((currentSources) => [...currentSources, file]);
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    addSource(file);
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

    const file = event.dataTransfer.files?.[0];
    if (!file) {
      return;
    }

    addSource(file);
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

    const invalidFile = sources.find((file) => !isCsvFile(file));
    if (invalidFile) {
      setErrorMessage(`El archivo ${invalidFile.name} no es un CSV valido.`);
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      let students = 0;
      let grades = 0;

      for (const file of sources) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await importCsvAction(formData);
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