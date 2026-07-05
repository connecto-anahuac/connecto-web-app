import { cn } from "@/lib/util";
import { FileCardContainer } from "../FileCard/FileCardContainer";

type Props = {
  className?: string;
  errorMessage: string | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  isDragging: boolean;
  isLoading: boolean;
  result: {
    grades: number;
    students: number;
  } | null;
  sources: File[];
  onDragLeave: () => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenPicker: () => void;
  onRemoveSource: (indexToRemove: number) => void;
  onUpload: () => Promise<void>;
};

export function FileSelectorPanelPresenter({
  className,
  errorMessage,
  inputRef,
  isDragging,
  isLoading,
  result,
  sources,
  onDragLeave,
  onDragOver,
  onDrop,
  onInputChange,
  onOpenPicker,
  onRemoveSource,
  onUpload,
}: Props) {
  return (
    <div
      className={cn(
        "flex h-full w-104 flex-col gap-4 rounded-lg bg-SurfaceContainerLowest p-5",
        className,
      )}
    >
      <div className="text-sm font-medium">Subir archivos</div>

      <div
        onClick={onOpenPicker}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "flex w-full flex-1 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition",
          "border-gray-300",
          isDragging && "border-blue-500 bg-blue-50",
        )}
      >
        {sources.length > 0 ? (
          <div className="flex h-full w-full flex-col justify-start gap-2 overflow-y-auto p-2">
            {sources.map((file, index) => (
              <FileCardContainer
                key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
                file={file}
                onRemove={() => onRemoveSource(index)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-lg font-medium">Drag & Drop un archivo CSV</p>
            <p className="mt-2 text-sm text-gray-500">O haz clic para seleccionar</p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          hidden
          onChange={onInputChange}
        />
      </div>

      {errorMessage ? (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {result ? (
        <div className="rounded border p-4">
          <p>Students: {result.students}</p>
          <p>Grades: {result.grades}</p>
        </div>
      ) : null}

      <button
        className={cn(
          "flex w-full cursor-pointer items-center justify-center rounded-sm bg-Primary py-3 text-sm font-medium text-OnPrimary",
          (sources.length === 0 || isLoading) &&
            "cursor-not-allowed bg-[#E6E6E6] text-[#616161]",
        )}
        onClick={() => void onUpload()}
        disabled={sources.length === 0 || isLoading}
      >
        {isLoading ? "Procesando..." : "Subir"}
      </button>
    </div>
  );
}