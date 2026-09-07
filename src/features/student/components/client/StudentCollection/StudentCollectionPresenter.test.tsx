import { renderToStaticMarkup } from "react-dom/server";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { StudentCollectionPresenter } from "./StudentCollectionPresenter";

let dataTableProps: Record<string, unknown> | undefined;

vi.mock("@/shared/component/composite/table/DataTableWithPreview", () => ({
  DataTableWithPreview: (props: Record<string, unknown>) => {
    dataTableProps = props;
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

  it("configures the reusable preview table with student IDs and callbacks", () => {
    const onStudentSelect = vi.fn();
    const onStudentOpen = vi.fn();
    const student = { studentId: "1111" };

    const onStudentPreviewClose = vi.fn();
    const renderStudentPreview = vi.fn(() => <div>Student preview</div>);

    render({
      activeStudentId: student.studentId,
      loading: false,
      onStudentOpen,
      onStudentPreviewClose,
      onStudentSelect,
      renderStudentPreview,
    });

    const updatedProps = dataTableProps as {
      getRowId: (item: typeof student) => string;
      onPreviewClose: () => void;
      onRowOpen: (studentId: string) => void;
      onRowSelect: (studentId: string) => void;
      renderPreview: (studentId: string) => ReactNode;
      selectedRowId: string;
    };
    updatedProps.onRowSelect(student.studentId);
    updatedProps.onRowOpen(student.studentId);
    updatedProps.onPreviewClose();
    const preview = updatedProps.renderPreview(student.studentId);

    expect(updatedProps.getRowId(student)).toBe("1111");
    expect(updatedProps.selectedRowId).toBe("1111");
    expect(onStudentSelect).toHaveBeenCalledWith("1111");
    expect(onStudentOpen).toHaveBeenCalledWith("1111");
    expect(onStudentPreviewClose).toHaveBeenCalledOnce();
    expect(renderStudentPreview).toHaveBeenCalledWith("1111");
    expect(renderToStaticMarkup(preview)).toContain("Student preview");
  });
});

function render({
  loading,
  errorMessage,
  activeStudentId,
  onStudentSelect = () => undefined,
  onStudentOpen = () => undefined,
  onStudentPreviewClose = () => undefined,
  renderStudentPreview = () => null,
}: {
  loading: boolean;
  errorMessage?: string;
  activeStudentId?: string;
  onStudentSelect?: (studentId: string) => void;
  onStudentOpen?: (studentId: string) => void;
  onStudentPreviewClose?: () => void;
  renderStudentPreview?: (studentId: string) => ReactNode;
}) {
  return renderToStaticMarkup(
    <StudentCollectionPresenter
      activeStudentId={activeStudentId}
      errorMessage={errorMessage}
      loading={loading}
      onStudentOpen={onStudentOpen}
      onStudentPreviewClose={onStudentPreviewClose}
      onStudentSelect={onStudentSelect}
      renderStudentPreview={renderStudentPreview}
      table={{} as never}
      tableConfig={{} as never}
    />,
  );
}
