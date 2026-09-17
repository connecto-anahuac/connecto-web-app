import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ScheduleEmptyCell from "./ScheduleEmptyCell";

describe("ScheduleEmptyCell", () => {
  it.each(["default", "highlighted", "invalid", "drag-over"] as const)(
    "renders the %s state",
    (status) => {
      const markup = renderToStaticMarkup(
        <ScheduleEmptyCell status={status} avatars={[]} />,
      );

      expect(markup).toContain(`data-state="${status}"`);
      if (status === "invalid") expect(markup).toContain('data-invalid="true"');
      if (status === "drag-over") expect(markup).toContain('data-drag-over="true"');
    },
  );

  it("renders controlled professor avatars", () => {
    const markup = renderToStaticMarkup(
      <ScheduleEmptyCell
        avatars={[
          { id: "prof-1", fullName: "Isabel Torres", color: "#123456" },
          { id: "prof-2", fullName: "Pedro Ortega" },
        ]}
      />,
    );

    expect(markup).toContain("background-color:#123456");
    expect(markup).toContain(">I<");
    expect(markup).toContain(">P<");
  });
});
