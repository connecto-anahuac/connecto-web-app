import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import SidePanel, { useSidePanel } from "./SidePanel";

describe("SidePanel", () => {
  it("renders only the Content that matches the selected type", () => {
    const markup = renderToStaticMarkup(
      <SidePanel.Root panel={{ id: "student-1", type: "student" }}>
        <SidePanel.Main>Main</SidePanel.Main>
        <SidePanel.Viewport aria-label="Details" className="w-80">
          <SidePanel.Content type="student">
            {(panel) => <div>Student {panel.id}</div>}
          </SidePanel.Content>
          <SidePanel.Content type="course">
            {(panel) => <div>Course {panel.id}</div>}
          </SidePanel.Content>
        </SidePanel.Viewport>
      </SidePanel.Root>,
    );

    expect(markup).toContain("Student student-1");
    expect(markup).not.toContain("Course student-1");
    expect(markup).toContain('aria-label="Details"');
    expect(markup).toContain("absolute inset-y-0 right-0 w-80");
  });

  it("unmounts the Viewport when there is no selection", () => {
    const markup = renderToStaticMarkup(
      <SidePanel.Root>
        <SidePanel.Viewport aria-label="Details">
          <SidePanel.Content type="student">{() => <div>Student</div>}</SidePanel.Content>
        </SidePanel.Viewport>
      </SidePanel.Root>,
    );

    expect(markup).not.toContain("Details");
    expect(markup).not.toContain("Student");
  });

  it.each([
    ["overlay", "top", "relative", "absolute inset-x-0 top-0"],
    ["overlay", "right", "relative", "absolute inset-y-0 right-0"],
    ["overlay", "bottom", "relative", "absolute inset-x-0 bottom-0"],
    ["overlay", "left", "relative", "absolute inset-y-0 left-0"],
    ["push", "top", "flex flex-col-reverse", "shrink-0"],
    ["push", "right", "flex flex-row", "shrink-0"],
    ["push", "bottom", "flex flex-col", "shrink-0"],
    ["push", "left", "flex flex-row-reverse", "shrink-0"],
  ] as const)("uses %s layout on the %s side", (mode, side, rootClass, viewportClass) => {
    const markup = renderToStaticMarkup(
      <SidePanel.Root mode={mode} panel={{ id: "1", type: "test" }} side={side}>
        <SidePanel.Main>Main</SidePanel.Main>
        <SidePanel.Viewport aria-label="Details">
          <SidePanel.Content type="test">{() => <div>Panel</div>}</SidePanel.Content>
        </SidePanel.Viewport>
      </SidePanel.Root>,
    );

    expect(markup).toContain(rootClass);
    expect(markup).toContain(viewportClass);
  });

  it("preserves native props on Root, Main, and Viewport", () => {
    const markup = renderToStaticMarkup(
      <SidePanel.Root data-testid="root" panel={{ id: "1", type: "test" }} style={{ color: "red" }}>
        <SidePanel.Main data-testid="main">Main</SidePanel.Main>
        <SidePanel.Viewport aria-label="Details" data-testid="viewport" style={{ width: 320 }}>
          <SidePanel.Content type="test">{() => <div>Panel</div>}</SidePanel.Content>
        </SidePanel.Viewport>
      </SidePanel.Root>,
    );

    expect(markup).toContain('data-testid="root"');
    expect(markup).toContain('data-testid="main"');
    expect(markup).toContain('data-testid="viewport"');
    expect(markup).toContain("color:red");
    expect(markup).toContain("width:320px");
  });

  it("throws a helpful error outside SidePanel.Root", () => {
    function OutsideRoot() {
      useSidePanel();
      return null;
    }

    expect(() => renderToStaticMarkup(<OutsideRoot />)).toThrow(
      "SidePanel components must be inside <SidePanel.Root>",
    );
  });
});
