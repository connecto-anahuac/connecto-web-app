"use client";

import { useImportValidation } from "../ImportValidation/ImportValidationContext";

export default function ImportErrorSection() {
  const { issues } = useImportValidation();

  return <ImportIssueSections issues={issues} />;
}

export function ImportIssueSections({
  issues,
}: {
  issues: ReturnType<typeof useImportValidation>["issues"];
}) {
  const errors = issues.filter(({ severity }) => severity === "error");
  const warnings = issues.filter(({ severity }) => severity === "warning");

  if (issues.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* {errors.length == 0 && (
        <span className="text-md font-medium text-OnSurfaceVariant">
       Importación de archivos completada.
        </span>
      )} */}
      <IssueSection
        className="border-red-200 bg-red-50 text-red-800"
        issues={errors}
        itemClassName="border-red-100"
        title="Errores en los archivos CSV"
      />
      {/* <IssueSection
        className="border-amber-200 bg-amber-50 text-amber-800"
        issues={warnings}
        itemClassName="border-amber-100"
        title="Advertencias de importacion"
      /> */}
    </div>
  );
}

type IssueSectionProps = {
  className: string;
  issues: ReturnType<typeof useImportValidation>["issues"];
  itemClassName: string;
  title: string;
};

function IssueSection({
  className,
  issues,
  itemClassName,
  title,
}: IssueSectionProps) {
  if (issues.length === 0) {
    return null;
  }

  return (
    <section className={`rounded-lg border p-4 ${className}`}>
      <h2 className="text-sm font-semibold">{title}</h2>
      <ul className="mt-3 space-y-2 text-xs">
        {issues.map((issue, index) => {
          const location = [
            issue.row ? `fila ${issue.row}` : null,
            issue.column ? `columna ${issue.column}` : null,
          ]
            .filter(Boolean)
            .join(", ");

          return (
            <li
              className={`rounded border bg-white/70 px-3 py-2 ${itemClassName}`}
              key={`${issue.fileName}-${issue.code}-${issue.row ?? "file"}-${issue.column ?? "general"}-${index}`}
            >
              <span className="font-semibold">{issue.fileName}</span>
              {location ? <span> ({location})</span> : null}
              <span>: {issue.message}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
