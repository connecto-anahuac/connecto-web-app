import { describe, expect, it } from "vitest";
import type { OfferingCourseDto } from "@/external/dto/offering-course/offering-course.dto";
import { createOfferingCoursesLoader } from "./useOfferingCourses";

describe("createOfferingCoursesLoader", () => {
  it("ignores an old career response that resolves after a newer request", async () => {
    const requests = new Map<
      string,
      (items: OfferingCourseDto[]) => void
    >();
    const loader = createOfferingCoursesLoader(
      (career) =>
        new Promise((resolve) => {
          requests.set(career, resolve);
        }),
    );

    const oldRequest = loader.load("OLD");
    const newRequest = loader.load("NEW");
    requests.get("NEW")?.([course("NEW-101")]);

    await expect(newRequest).resolves.toMatchObject({
      offeringCourses: [{ key: "NEW-101" }],
    });

    requests.get("OLD")?.([course("OLD-101")]);
    await expect(oldRequest).resolves.toBeNull();
  });
});

function course(key: string): OfferingCourseDto {
  return {
    block: "A",
    credits: 6,
    estimatedNumber: 10,
    hours: 5,
    key,
    keyCode: key.split("-")[0]!,
    keyNumber: "101",
    name: key,
    position: 0,
    preRequisites: [],
    semester: 2,
  };
}
