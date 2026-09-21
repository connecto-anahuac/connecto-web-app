import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ImportIssueSections } from "./ImportErrorSection";

describe("ImportIssueSections", () => {
  it("renders blocking errors and non-blocking warnings separately", () => {
    const markup = renderToStaticMarkup(
      createElement(ImportIssueSections, {
        issues: [
          {
            code: "missing_header",
            column: "ID",
            fileName: "invalid.csv",
            message: "missing ID",
            row: 1,
            severity: "error",
          },
          {
            code: "invalid_course_value",
            column: "EMP1401",
            fileName: "warning.csv",
            message: "ignored",
            row: 20,
            severity: "warning",
          },
        ],
      }),
    );

    expect(markup).toContain("Errores en los archivos CSV");
    expect(markup).toContain("Advertencias de importacion");
    expect(markup).toContain("border-red-200");
    expect(markup).toContain("border-amber-200");
    expect(markup).toContain("fila 20");
    expect(markup).toContain("columna EMP1401");
  });
});
