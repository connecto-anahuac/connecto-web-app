import { Fragment } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Diagram } from "./Diagram";

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
});
