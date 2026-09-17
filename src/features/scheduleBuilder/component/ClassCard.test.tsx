import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ScheduleClassCard from "./ClassCard";

describe("ScheduleClassCard", () => {
  it("keeps the default presentation compatible", () => {
    const markup = renderToStaticMarkup(<ScheduleClassCard {...baseProps} />);

    expect(markup).toContain('data-hasalert="false"');
    expect(markup).toContain('data-isdisable="false"');
    expect(markup).toContain('data-isselected="false"');
    expect(markup).toContain("Arquitectura");
  });

  it("exposes controlled card states and accepts DnD props on the card", () => {
    const markup = renderToStaticMarkup(
      <ScheduleClassCard
        {...baseProps}
        selected
        completed
        warning
        dragging
        disabled
        aria-describedby="drag-instructions"
        aria-label="Mover clase"
      />,
    );

    expect(markup).toContain('data-hasalert="true"');
    expect(markup).toContain('data-completed="true"');
    expect(markup).toContain('data-dragging="true"');
    expect(markup).toContain('aria-disabled="true"');
    expect(markup).toContain('aria-describedby="drag-instructions"');
    expect(markup).toContain('aria-label="Mover clase"');
    expect(markup).not.toContain("Arrastrar clase");
  });
});

const baseProps = {
  courseCode: "TIND",
  courseNumber: 402,
  hours: 6,
  title: "Arquitectura",
  recommendedSemester: 8,
};
