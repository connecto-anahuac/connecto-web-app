"use client";

import { useRef, useState } from "react";
import { importCsvAction } from "../actions/import_csv_action";
import { cn } from "@/lib/util";

type Props = {
  className?: string;
};
export default function FileSelectorPanel({ className }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sources, setSources] = useState<File[]>([]);

  const [result, setResult] = useState<{
    students: number;
    grades: number;
  } | null>(null);

  async function handleFile() {
    sources.forEach(async (file) => {
      if (!file.name.endsWith(".csv")) {
        alert("Elige un archivo CSV.");
        return;
      }

      setLoading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await importCsvAction(formData);

        setResult({
          students: response.studentsCount,
          grades: response.gradesCount,
        });
      } catch (error) {
        console.error(error);
        alert("処理中にエラーが発生しました");
      } finally {
        setLoading(false);
      }
    });
  }

  async function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    // await handleFile(file);
    setSources((prev) => [...prev, file]);
  }

  async function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();

    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];

    if (!file) return;

    // await handleFile(file);
    setSources((prev) => [...prev, file]);
  }

  return (
    <div className={cn("p-5 flex flex-col gap-4 w-104 h-full rounded-lg bg-SurfaceContainerLowest", className)}>
      <div className="font-medium text-sm">Subir archivos</div>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex w-full flex-1 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition",
          "border-gray-300",
          isDragging && "border-blue-500 bg-blue-50",
        )}
      >
        <div className="text-center">
          <p className="text-lg font-medium">Drag & Drop un archivo CSV</p>
          <p className="mt-2 text-sm text-gray-500">
            O haz clic para seleccionar
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          hidden
          onChange={onInputChange}
        />
      </div>

      {result && (
        <div className="mt-6 rounded border p-4">
          <p>Students: {result.students}</p>
          <p>Grades: {result.grades}</p>
        </div>
      )}

      <button
        className={cn("text-sm w-full py-3 rounded-sm flex justify-center items-center font-medium text-OnPrimary bg-Primary cursor-pointer",
          sources.length === 0 || loading && " bg-[#E6E6E6] text-[#616161]  cursor-not-allowed" 
        )}
        onClick={handleFile}
        disabled={sources.length === 0 || loading}
      >
        {loading ? "Procesando..." :"Subir"}
      </button>
    </div>
  );
}
