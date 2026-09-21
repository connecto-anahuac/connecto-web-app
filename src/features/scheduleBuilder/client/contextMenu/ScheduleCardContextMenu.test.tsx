import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import ScheduleCardContextMenu from "./ScheduleCardContextMenu";

const anchor = { getBoundingClientRect: () => new DOMRect(20, 20, 1, 1) };

describe("ScheduleCardContextMenu", () => {
  it("renders the controlled delete action only while open", () => {
    const openMarkup = renderToStaticMarkup(
      <ScheduleCardContextMenu anchor={anchor} open onDelete={vi.fn()} onOpenChange={vi.fn()} />,
    );
    const closedMarkup = renderToStaticMarkup(
      <ScheduleCardContextMenu anchor={anchor} open={false} onDelete={vi.fn()} onOpenChange={vi.fn()} />,
    );

    expect(openMarkup).toContain("Eliminar del horario");
    expect(closedMarkup).not.toContain("Eliminar del horario");
  });
});
