import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { StudentCollectionPresenter } from "./StudentCollectionPresenter";

vi.mock("@/shared/component/composite/table/DataTable", () => ({
  DataTable: () => <div data-testid="student-collection-table" />,
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
});

function render({
  loading,
  errorMessage,
}: {
  loading: boolean;
  errorMessage?: string;
}) {
  return renderToStaticMarkup(
    <StudentCollectionPresenter
      errorMessage={errorMessage}
      loading={loading}
      table={{} as never}
      tableConfig={{} as never}
    />,
  );
}
