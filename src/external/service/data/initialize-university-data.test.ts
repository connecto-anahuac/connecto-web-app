import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const courses = { count: vi.fn(), bulkPut: vi.fn() };
  const plans = { count: vi.fn(), bulkPut: vi.fn() };
  const preRequisitos = { count: vi.fn(), bulkPut: vi.fn() };
  const professors = { count: vi.fn(), bulkPut: vi.fn() };
  const professorCourseCapabilities = { count: vi.fn(), bulkPut: vi.fn() };
  const courseAssignments = { count: vi.fn(), bulkPut: vi.fn() };
  const professorAvailabilities = { count: vi.fn(), bulkPut: vi.fn() };
  const timeSlots = { count: vi.fn(), bulkPut: vi.fn() };
  const classrooms = { count: vi.fn(), bulkPut: vi.fn() };
  const studyPlans = { count: vi.fn(), bulkPut: vi.fn() };

  return {
    courses,
    plans,
    preRequisitos,
    professors,
    professorCourseCapabilities,
    courseAssignments,
    professorAvailabilities,
    timeSlots,
    classrooms,
    studyPlans,
    universityDb: {
      open: vi.fn(),
      transaction: vi.fn(async (_mode, _tables, callback) => callback()),
      courses,
      plans,
      preRequisitos,
      professors, professorCourseCapabilities, courseAssignments, professorAvailabilities,
      timeSlots, classrooms, studyPlans,
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
    mocks.professors.count.mockResolvedValue(1);
    mocks.professorCourseCapabilities.count.mockResolvedValue(1);
    mocks.courseAssignments.count.mockResolvedValue(1);
    mocks.professorAvailabilities.count.mockResolvedValue(1);
    mocks.timeSlots.count.mockResolvedValue(10);
    mocks.classrooms.count.mockResolvedValue(1);
    mocks.studyPlans.count.mockResolvedValue(1);
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

  it("seeds only an empty directory table without overwriting populated peers", async () => {
    mocks.classrooms.count.mockResolvedValue(0);
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        professors: [{ id: "P" }], capabilities: [], assignments: [], availabilities: [],
        classrooms: [{ id: "A", name: "Aula", place: "", note: "", equipments: [], admin: "" }],
        studyPlans: [],
      }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const { initializeUniversityData } = await import("./initialize-university-data");

    await initializeUniversityData();

    expect(mocks.classrooms.bulkPut).toHaveBeenCalledTimes(1);
    expect(mocks.professors.bulkPut).not.toHaveBeenCalled();
    expect(mocks.studyPlans.bulkPut).not.toHaveBeenCalled();
  });

  it("seeds weekday-aware professor availabilities", async () => {
    mocks.professorAvailabilities.count.mockResolvedValue(0);
    const availabilities = [
      { id: "AVL1", professorId: "P", period: "202520", day: "monday", timeSlotId: "T1", isAvailable: true },
    ];
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        professors: [], capabilities: [], assignments: [], availabilities, classrooms: [], studyPlans: [],
      }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const { initializeUniversityData } = await import("./initialize-university-data");

    await initializeUniversityData();

    expect(mocks.professorAvailabilities.bulkPut).toHaveBeenCalledWith(availabilities);
  });
});
