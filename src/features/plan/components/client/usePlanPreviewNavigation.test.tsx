import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePlanPreviewNavigation } from "./usePlanPreviewNavigation";

const mocks = vi.hoisted(() => ({ push: vi.fn(), replace: vi.fn(), usePathname: vi.fn(), useSearchParams: vi.fn() }));
vi.mock("next/navigation", () => ({ usePathname: mocks.usePathname, useRouter: () => ({ push: mocks.push, replace: mocks.replace }), useSearchParams: mocks.useSearchParams }));

describe("usePlanPreviewNavigation", () => {
  beforeEach(() => {
    mocks.push.mockReset(); mocks.replace.mockReset();
    mocks.usePathname.mockReturnValue("/plans");
    mocks.useSearchParams.mockReturnValue(new URLSearchParams("career=ISC&planId=old"));
  });
  it("preserves unrelated query values and encodes detail IDs", () => {
    const navigation = renderHook();
    navigation.closePlanPreview();
    navigation.openPlanDetail("A/B 1");
    expect(mocks.replace).toHaveBeenCalledWith("/plans?career=ISC");
    expect(mocks.push).toHaveBeenCalledWith("/plans/A%2FB%201");
  });

  it("encodes a migrated ID exactly once for a route segment", () => {
    const navigation = renderHook();
    navigation.openPlanDetail("migrated:TIND:plan 2020");
    expect(mocks.push).toHaveBeenCalledWith("/plans/migrated%3ATIND%3Aplan%202020");
  });
});

function renderHook() {
  let value: ReturnType<typeof usePlanPreviewNavigation> | undefined;
  function Probe() { value = usePlanPreviewNavigation(); return null; }
  renderToStaticMarkup(createElement(Probe));
  if (!value) throw new Error("Navigation hook did not render");
  return value;
}
