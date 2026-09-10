import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useProfessorNavigation } from "./useProfessorNavigation";

const mocks = vi.hoisted(() => ({ push: vi.fn(), replace: vi.fn(), usePathname: vi.fn(), useSearchParams: vi.fn() }));

vi.mock("next/navigation", () => ({
  usePathname: mocks.usePathname,
  useRouter: () => ({ push: mocks.push, replace: mocks.replace }),
  useSearchParams: mocks.useSearchParams,
}));

describe("useProfessorNavigation", () => {
  beforeEach(() => {
    mocks.push.mockReset();
    mocks.replace.mockReset();
    mocks.usePathname.mockReturnValue("/professors");
    mocks.useSearchParams.mockReturnValue(new URLSearchParams("period=20261&career=ISC"));
  });

  it("selects and closes a preview without dropping other query values", () => {
    renderHook().selectProfessor("P/1");
    expect(mocks.replace).toHaveBeenCalledWith("/professors?period=20261&career=ISC&professorId=P%2F1");

    mocks.useSearchParams.mockReturnValue(new URLSearchParams("period=20261&professorId=P%2F1"));
    renderHook().closePreview();
    expect(mocks.replace).toHaveBeenLastCalledWith("/professors?period=20261");
  });

  it("encodes the id and preserves period when opening detail", () => {
    renderHook().openDetail("P/1 A");
    expect(mocks.push).toHaveBeenCalledWith("/professors/P%2F1%20A?period=20261");
  });

  it("changes only period", () => {
    renderHook().setPeriod("20262");
    expect(mocks.replace).toHaveBeenCalledWith("/professors?period=20262&career=ISC");
  });
});

function renderHook() {
  let result: ReturnType<typeof useProfessorNavigation> | undefined;
  function Probe() { result = useProfessorNavigation(); return null; }
  renderToStaticMarkup(createElement(Probe));
  if (!result) throw new Error("Navigation hook did not render");
  return result;
}
