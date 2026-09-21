import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import ProfessorAsignModal, { type AssignableProfessor } from "./ProfessorAsignModal";

describe("ProfessorAsignModal", () => {
  it("shows only active, course-capable candidates and exposes evaluated reasons", () => {
    const markup = renderToStaticMarkup(
      <ProfessorAsignModal professors={professors} searchValue="" onSearchValueChange={vi.fn()} onProfessorSelect={vi.fn()} />,
    );

    expect(markup).toContain("Ana Pérez");
    expect(markup).toContain("Luis Gómez");
    expect(markup).not.toContain("Inactive Professor");
    expect(markup).not.toContain("Not Capable Professor");
    expect(markup).toContain("No está disponible para clase semanal 2");
    expect(markup).toContain("disabled");
  });

  it("uses the controlled search value", () => {
    const markup = renderToStaticMarkup(
      <ProfessorAsignModal professors={professors} searchValue="ana" onSearchValueChange={vi.fn()} onProfessorSelect={vi.fn()} />,
    );
    expect(markup).toContain("Ana Pérez");
    expect(markup).not.toContain("Luis Gómez");
    expect(markup).toContain('value="ana"');
  });
});

const professors: AssignableProfessor[] = [
  { id: "ana", fullName: "Ana Pérez", assignedHours: 6, totalHours: 15, active: true, courseCapable: true, disabledReasons: [] },
  { id: "luis", fullName: "Luis Gómez", assignedHours: 9, totalHours: 15, active: true, courseCapable: true, disabledReasons: ["No está disponible para clase semanal 2"] },
  { id: "inactive", fullName: "Inactive Professor", assignedHours: 0, totalHours: 15, active: false, courseCapable: true, disabledReasons: [] },
  { id: "incapable", fullName: "Not Capable Professor", assignedHours: 0, totalHours: 15, active: true, courseCapable: false, disabledReasons: [] },
];
