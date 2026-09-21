import type {
  ImportCsvResultDto,
  ImportCsvValidationIssueDto,
} from "@/external/dto/data/import-csv-result.dto";
import { importCsvClient } from "@/external/handler/data/command.client";
import type { UploadSource } from "@/features/data/types/file";

type Importer = (formData: FormData) => Promise<ImportCsvResultDto>;

export type ImportSelectedSourcesResult = {
  grades: number;
  issues: ImportCsvValidationIssueDto[];
  sourceResults: Record<
    string,
    {
      error: boolean;
      grades: number;
      isCompleted: boolean;
      issues: ImportCsvValidationIssueDto[];
      students: number;
    }
  >;
  students: number;
};

export async function importSelectedSources(
  sources: UploadSource[],
  importer: Importer = importCsvClient,
): Promise<ImportSelectedSourcesResult> {
  let students = 0;
  let grades = 0;
  const issues: ImportCsvValidationIssueDto[] = [];
  const sourceResults: ImportSelectedSourcesResult["sourceResults"] = {};

  for (const source of sources) {
    try {
      const formData = new FormData();
      formData.append("file", source.file);
      formData.append("career", source.career);
      formData.append("fileType", source.fileType);

      const response = await importer(formData);
      const hasError = response.issues.some((issue) => issue.severity === "error");
      const isCompleted = response.status === "success" && !hasError;
      const sourceGrades = isCompleted && response.status === "success" ? response.gradesCount : 0;
      const sourceStudents = isCompleted && response.status === "success" ? response.studentsCount : 0;

      if (isCompleted) {
        students += response.studentsCount;
        grades += response.gradesCount;
      }
      issues.push(...response.issues);
      sourceResults[source.id] = {
        error: !isCompleted,
        grades: sourceGrades,
        isCompleted,
        issues: response.issues,
        students: sourceStudents,
      };
    } catch (error) {
      console.error(error);
      const issue: ImportCsvValidationIssueDto = {
        code: "import_failed",
        fileName: source.file.name,
        message: "Se produjo un error inesperado durante la carga.",
        severity: "error",
      };
      issues.push(issue);
      sourceResults[source.id] = {
        error: true,
        grades: 0,
        isCompleted: false,
        issues: [issue],
        students: 0,
      };
    }
  }

  return { grades, issues, sourceResults, students };
}
