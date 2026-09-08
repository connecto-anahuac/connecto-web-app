import { describe, expect, it, vi } from "vitest";
import {
  clearLegacyProfessorAvailabilities,
  migrateLegacyStudyPlanIds,
  migratedStudyPlanId,
  normalizeLegacyPlans,
  UniversityDB,
} from "./university-db";

describe("v2 to v3 plan normalization", () => {
  it("preserves every relation and groups equal career/name rows", () => {
    const input = [
      { id: "1", name: "Plan 2020", career: "TIND", courseKey: "A", semester: 1, position: 1 },
      { id: "2", name: "Plan 2020", career: "TIND", courseKey: "B", semester: 1, position: 2 },
      { id: "3", name: "Plan 2020", career: "INCI", courseKey: "C", semester: 1, position: 1 },
    ];
    const result = normalizeLegacyPlans(input);
    expect(result.plans).toHaveLength(3);
    expect(result.studyPlans).toHaveLength(2);
    expect(result.plans[0].planId).toBe(result.plans[1].planId);
    expect(result.plans[2].planId).not.toBe(result.plans[0].planId);
    expect(result.studyPlans[0]).toMatchObject({ firstPeriod: "", admin: "" });
    expect(result.studyPlans[0].id).toBe("migrated:TIND:Plan 2020");
  });
});

describe("v3 to v4 migrated study-plan IDs", () => {
  it("rekeys legacy IDs and preserves every plan relation", () => {
    const legacyId = "migrated:TIND:plan%202020";
    const result = migrateLegacyStudyPlanIds(
      [{ id: legacyId, name: "plan 2020", career: "TIND", firstPeriod: "", admin: "" }],
      [
        { id: "1", name: "plan 2020", career: "TIND", courseKey: "A", semester: 1, position: 1, planId: legacyId },
        { id: "2", name: "other", career: "TIND", courseKey: "B", semester: 1, position: 2, planId: "seed-plan-tind" },
      ],
    );

    const expectedId = migratedStudyPlanId("TIND", "plan 2020");
    expect(result.legacyIds).toEqual([legacyId]);
    expect(result.studyPlans[0].id).toBe(expectedId);
    expect(result.plans[0].planId).toBe(expectedId);
    expect(result.plans[1].planId).toBe("seed-plan-tind");
  });

  it("does not delete IDs that already need no encoding", () => {
    const id = migratedStudyPlanId("TIND", "Plan");
    const result = migrateLegacyStudyPlanIds(
      [{ id, name: "Plan", career: "TIND", firstPeriod: "", admin: "" }],
      [{ id: "1", name: "Plan", career: "TIND", courseKey: "A", semester: 1, position: 1, planId: id }],
    );

    expect(result.legacyIds).toEqual([]);
    expect(result.studyPlans[0].id).toBe(id);
    expect(result.plans[0].planId).toBe(id);
  });
});

describe("v5 professor availability schema", () => {
  it("indexes availability by professor, period, and weekday", () => {
    const db = new UniversityDB();
    const indexes = db._dbSchema.professorAvailabilities.indexes.map((index) => index.name);

    expect(db.verno).toBe(5);
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
