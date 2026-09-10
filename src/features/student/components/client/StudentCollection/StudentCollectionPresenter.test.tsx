import { renderToStaticMarkup } from "react-dom/server";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { StudentCollectionPresenter } from "./StudentCollectionPresenter";

let dataSectionProps: Record<string, unknown> | undefined;

vi.mock("@/shared/component/composite/datasection/DataSection", () => ({
  default: (props: Record<string, unknown>) => {
    dataSectionProps = props;
    return <div data-testid="student-collection-table" />;
  },
}));

describe("StudentCollectionPresenter", () => {
  it("shows the loading message instead of an empty table", () => {
    const markup = render({ loading: true });

    expect(markup).toContain("Cargando estudiantes...");
    expect(markup).not.toContain("student-collection-table");
  });

  it("shows the error message instead of an empty table", () => {
    const markup = render({
      loading: false,
      errorMessage: "No se pudo cargar la colección de estudiantes.",
    });

    expect(markup).toContain("No se pudo cargar la colección de estudiantes.");
    expect(markup).not.toContain("student-collection-table");
  });

  it("renders the table when loading succeeds, including an empty result", () => {
    const markup = render({ loading: false });

    expect(markup).toContain("student-collection-table");
  });

  it("configures the table with student IDs and row callbacks", () => {
    const onStudentSelect = vi.fn();
    const onStudentOpen = vi.fn();
    const student = { studentId: "1111" };

    render({
      activeStudentId: student.studentId,
      loading: false,
      onStudentOpen,
      onStudentSelect,
    });

    const updatedProps = dataSectionProps as {
      getRowId: (item: typeof student) => string;
      onRowOpen: (studentId: string) => void;
      onRowSelect: (studentId: string) => void;
      selectedRowId: string;
      table: unknown;
      tableConfig: unknown;
      listDiagram?: ReactNode;
    };
    updatedProps.onRowSelect(student.studentId);
    updatedProps.onRowOpen(student.studentId);

    expect(updatedProps.getRowId(student)).toBe("1111");
    expect(updatedProps.selectedRowId).toBe("1111");
    expect(updatedProps.table).toBeDefined();
    expect(updatedProps.tableConfig).toBeDefined();
    expect(updatedProps.listDiagram).toBeUndefined();
    expect(updatedProps).not.toHaveProperty("renderPreview");
    expect(updatedProps).not.toHaveProperty("onPreviewClose");
    expect(onStudentSelect).toHaveBeenCalledWith("1111");
    expect(onStudentOpen).toHaveBeenCalledWith("1111");
  });
});

function render({
  loading,
  errorMessage,
  activeStudentId,
  onStudentSelect = () => undefined,
  onStudentOpen = () => undefined,
}: {
  loading: boolean;
  errorMessage?: string;
  activeStudentId?: string;
  onStudentSelect?: (studentId: string) => void;
  onStudentOpen?: (studentId: string) => void;
}) {
  return renderToStaticMarkup(
    <StudentCollectionPresenter
      activeStudentId={activeStudentId}
      errorMessage={errorMessage}
      loading={loading}
      onStudentOpen={onStudentOpen}
      onStudentSelect={onStudentSelect}
      table={{} as never}
      tableConfig={{} as never}
    />,
  );
}
