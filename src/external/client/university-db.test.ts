import { describe, expect, it, vi } from "vitest";
import {
  clearLegacyProfessorAvailabilities,
  normalizePlansByCareer,
  UniversityDB,
} from "./university-db";

describe("plan IDs", () => {
  it("uses career as the study-plan and relation ID", () => {
    const result = normalizePlansByCareer(
      [{ id: "seed-plan-tind", name: "plan 2020", career: "TIND", firstPeriod: "202010", admin: "Admin" }],
      [
        { id: "1", name: "plan 2020", career: "TIND", courseKey: "A", semester: 1, position: 1, planId: "seed-plan-tind" },
        { id: "2", name: "old", career: "INCI", courseKey: "B", semester: 1, position: 2 },
      ],
    );

    expect(result.studyPlans).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: "TIND", name: "TIND", career: "TIND" }),
      expect.objectContaining({ id: "INCI", name: "INCI", career: "INCI" }),
    ]));
    expect(result.plans).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: "1", name: "TIND", planId: "TIND" }),
      expect.objectContaining({ id: "2", name: "INCI", planId: "INCI" }),
    ]));
    expect(result.obsoleteStudyPlanIds).toEqual(["seed-plan-tind"]);
  });
});

describe("v5 professor availability schema", () => {
  it("indexes availability by professor, period, and weekday", () => {
    const db = new UniversityDB();
    const indexes = db._dbSchema.professorAvailabilities.indexes.map((index) => index.name);

    expect(db.verno).toBe(7);
    expect(indexes).toContain("day");
    expect(indexes).toContain("[professorId+period+day]");
    db.close();
  });

  it("clears legacy availability records during the upgrade", async () => {
    const availabilities = { clear: vi.fn().mockResolvedValue(undefined) };

    await clearLegacyProfessorAvailabilities(availabilities);

    expect(availabilities.clear).toHaveBeenCalledOnce();
  });
});
