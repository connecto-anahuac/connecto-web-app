import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const courses = { count: vi.fn(), bulkPut: vi.fn() };
  const plans = { count: vi.fn(), bulkPut: vi.fn() };
  const preRequisitos = { count: vi.fn(), bulkPut: vi.fn() };

  return {
    courses,
    plans,
    preRequisitos,
    universityDb: {
      open: vi.fn(),
      transaction: vi.fn(async (_mode, _tables, callback) => callback()),
      courses,
      plans,
      preRequisitos,
    },
  };
});

vi.mock("@/external/client/university-db", () => ({
  universityDb: mocks.universityDb,
}));

describe("initializeUniversityData", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    mocks.universityDb.open.mockResolvedValue(undefined);
    mocks.courses.count.mockResolvedValue(1);
    mocks.plans.count.mockResolvedValue(1);
    mocks.preRequisitos.count.mockResolvedValue(1);
  });

  it("skips network and writes when all reference tables are already populated", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const { initializeUniversityData } = await import("./initialize-university-data");

    await expect(initializeUniversityData()).resolves.toEqual({
      coursesSeeded: false,
      plansSeeded: false,
      preRequisitosSeeded: false,
    });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(mocks.universityDb.transaction).not.toHaveBeenCalled();
  });

  it("shares an in-flight initialization and writes only missing reference tables", async () => {
    mocks.courses.count.mockResolvedValue(0);
    mocks.plans.count.mockResolvedValue(2);
    mocks.preRequisitos.count.mockResolvedValue(0);
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue([
        {
          clave: { raw: "MAT101", code: "MAT", number: "101" },
          pre_requisito: [{ raw: "MAT001" }],
        },
      ]),
    });
    vi.stubGlobal("fetch", fetchMock);
    const { initializeUniversityData } = await import("./initialize-university-data");

    const [first, second] = await Promise.all([
      initializeUniversityData(),
      initializeUniversityData(),
    ]);

    expect(first).toEqual({
      coursesSeeded: true,
      plansSeeded: false,
      preRequisitosSeeded: true,
    });
    expect(second).toEqual(first);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(mocks.universityDb.transaction).toHaveBeenCalledTimes(1);
    expect(mocks.courses.bulkPut).toHaveBeenCalledTimes(1);
    expect(mocks.preRequisitos.bulkPut).toHaveBeenCalledTimes(1);
    expect(mocks.plans.bulkPut).not.toHaveBeenCalled();
  });
});
