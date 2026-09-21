import { describe, expect, it } from "vitest";

import { getPrerequisiteLinePath } from "./usePrerequisiteLines";

describe("getPrerequisiteLinePath", () => {
  const root = rect(100, 200, 500, 500);

  it("connects the facing horizontal card edges", () => {
    expect(
      getPrerequisiteLinePath(
        root,
        rect(120, 250, 100, 50),
        rect(320, 350, 100, 50),
      ),
    ).toBe("M 120 75 C 170 75 170 175 220 175");
  });

  it("connects the facing vertical card edges", () => {
    expect(
      getPrerequisiteLinePath(
        root,
        rect(150, 220, 100, 50),
        rect(170, 370, 100, 50),
      ),
    ).toBe("M 100 70 C 100 120 120 120 120 170");
  });
});

function rect(left: number, top: number, width: number, height: number) {
  return {
    left,
    top,
    right: left + width,
    bottom: top + height,
    width,
    height,
  };
}
