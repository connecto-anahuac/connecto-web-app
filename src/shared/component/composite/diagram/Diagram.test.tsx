import { Fragment } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import CountLocator from "./CountLocator";
import { Diagram, getLocatorCounts } from "./Diagram";

const rect = (left: number, top: number, right: number, bottom: number) => ({
  bottom,
  left,
  right,
  top,
});

describe("Diagram", () => {
  it("counts visible column and row headers, including nested fragments", () => {
    const markup = renderToStaticMarkup(
      <Diagram>
        <Fragment>
          <Diagram.Columns>
            <span>Column A</span>
            <Fragment>
              {false}
              <span>Column B</span>
              {null}
            </Fragment>
          </Diagram.Columns>
          <Diagram.Rows>
            {undefined}
            <span>Row A</span>
          </Diagram.Rows>
        </Fragment>
      </Diagram>,
    );

    expect(markup).toContain(
      "grid-template-columns:auto repeat(2, minmax(13rem, 1fr))",
    );
    expect(markup).toContain(
      "grid-template-rows:auto repeat(1, min-content)",
    );
    expect(markup).toContain("Column A");
    expect(markup).toContain("Column B");
    expect(markup).toContain("Row A");
  });

  it("prefers explicit counts and supports layout overrides", () => {
    const markup = renderToStaticMarkup(
      <Diagram
        columnCount={4}
        rowCount={3}
        columnWidth="10rem"
        gap={8}
        className="custom-diagram"
      >
        <Diagram.Columns>
          <span>Only column</span>
        </Diagram.Columns>
        <Diagram.Rows>
          <span>Only row</span>
        </Diagram.Rows>
      </Diagram>,
    );

    expect(markup).toContain("class=\"custom-diagram\"");
    expect(markup).toContain(
      "grid-template-columns:auto repeat(4, 10rem)",
    );
    expect(markup).toContain(
      "grid-template-rows:auto repeat(3, min-content)",
    );
    expect(markup).toContain("gap:8px");
  });

  it("offsets one-based content coordinates after the header cells", () => {
    const markup = renderToStaticMarkup(
      <Diagram.Content
        x={2}
        y={3}
        className="diagram-card"
        data-state="ready"
        style={{ gridColumnStart: 99, opacity: 0.5 }}
      >
        Content
      </Diagram.Content>,
    );

    expect(markup).toContain("class=\"diagram-card\"");
    expect(markup).toContain("data-state=\"ready\"");
    expect(markup).toContain("opacity:0.5");
    expect(markup).toContain("grid-column-start:3");
    expect(markup).toContain("grid-row-start:4");
  });

  it("uses only the corner track when header groups are empty", () => {
    const markup = renderToStaticMarkup(
      <Diagram>
        <Diagram.Columns>{null}</Diagram.Columns>
        <Diagram.Rows>{false}</Diagram.Rows>
      </Diagram>,
    );

    expect(markup).toContain("grid-template-columns:auto");
    expect(markup).toContain("grid-template-rows:auto");
  });

  it("marks only opted-in content as locator targets", () => {
    const markup = renderToStaticMarkup(
      <>
        <Diagram.Content x={1} y={1} locatorTarget>
          Included
        </Diagram.Content>
        <Diagram.Content x={1} y={2} locatorTarget={false}>
          Excluded
        </Diagram.Content>
      </>,
    );

    expect(markup.match(/data-diagram-locator-target="true"/g)).toHaveLength(1);
  });
});

describe("getLocatorCounts", () => {
  const viewport = rect(0, 0, 100, 100);

  it("classifies fully offscreen targets on every edge", () => {
    expect(
      getLocatorCounts(viewport, [
        rect(20, -30, 40, -10),
        rect(110, 20, 130, 40),
        rect(20, 110, 40, 130),
        rect(-30, 20, -10, 40),
      ]),
    ).toEqual({ top: 1, right: 1, bottom: 1, left: 1 });
  });

  it("excludes targets that are even partially visible", () => {
    expect(
      getLocatorCounts(viewport, [
        rect(20, -10, 40, 10),
        rect(90, 20, 110, 40),
        rect(20, 90, 40, 110),
        rect(-10, 20, 10, 40),
        rect(20, 20, 40, 40),
      ]),
    ).toEqual({ top: 0, right: 0, bottom: 0, left: 0 });
  });

  it("counts fully offscreen corner targets on both axes", () => {
    expect(
      getLocatorCounts(viewport, [
        rect(-30, -30, -10, -10),
        rect(110, 110, 130, 130),
      ]),
    ).toEqual({ top: 1, right: 1, bottom: 1, left: 1 });
  });
});

describe("CountLocator", () => {
  it("announces its direction and count", () => {
    const markup = renderToStaticMarkup(
      <CountLocator direction="left" value={3} />,
    );

    expect(markup).toContain('role="status"');
    expect(markup).toContain('aria-label="3 items outside the left edge"');
    expect(markup).toContain("-rotate-90");
  });

  it("does not render zero or negative counts", () => {
    expect(
      renderToStaticMarkup(<CountLocator direction="top" value={0} />),
    ).toBe("");
    expect(
      renderToStaticMarkup(<CountLocator direction="top" value={-1} />),
    ).toBe("");
  });
});
