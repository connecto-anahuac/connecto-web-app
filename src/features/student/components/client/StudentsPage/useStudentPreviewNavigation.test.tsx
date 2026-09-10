import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useStudentPreviewNavigation } from "./useStudentPreviewNavigation";

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  usePathname: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: mocks.usePathname,
  useRouter: () => ({ push: mocks.push, replace: mocks.replace }),
  useSearchParams: mocks.useSearchParams,
}));

describe("useStudentPreviewNavigation", () => {
  beforeEach(() => {
    mocks.push.mockReset();
    mocks.replace.mockReset();
    mocks.usePathname.mockReturnValue("/students");
    mocks.useSearchParams.mockReturnValue(new URLSearchParams("career=ISC"));
  });

  it("replaces the selected student while preserving unrelated search params", () => {
    renderHook().selectStudent("1111");

    expect(mocks.replace).toHaveBeenCalledWith(
      "/students?career=ISC&studentId=1111",
    );
  });

  it("removes only studentId when closing the preview", () => {
    mocks.useSearchParams.mockReturnValue(
      new URLSearchParams("career=ISC&studentId=1111"),
    );

    renderHook().closeStudentPreview();

    expect(mocks.replace).toHaveBeenCalledWith("/students?career=ISC");
  });

  it("pushes an encoded route for the full student detail page", () => {
    renderHook().openStudentDetail("A/B 1");

    expect(mocks.push).toHaveBeenCalledWith("/students/A%2FB%201");
  });
});

function renderHook() {
  let value: ReturnType<typeof useStudentPreviewNavigation> | undefined;

  function Probe() {
    value = useStudentPreviewNavigation();
    return null;
  }

  renderToStaticMarkup(createElement(Probe));
  if (!value) {
    throw new Error("Navigation hook did not render");
  }
  return value;
}
