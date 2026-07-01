"use client";

import { useRef, useState } from "react";
import { importCsvAction } from "../actions/import_csv_action";

export default function StudentImportPage() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<{
    students: number;
    grades: number;
  } | null>(null);

  async function handleFile(file: File) {
    if (!file.name.endsWith(".csv")) {
      alert("Elige un archivo CSV.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response =
        await importCsvAction(formData);

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
  }

  async function onInputChange(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    await handleFile(file);
  }

  async function onDrop(
    e: React.DragEvent<HTMLDivElement>,
  ) {
    e.preventDefault();

    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];

    if (!file) return;

    await handleFile(file);
  }

  return (
    <main className="mx-auto max-w-3xl p-10 min-w-96">
      <h1 className="mb-6 text-2xl font-bold">
        Student CSV Import
      </h1>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() =>
          setIsDragging(false)
        }
        onDrop={onDrop}
        className={`
          flex h-64 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition
          ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300"
          }
        `}
      >
        <div className="text-center">
          <p className="text-lg font-medium">
           Drag & Drop un archivo CSV
          </p>

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

      {loading && (
        <div className="mt-6">
          Procesando...
        </div>
      )}

      {result && (
        <div className="mt-6 rounded border p-4">
          <p>
            Students: {result.students}
          </p>

          <p>
            Grades: {result.grades}
          </p>
        </div>
      )}
    </main>
  );
}