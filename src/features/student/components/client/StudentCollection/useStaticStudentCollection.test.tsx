import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Period } from "@/shared/types/Period";
import type { StudentCollectionSummaryDto } from "@/external/dto/student/student-collection.dto";
import type { StudentCollectionItem } from "./studentCollection.type";
import { useStaticStudentCollection } from "./useStaticStudentCollection";
import { StudentStatus } from "@/shared/types/consts";

const mocks = vi.hoisted(() => ({
  fetchStudentCollectionSummaries: vi.fn(),
  useLiveQuery: vi.fn(),
}));

vi.mock("dexie-react-hooks", () => ({
  useLiveQuery: mocks.useLiveQuery,
}));

vi.mock("@/external/handler/students/query.client", () => ({
  fetchStudentCollectionSummaries: mocks.fetchStudentCollectionSummaries,
}));

describe("useStaticStudentCollection", () => {
  beforeEach(() => {
    mocks.fetchStudentCollectionSummaries.mockReset();
    mocks.useLiveQuery.mockReset();
  });

  it("returns the pre-aggregated summaries", () => {
    const studentCollection = [
      studentCollectionItem("1", "Ada"),
      studentCollectionItem("2", "Lin"),
    ];
    mocks.useLiveQuery.mockReturnValue({ status: "success", studentCollection });

    expect(renderHook()).toEqual({
      loading: false,
      errorMessage: undefined,
      studentCollection,
    });
  });

  it("reports loading until the live query resolves", () => {
    mocks.useLiveQuery.mockReturnValue(undefined);

    expect(renderHook()).toEqual({
      loading: true,
      errorMessage: undefined,
      studentCollection: [],
    });
  });

  it("maps handler summaries to table rows without loading individual plans", async () => {
    let query: (() => Promise<unknown>) | undefined;
    mocks.useLiveQuery.mockImplementation((callback) => {
      query = callback;
      return undefined;
    });
    mocks.fetchStudentCollectionSummaries.mockResolvedValue([
      studentCollectionSummary("1", "Ada"),
    ]);

    renderHook();

    await expect(query?.()).resolves.toEqual({
      status: "success",
      studentCollection: [studentCollectionItem("1", "Ada", 6)],
    });
  });

  it("reports an error when the summary query fails", async () => {
    let query: (() => Promise<unknown>) | undefined;
    mocks.useLiveQuery.mockImplementation((callback) => {
      query = callback;
      return undefined;
    });
    mocks.fetchStudentCollectionSummaries.mockRejectedValue(
      new Error("database unavailable"),
    );
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);

    expect(renderHook()).toEqual({
      loading: true,
      errorMessage: undefined,
      studentCollection: [],
    });
    await expect(query?.()).resolves.toEqual({ status: "error" });
    expect(mocks.fetchStudentCollectionSummaries).toHaveBeenCalledOnce();
    expect(error).toHaveBeenCalledWith(
      "Failed loading student collection",
      expect.any(Error),
    );

    error.mockRestore();
  });
});

function renderHook() {
  let value: ReturnType<typeof useStaticStudentCollection> | undefined;

  function Probe() {
    value = useStaticStudentCollection();
    return null;
  }

  renderToStaticMarkup(createElement(Probe));
  return value;
}

function studentCollectionItem(
  id: string,
  name: string,
  avatarColorRef = 0,
): StudentCollectionItem {
  return {
    studentId: id,
    name,
    avatarColorRef,
    status: StudentStatus.ACTIVE,
    career: "Industrial",
    enrolledPeriod: new Period("202460"),
    currentSemester: 3,
    classProgress: 50,
    failedClassCount: 1,
    contacts: "",
  };
}

function studentCollectionSummary(
  id: string,
  name: string,
  avatarColorRef = 6,
): StudentCollectionSummaryDto {
  return {
    id,
    name,
    status: "activo",
    career: "Industrial",
    enrolledPeriod: new Period("202460"),
    semesterCount: { regular: 3, summer: 0 },
    currentSemester: 3,
    avatarColorRef,
    failCount: 0,
    classProgress: 50,
    failedClassCount: 1,
  };
}
