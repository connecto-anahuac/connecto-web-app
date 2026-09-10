import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ClassroomCollectionPresenter } from "./ClassroomCollectionPresenter";

vi.mock("@/shared/component/composite/datasection/DataSection", () => ({
  default: () => <div data-testid="classroom-collection-table" />,
}));

describe("ClassroomCollectionPresenter", () => {
  it("renders its selected classroom preview in SidePanel", () => {
    const markup = renderToStaticMarkup(
      <ClassroomCollectionPresenter
        activeId="classroom-1"
        data={[{ id: "classroom-1" }] as never}
        error={false}
        loading={false}
        onClose={() => undefined}
        onOpen={() => undefined}
        onSelect={() => undefined}
        renderPreview={(id) => <div>Preview for {id}</div>}
        table={{} as never}
        tableConfig={{ fields: [] }}
      />,
    );

    expect(markup).toContain('aria-label="Vista previa del aula"');
    expect(markup).toContain('aria-label="Abrir detalle del aula"');
    expect(markup).toContain('aria-label="Cerrar vista previa del aula"');
    expect(markup).toContain("Preview for classroom-1");
  });
});
