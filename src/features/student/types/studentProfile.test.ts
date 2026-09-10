import { describe, expect, it } from "vitest";
import { toStudentStatus } from "./studentProfile";
import { StudentStatus } from "@/shared/types/consts";

describe("toStudentStatus", () => {
  it("normalizes persisted casing and accents", () => {
    expect(toStudentStatus("Inactivo")).toBe(StudentStatus.INACTIVE);
    expect(toStudentStatus("Baja Académica")).toBe(
      StudentStatus.BAJA_ACADEMICA,
    );
  });

  it("falls back safely for unknown values", () => {
    expect(toStudentStatus("unknown")).toBe(StudentStatus.INACTIVE);
  });
});
