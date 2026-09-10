import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useClassroomPreviewNavigation } from "./useClassroomPreviewNavigation";

const mocks = vi.hoisted(() => ({ push: vi.fn(), replace: vi.fn(), usePathname: vi.fn(), useSearchParams: vi.fn() }));
vi.mock("next/navigation", () => ({ usePathname: mocks.usePathname, useRouter: () => ({ push: mocks.push, replace: mocks.replace }), useSearchParams: mocks.useSearchParams }));

describe("useClassroomPreviewNavigation", () => {
  beforeEach(() => {
    mocks.push.mockReset(); mocks.replace.mockReset();
    mocks.usePathname.mockReturnValue("/classrooms");
    mocks.useSearchParams.mockReturnValue(new URLSearchParams("period=202601&classroomId=old"));
  });
  it("preserves unrelated query values and encodes detail IDs", () => {
    const navigation = renderHook();
    navigation.closeClassroomPreview();
    navigation.openClassroomDetail("A/B 1");
    expect(mocks.replace).toHaveBeenCalledWith("/classrooms?period=202601");
    expect(mocks.push).toHaveBeenCalledWith("/classrooms/A%2FB%201");
  });
});

function renderHook() {
  let value: ReturnType<typeof useClassroomPreviewNavigation> | undefined;
  function Probe() { value = useClassroomPreviewNavigation(); return null; }
  renderToStaticMarkup(createElement(Probe));
  if (!value) throw new Error("Navigation hook did not render");
  return value;
}
